import exp from 'express'
import axios from 'axios'
import { config } from 'dotenv'
import { stockSnapshotModel } from '../models/StockSnapshot.js'
config()

export const FetchStockInfo = exp.Router()

// Simple in-memory cache: { key -> { data, expiresAt } }
const cache = new Map()

function getCache(key) {
    const entry = cache.get(key)
    if (entry && Date.now() < entry.expiresAt) return entry.data
    cache.delete(key)
    return null
}

function setCache(key, data, ttlMs) {
    cache.set(key, { data, expiresAt: Date.now() + ttlMs })
}

// Well-known, high-demand tickers — these appear first
const PRIORITY_TICKERS = new Set([
    'AAPL','MSFT','AMZN','GOOGL','GOOG','META','TSLA','NVDA','BRK.B','JPM',
    'JNJ','V','PG','UNH','HD','MA','DIS','PYPL','ADBE','NFLX',
    'CRM','INTC','CMCSA','PEP','KO','ABT','CSCO','AVGO','TMO','ACN',
    'NKE','MRK','COST','WMT','DHR','MDT','LLY','TXN','NEE','PM',
    'ORCL','UNP','AMGN','HON','LOW','IBM','BMY','RTX','SBUX','GS',
    'BA','CAT','DE','MMM','GE','AXP','CVX','XOM','COP','SLB',
    'AMD','QCOM','MU','AMAT','LRCX','MRVL','SNPS','CDNS','KLAC','ADI',
    'UBER','ABNB','SQ','SHOP','SNOW','PLTR','COIN','RBLX','U','DKNG',
    'LMT','NOC','GD','HII','TDG','SPOT','ZM','DOCU','NET','CRWD',
    'ZS','PANW','FTNT','DDOG','MDB','TEAM','WDAY','NOW','VEEV','TWLO',
    'F','GM','RIVN','LCID','NIO','XPEV','LI','WBD','PARA','FOX',
    'T','VZ','TMUS','CHTR','ROKU','TTD','PINS','SNAP','DASH','LYFT',
    'PFE','MRNA','BNTX','REGN','VRTX','BIIB','GILD','AZN','NVO','ABBV',
    'BLK','SCHW','MS','C','WFC','USB','PNC','TFC','BAC','AIG',
    'SPY','QQQ','IWM','DIA','VOO','VTI','ARKK','XLF','XLE','XLK'
])

const MAX_SYMBOLS = 1000

// GET /stock/symbols — returns top 1000 US stock symbols (cached 5 min)
FetchStockInfo.get('/symbols', async (req, res) => {
    try {
        const cached = getCache('symbols')
        if (cached) return res.status(200).json({ payload: cached })

        const APIkey = process.env.FINN_APIKEY
        const response = await axios.get(`https://finnhub.io/api/v1/stock/symbol`, {
            params: { exchange: 'US', token: APIkey }
        })
        const allStocks = response.data
            .filter(s => s.type === 'Common Stock' && s.symbol && s.description
                && !s.symbol.includes('-') && !s.symbol.includes('.'))
            .map(s => ({ symbol: s.symbol, companyName: s.description }))

        // Priority tickers first, then the rest alphabetically
        const priority = allStocks.filter(s => PRIORITY_TICKERS.has(s.symbol))
        const rest = allStocks
            .filter(s => !PRIORITY_TICKERS.has(s.symbol))
            .sort((a, b) => a.symbol.localeCompare(b.symbol))

        const symbols = [...priority, ...rest].slice(0, MAX_SYMBOLS)

        setCache('symbols', symbols, 5 * 60 * 1000) // cache 5 min
        res.status(200).json({ payload: symbols })
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch symbol list', payload: err.message })
    }
})

