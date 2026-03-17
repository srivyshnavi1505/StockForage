import { model, Schema } from 'mongoose'

const holdingSchema = new Schema({
    symbol:      { type: String, required: [true, 'symbol is required'], uppercase: true },
    companyName: { type: String, default: '' },
    quantity:    { type: Number, required: [true, 'quantity is required'], min: 1 },
    avgBuyPrice: { type: Number, required: [true, 'average buy price is required'] },
    boughtAt:    { type: Date, default: Date.now },
}, { _id: false })

const portfolioSchema = new Schema({
    user:     { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'user is required'], unique: true },
    holdings: [holdingSchema],
}, {
    timestamps: true,
})

export const portfolioModel = model('Portfolio', portfolioSchema)