import exp from 'express'
import { userModel } from '../models/usermodel.js'
import { tradeModel } from '../models/Trade.js'
import { verifyToken } from '../middlewares/verifyToken.js'
import { executeTrade } from '../services/TradeService.js'

export const TradeApp = exp.Router()

// POST /trade — execute a buy or sell
TradeApp.post('/trade', verifyToken, async (req, res) => {
    const { symbol, type, quantity } = req.body

    if (!symbol || !type || !quantity) {
        const err = new Error("symbol, type, and quantity are required")
        err.status = 400
        throw err
    }
    if (!['BUY', 'SELL'].includes(type)) {
        const err = new Error("type must be BUY or SELL")
        err.status = 400
        throw err
    }
    if (!Number.isInteger(Number(quantity)) || Number(quantity) < 1) {
        const err = new Error("quantity must be a positive integer")
        err.status = 400
        throw err
    }

    const user = await userModel.findOne({ email: req.user.email })
    const result = await executeTrade({ userId: user._id, symbol, type, quantity: Number(quantity) })

    res.status(200).json({ message: "trade executed", payload: result })
})

// GET /trades — paginated trade history
TradeApp.get('/trades', verifyToken, async (req, res) => {
    const user = await userModel.findOne({ email: req.user.email })
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const type = req.query.type

    const filter = { user: user._id }
    if (type && ['BUY', 'SELL'].includes(type)) filter.type = type

    const total = await tradeModel.countDocuments(filter)
    const trades = await tradeModel
        .find(filter)
        .sort({ executedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)

    res.status(200).json({
        message: "trade history",
        payload: trades,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    })
})