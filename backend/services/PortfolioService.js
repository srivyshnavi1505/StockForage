import axios from 'axios'
import { config } from 'dotenv'
import { portfolioModel } from '../models/Portfolio.js'
config()

async function getLivePrice(symbol) {
    try {
        const { data } = await axios.get('https://finnhub.io/api/v1/quote', {
            params: { symbol, token: process.env.FINN_APIKEY }
        })
        return data.c || 0  //data.c is finnhub's fieldname for the current/close price
    } catch {
        return 0
    }
}

export async function getPortfolioWithPnL(userId) {

    const portfolio = await portfolioModel.findOne({ user: userId }).lean()
    //.lean() => the actual use of lean here is by default mongoose return heavy doc obj with lots of internal methods in it , so lean strips it all and gives plain js obj 
    //in portfolio, the data is  only  read , we are not saving anything  
    // User has no portfolio yet
    if (!portfolio || portfolio.holdings.length === 0) {
        //2 cases : 1.the user has nveer made a trade so no portfolio exists yet, so we return 0 
        //2.user exists but sold everything , so we return 0 
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

    // Fetch all live prices in parallel - very imp 
    const livePrices = await Promise.all(
        portfolio.holdings.map(h => getLivePrice(h.symbol))
    )
    //promise.all() => the flow will be parallel without wait [all the req fire at the same time =>wait for all =>done] 
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


