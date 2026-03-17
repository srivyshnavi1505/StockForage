import exp from 'express'
import { userModel } from '../models/usermodel.js'
import { portfolioModel } from '../models/Portfolio.js'
import { verifyToken } from '../middlewares/verifyToken.js'
import { getPortfolioWithPnL } from '../services/PortfolioService.js'
import {portfolioSnapshotModel} from '../models/PortfolioSnapshot.js'
export const PortfolioApp = exp.Router()

// GET /portfolio — holdings + live P&L
PortfolioApp.get('/portfolio', verifyToken, async (req, res) => {
    const user = await userModel.findOne({ email: req.user.email })
    const data = await getPortfolioWithPnL(user._id)
    res.status(200).json({ message: "portfolio fetched", payload: data })
})

// GET /portfolio/history — snapshot history
PortfolioApp.get('/portfolio/history', verifyToken, async (req, res) => {
    const user = await userModel.findOne({ email: req.user.email })
    
    const snapshots = await portfolioSnapshotModel
        .find({ user: user._id })
        .sort({ recordedAt: 1 })
        .lean()

    const data = snapshots.map(s => ({
        date: s.recordedAt,
        portfolioValue: s.totalValue,
        pnl: s.totalPnl,
        cash: s.walletBalance,
        totalValue: s.totalValue + s.walletBalance
    }))

    res.status(200).json({ message: "history fetched", payload: data })
})

// GET /portfolio/summary — totals
PortfolioApp.get('/portfolio/summary', verifyToken, async (req, res) => {
    const user = await userModel.findOne({ email: req.user.email })
    const data = await getPortfolioWithPnL(user._id)
    res.status(200).json({ message: "summary fetched", payload: data.summary })
})