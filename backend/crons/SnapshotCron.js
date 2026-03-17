import cron from 'node-cron'
import axios from 'axios'
import { config } from 'dotenv'
import { stockSnapshotModel } from '../models/StockSnapshot.js'
import { portfolioModel } from '../models/Portfolio.js'
config()

// Derive the live list of symbols from all portfolios in the DB
async function getTrackedSymbols() {
    const portfolios = await portfolioModel.find({}, 'holdings.symbol').lean()
    const symbolSet = new Set()
    for (const p of portfolios) {
        for (const h of p.holdings) {
            symbolSet.add(h.symbol)
        }
    }
    return [...symbolSet]
}

async function fetchAndStoreSnapshot(symbol) {
    const token = process.env.FINN_APIKEY
    const { data } = await axios.get('https://finnhub.io/api/v1/quote', {
        params: { symbol, token }
    })

    // Finnhub returns 0s for all fields when the symbol is invalid or market is closed
    if (!data.c || data.c === 0) return

    await stockSnapshotModel.create({
        symbol,
        open:  data.o,
        high:  data.h,
        low:   data.l,
        close: data.c,
        recordedAt: new Date(),
    })
}

// Run every minute during market hours (Mon–Fri, 9:30am–4:00pm EST)
// Cron format: second(optional) minute hour day month weekday
// node-cron uses local server time — adjust if server is not in EST
export function startStockSnapshotCron() {
    cron.schedule('* 9-15 * * 1-5', async () => {
        try {
            const symbols = await getTrackedSymbols()
            if (symbols.length === 0) return

            // Stagger requests to avoid hitting Finnhub rate limit (60 req/min on free plan)
            for (let i = 0; i < symbols.length; i++) {
                setTimeout(async () => {
                    try {
                        await fetchAndStoreSnapshot(symbols[i])
                    } catch (err) {
                        console.error(`[StockSnapshot] Failed for ${symbols[i]}:`, err.message)
                    }
                }, i * 1000) // 1 second apart
            }
        } catch (err) {
            console.error('[StockSnapshot] Cron error:', err.message)
        }
    })

    console.log('[StockSnapshot] Cron started — snapshots every minute on weekdays 9am–4pm')
}