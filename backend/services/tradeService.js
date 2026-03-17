
import mongoose from 'mongoose'
import axios from 'axios'
import { config } from 'dotenv'
import { userModel } from '../models/usermodel.js'
import { portfolioModel } from '../models/Portfolio.js'
import { tradeModel } from '../models/Trade.js'
import { portfolioSnapshotModel } from '../models/PortfolioSnapShot.js'
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
    const session = await mongoose.startSession()

    try {
        let result

        await session.withTransaction(async () => {

            // 1. Fetch live price from Finnhub (outside transaction — network call)
            const livePrice = await getLivePrice(symbol)
            const total = livePrice * quantity

            // 2. Load user and portfolio
            const user = await userModel.findById(userId).session(session)
            if (!user) {
                const err = new Error('User not found')
                err.status = 404
                throw err
            }

            let portfolio = await portfolioModel.findOne({ user: userId }).session(session)
            if (!portfolio) {
                portfolio = new portfolioModel({ user: userId, holdings: [] })
            }

            // buy
            if (type === 'BUY') {
                // Check wallet balance
                if (user.cash < total) {
                    const err = new Error(
                        `Insufficient funds. Need ₹${total.toFixed(2)}, available ₹${user.cash.toFixed(2)}`
                    )
                    err.status = 400
                    throw err
                }

                // Deduct cash
                user.cash = user.cash - total

                // Update holding — weighted average if already exists
                const existingHolding = portfolio.holdings.find(h => h.symbol === symbol)

                if (existingHolding) {
                    const newAvg =
                        (existingHolding.quantity * existingHolding.avgBuyPrice + quantity * livePrice) /
                        (existingHolding.quantity + quantity)

                    existingHolding.avgBuyPrice = newAvg
                    existingHolding.quantity = existingHolding.quantity + quantity
                } else {
                    portfolio.holdings.push({
                        symbol,
                        quantity,
                        avgBuyPrice: livePrice,
                        boughtAt: new Date(),
                    })
                }
            }

            // sell
            if (type === 'SELL') {
                const existingHolding = portfolio.holdings.find(h => h.symbol === symbol)

                // Check if user holds this stock at all
                if (!existingHolding) {
                    const err = new Error(`You do not hold any shares of ${symbol}`)
                    err.status = 400
                    throw err
                }

                // Check if user holds enough quantity
                if (existingHolding.quantity < quantity) {
                    const err = new Error(
                        `Insufficient shares. You hold ${existingHolding.quantity}, tried to sell ${quantity}`
                    )
                    err.status = 400
                    throw err
                }

                // Credit cash
                user.cash = user.cash + total

                // Reduce or remove holding
                if (existingHolding.quantity === quantity) {
                    portfolio.holdings = portfolio.holdings.filter(h => h.symbol !== symbol)
                } else {
                    existingHolding.quantity = existingHolding.quantity - quantity
                }
            }

            // 3. Save user and portfolio
            await user.save({ session })
            await portfolio.save({ session })

            // 4. Log the trade
            const trade = new tradeModel({
                user: userId,
                symbol,
                type,
                quantity,
                price: livePrice,
                total,
                executedAt: new Date(),
            })
            await trade.save({ session })

            // 5. Save a portfolio snapshot (total invested + current value)
            const totalInvested = portfolio.holdings.reduce(
                (sum, h) => sum + h.quantity * h.avgBuyPrice, 0
            )
            const totalValue = portfolio.holdings.reduce(
                (sum, h) => sum + h.quantity * livePrice, 0
            )

            const snapshot = new portfolioSnapshotModel({
                user: userId,
                totalValue,
                totalInvested,
                totalPnl: totalValue - totalInvested,
                walletBalance: user.cash,
                recordedAt: new Date(),
            })
            await snapshot.save({ session })

            result = {
                trade: {
                    symbol,
                    type,
                    quantity,
                    price: livePrice,
                    total,
                },
                wallet: user.cash,
                pnl: totalValue - totalInvested,
            }
        })

        return result

    } finally {
        session.endSession()
    }
}