import { model, Schema } from 'mongoose'

const alertSchema = new Schema({
    user:        { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'user is required'] },
    symbol:      { type: String, required: [true, 'symbol is required'], uppercase: true },
    targetPrice: { type: Number, required: [true, 'target price is required'], min: 0 },
    condition:   { type: String, enum: ['ABOVE', 'BELOW'], required: [true, 'condition is required'] },
    triggered:   { type: Boolean, default: false },
    triggeredAt: { type: Date, default: null },
}, {
    timestamps: true,
})

alertSchema.index({ symbol: 1, triggered: 1 })
alertSchema.index({ user: 1 })

export const alertModel = model('Alert', alertSchema)