// GET /stock/history/:symbol — historical OHLC data (cached 5 min)
// Primary: Finnhub candles API (real multi-day history)
// Fallback: local StockSnapshot DB (aggregated by day)
FetchStockInfo.get('/history/:symbol', async (req, res) => {
    try {
        const sym = req.params.symbol.toUpperCase()
        const days = parseInt(req.query.days) || 30

        const cacheKey = `history_${sym}_${days}`
        const cached = getCache(cacheKey)
        if (cached) return res.status(200).json({ payload: cached })

        const APIkey = process.env.FINN_APIKEY
        const now = Math.floor(Date.now() / 1000)
        const from = now - (days * 24 * 60 * 60)

        // Primary: Finnhub stock candles API — gives proper multi-day OHLC
        try {
            const candles = await axios.get('https://finnhub.io/api/v1/stock/candle', {
                params: { symbol: sym, resolution: 'D', from, to: now, token: APIkey }
            })

            if (candles.data.s === 'ok' && candles.data.t && candles.data.t.length > 1) {
                const data = candles.data.t.map((timestamp, i) => ({
                    date: new Date(timestamp * 1000),
                    open: candles.data.o[i],
                    high: candles.data.h[i],
                    low: candles.data.l[i],
                    close: candles.data.c[i]
                }))
                setCache(cacheKey, data, 5 * 60 * 1000)
                return res.status(200).json({ payload: data })
            }
        } catch (candleErr) {
            console.error(`[History] Finnhub candles failed for ${sym}:`, candleErr.message)
        }

        // Fallback: local StockSnapshot DB, aggregated by date
        const since = new Date(now * 1000 - days * 24 * 60 * 60 * 1000)
        const snapshots = await stockSnapshotModel
            .find({ symbol: sym, recordedAt: { $gte: since } })
            .sort({ recordedAt: 1 })
            .lean()

        if (snapshots.length > 0) {
            // Aggregate by day — take first open, max high, min low, last close
            const byDay = {}
            for (const s of snapshots) {
                const dayKey = new Date(s.recordedAt).toISOString().slice(0, 10)
                if (!byDay[dayKey]) {
                    byDay[dayKey] = { date: dayKey, open: s.open, high: s.high, low: s.low, close: s.close }
                } else {
                    byDay[dayKey].high = Math.max(byDay[dayKey].high, s.high)
                    byDay[dayKey].low = Math.min(byDay[dayKey].low, s.low)
                    byDay[dayKey].close = s.close // last entry of the day
                }
            }
            const data = Object.values(byDay)
            setCache(cacheKey, data, 5 * 60 * 1000)
            return res.status(200).json({ payload: data })
        }

        // No data from either source
        setCache(cacheKey, [], 2 * 60 * 1000)
        res.status(200).json({ payload: [] })
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch stock history', payload: err.message })
    }
})
// POST /stock/batch — fetch quotes for multiple symbols in one call
// Body: { symbols: ["AAPL", "MSFT", ...] }
FetchStockInfo.post('/batch', async (req, res) => {
    try {
        const { symbols } = req.body
        if (!Array.isArray(symbols) || symbols.length === 0) {
            return res.status(400).json({ message: 'symbols array required' })
        }

        const APIkey = process.env.FINN_APIKEY
        const results = {}

        // Fetch all in parallel, using cache where possible
        await Promise.all(symbols.map(async (rawSym) => {
            const sym = rawSym.toUpperCase()
            const cached = getCache(sym)
            if (cached) {
                results[sym] = cached
                return
            }

            try {
                const quote = await axios.get('https://finnhub.io/api/v1/quote', {
                    params: { symbol: sym, token: APIkey }
                })
                const payload = {
                    open: quote.data.o,
                    high: quote.data.h,
                    low: quote.data.l,
                    current: quote.data.c,
                    previousClose: quote.data.pc,
                    change: quote.data.pc
                        ? (((quote.data.c - quote.data.pc) / quote.data.pc) * 100).toFixed(2) + '%'
                        : 'N/A'
                }
                setCache(sym, payload, 15 * 1000)
                results[sym] = payload
            } catch {
                results[sym] = null
            }
        }))

        res.status(200).json({ payload: results })
    } catch (err) {
        res.status(500).json({ message: 'Batch fetch failed', payload: err.message })
    }
})

// GET /stock/:symbol — returns quote data only (cached 15s)
// companyName is no longer fetched here — it comes from /stock/symbols
FetchStockInfo.get('/:symbol', async (req, res) => {
    try {
        const sym = req.params.symbol.toUpperCase()
        const APIkey = process.env.FINN_APIKEY

        const cached = getCache(sym)
        if (cached) return res.status(200).json({ payload: cached })

        const quote = await axios.get(`https://finnhub.io/api/v1/quote`, {
            params: { symbol: sym, token: APIkey }
        })

        const payload = {
            open: quote.data.o,
            high: quote.data.h,
            low: quote.data.l,
            current: quote.data.c,
            previousClose: quote.data.pc,
            change: quote.data.pc
                ? (((quote.data.c - quote.data.pc) / quote.data.pc) * 100).toFixed(2) + '%'
                : 'N/A'
        }

        setCache(sym, payload, 15 * 1000) // cache 15s
        res.status(200).json({ message: 'Quote data', payload })
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch stock data', payload: err.message })
    }
})