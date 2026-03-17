import axios from 'axios'
import { config } from 'dotenv'
import { userModel } from '../models/usermodel.js'
import { portfolioModel } from '../models/Portfolio.js'
import { tradeModel } from '../models/Trade.js'
import { portfolioSnapshotModel } from '../models/PortfolioSnapshot.js'
config()

async function getLivePrice(symbol) {
    const { data } = await axios.get('https://finnhub.io/api/v1/quote', {
        params: { symbol, token: process.env.FINN_APIKEY }
    })
    if (!data.c || data.c === 0) {
        const err = new Error(`Could not fetch live price for ${symbol}`)
        err.status = 502
        throw err
    }
    return data.c
}

export async function executeTrade({ userId, symbol, type, quantity }) {

    // 1. Fetch live price
    const livePrice = await getLivePrice(symbol)
    const total = +(livePrice * quantity).toFixed(2)

    // 2. Load user and portfolio
    const user = await userModel.findById(userId)
    if (!user) {
        const err = new Error('User not found')
        err.status = 404
        throw err
    }

    let portfolio = await portfolioModel.findOne({ user: userId })
    if (!portfolio) {
        portfolio = new portfolioModel({ user: userId, holdings: [] })
    }

    // 3. Save originals for rollback
    const originalCash     = user.cash
    const originalHoldings = portfolio.holdings.map(h => ({...h.toObject()}))

    try {

        //── BUY 
        if (type === 'BUY') {
            if (user.cash < total) {
                const err = new Error(
                    `Insufficient funds. Need ₹${total}, available ₹${user.cash.toFixed(2)}`
                )
                err.status = 400
                throw err
            }

            user.cash = +(user.cash - total).toFixed(2)

            const existing = portfolio.holdings.find(h => h.symbol === symbol)
            if (existing) {
                const newAvg =
                    (existing.quantity * existing.avgBuyPrice + quantity * livePrice) /
                    (existing.quantity + quantity)
                existing.avgBuyPrice = +newAvg.toFixed(2)
                existing.quantity    = existing.quantity + quantity
            } else {
                portfolio.holdings.push({
                    symbol,
                    quantity,
                    avgBuyPrice: livePrice,
                    boughtAt: new Date(),
                })
            }
        }

        // SELL 
        if (type === 'SELL') {
            const existing = portfolio.holdings.find(h => h.symbol === symbol)

            if (!existing) {
                const err = new Error(`You do not hold any shares of ${symbol}`)
                err.status = 400
                throw err
            }
            if (existing.quantity < quantity) {
                const err = new Error(
                    `Insufficient shares. You hold ${existing.quantity}, tried to sell ${quantity}`
                )
                err.status = 400
                throw err
            }

            user.cash = +(user.cash + total).toFixed(2)

            if (existing.quantity === quantity) {
                portfolio.holdings = portfolio.holdings.filter(h => h.symbol !== symbol)
            } else {
                existing.quantity = existing.quantity - quantity
            }
        }

        // 4. Save user and portfolio
        await user.save()
        await portfolio.save()

        // 5. Log the trade
        await tradeModel.create({
            user: userId,
            symbol,
            type,
            quantity,
            price: livePrice,
            total,
            executedAt: new Date(),
        })

        // 6. Save portfolio snapshot (non-critical — does not trigger rollback if it fails)
        try {
            const totalInvested = portfolio.holdings.reduce(
                (sum, h) => sum + h.quantity * h.avgBuyPrice, 0
            )
            const totalValue = portfolio.holdings.reduce(
                (sum, h) => sum + h.quantity * livePrice, 0
            )
            await portfolioSnapshotModel.create({
                user:          userId,
                totalValue:    +totalValue.toFixed(2),
                totalInvested: +totalInvested.toFixed(2),
                totalPnl:      +(totalValue - totalInvested).toFixed(2),
                walletBalance: user.cash,
                recordedAt:    new Date(),
            })
        } catch (snapshotErr) {
            console.error('[TradeService] Snapshot failed — non critical:', snapshotErr.message)
        }

        return {
            trade:  { symbol, type, quantity, price: livePrice, total },
            wallet: user.cash,
        }

    } catch (err) {
        // Rollback — restore cash and holdings to state before this trade
        console.error('[TradeService] Error — rolling back:', err.message)
        try {
            user.cash          = originalCash
            portfolio.holdings = originalHoldings
            await user.save()
            await portfolio.save()
        } catch (rollbackErr) {
            console.error('[TradeService] Rollback also failed:', rollbackErr.message)
        }
        throw err
    }
}