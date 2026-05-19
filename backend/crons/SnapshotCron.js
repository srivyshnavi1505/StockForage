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

// Run every 5 minutes during market hours (Mon–Fri, 9am–4pm)
// Reduced from every minute to avoid hitting Finnhub rate limit (60 req/min free plan)
export function startStockSnapshotCron() {
    cron.schedule('*/5 9-15 * * 1-5', async () => {
        try {
            const symbols = await getTrackedSymbols()
            if (symbols.length === 0) return

            // Stagger requests — 2 seconds apart to stay under rate limit
            for (let i = 0; i < symbols.length; i++) {
                setTimeout(async () => {
                    try {
                        await fetchAndStoreSnapshot(symbols[i])
                    } catch (err) {
                        console.error(`[StockSnapshot] Failed for ${symbols[i]}:`, err.message)
                    }
                }, i * 2000)
            }
        } catch (err) {
            console.error('[StockSnapshot] Cron error:', err.message)
        }
    })

    console.log('[StockSnapshot] Cron started — snapshots every 5 min on weekdays 9am–4pm')
}