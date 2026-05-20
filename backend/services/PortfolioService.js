import axios from 'axios'
import { config } from 'dotenv'
import { portfolioModel } from '../models/Portfolio.js'
import { userModel } from '../models/usermodel.js'
config()

export async function getPortfolioWithPnL(userId) {

    const user = await userModel.findById(userId).lean()
    const portfolio = await portfolioModel.findOne({ user: userId }).lean()
    
    const initialCash = 1000000 // default starting cash
    const userCash = user ? user.cash : initialCash

    // User has no portfolio yet
    if (!portfolio || portfolio.holdings.length === 0) {
        const totalPnl = userCash - initialCash
        return {
            holdings: [],
            summary: {
                totalInvested: 0,
                totalValue:    0,
                totalPnl:      +totalPnl.toFixed(2),
                totalPnlPct:   0,
            }
        }
    }

    const finnhubKey = process.env.FINN_APIKEY;

    // Build enriched holdings array fetching live prices
    const holdings = await Promise.all(portfolio.holdings.map(async (h) => {
        let livePrice = h.avgBuyPrice; 
        
        try {
            const quote = await axios.get(`https://finnhub.io/api/v1/quote`, {
                params: { symbol: h.symbol, token: finnhubKey }
            });
            if (quote.data && quote.data.c) {
                livePrice = quote.data.c;
            }
        } catch (err) {
            console.error(`Failed to fetch live price for ${h.symbol}:`, err.message);
        }

        const invested     = h.quantity * h.avgBuyPrice;
        const currentValue = h.quantity * livePrice;
        const pnl          = currentValue - invested;
        const pnlPct       = invested > 0 ? (pnl / invested) * 100 : 0;

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
    }));

    // Aggregate into summary
    const totalInvested = holdings.reduce((sum, h) => sum + h.invested, 0)
    const totalValue    = holdings.reduce((sum, h) => sum + h.currentValue, 0)
    // Total PnL is realized profit + unrealized profit
    const totalPnl      = (userCash + totalValue) - initialCash
    const totalPnlPct   = (totalPnl / initialCash) * 100

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
