import axios from 'axios'
import { config } from 'dotenv'
import { portfolioModel } from '../models/Portfolio.js'
config()

async function getLivePrice(symbol) {
    try {
        const { data } = await axios.get('https://finnhub.io/api/v1/quote', {
            params: { symbol, token: process.env.FINN_APIKEY }
        })
        return data.c || 0
    } catch {
        return 0
    }
}

export async function getPortfolioWithPnL(userId) {

    const portfolio = await portfolioModel.findOne({ user: userId }).lean()

    // User has no portfolio yet
    if (!portfolio || portfolio.holdings.length === 0) {
        return {
            holdings: [],
            summary: {
                totalInvested: 0,
                totalValue:    0,
                totalPnl:      0,
                totalPnlPct:   0,
            }
        }
    }

    // Fetch all live prices in parallel
    const livePrices = await Promise.all(
        portfolio.holdings.map(h => getLivePrice(h.symbol))
    )

    // Build enriched holdings array
    const holdings = portfolio.holdings.map((h, i) => {
        const livePrice    = livePrices[i]
        const invested     = h.quantity * h.avgBuyPrice
        const currentValue = h.quantity * livePrice
        const pnl          = currentValue - invested
        const pnlPct       = invested > 0 ? (pnl / invested) * 100 : 0

        return {
            symbol:       h.symbol,
            companyName:  h.companyName || '',
            quantity:     h.quantity,
            avgBuyPrice:  h.avgBuyPrice,
            livePrice,
            invested:     +invested.toFixed(2),
            currentValue: +currentValue.toFixed(2),
            pnl:          +pnl.toFixed(2),
            pnlPct:       +pnlPct.toFixed(2),
        }
    })

    // Aggregate into summary
    const totalInvested = holdings.reduce((sum, h) => sum + h.invested, 0)
    const totalValue    = holdings.reduce((sum, h) => sum + h.currentValue, 0)
    const totalPnl      = totalValue - totalInvested
    const totalPnlPct   = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0

    return {
        holdings,
        summary: {
            totalInvested: +totalInvested.toFixed(2),
            totalValue:    +totalValue.toFixed(2),
            totalPnl:      +totalPnl.toFixed(2),
            totalPnlPct:   +totalPnlPct.toFixed(2),
        }
    }
}


