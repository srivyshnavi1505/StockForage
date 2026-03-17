import { model, Schema } from 'mongoose'
 
const portfolioSnapshotSchema = new Schema({
    user:          { type: Schema.Types.ObjectId, ref: 'User', required: true },
    totalValue:    { type: Number, required: true },
    totalInvested: { type: Number, required: true },
    totalPnl:      { type: Number, required: true },
    walletBalance: { type: Number, required: true },
    recordedAt:    { type: Date, default: Date.now }
}, {
    timestamps: true,
})
 
portfolioSnapshotSchema.index({ user: 1, recordedAt: -1 })
 
export const portfolioSnapshotModel = model('PortfolioSnapshot', portfolioSnapshotSchema)
 