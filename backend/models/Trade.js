import { model, Schema } from 'mongoose'

const tradeSchema = new Schema({
    user:     { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'user is required'] },
    symbol:   { type: String, required: [true, 'symbol is required'], uppercase: true },
    type:     { type: String, enum: ['BUY', 'SELL'], required: [true, 'trade type is required'] },
    quantity: { type: Number, required: [true, 'quantity is required'], min: 1 },
    price:    { type: Number, required: [true, 'price is required'] },
    total:    { type: Number, required: [true, 'total is required'] },
}, {
    timestamps: true,
})

tradeSchema.index({ user: 1, createdAt: -1 })

export const tradeModel = model('Trade', tradeSchema)