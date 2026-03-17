import { model, Schema } from 'mongoose'

const symbolSchema = new Schema({
    symbol:      { type: String, required: [true, 'symbol is required'], uppercase: true },
    companyName: { type: String, default: '' },
    addedAt:     { type: Date, default: Date.now },
}, { _id: false })

const watchlistSchema = new Schema({
    user:    { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'user is required'], unique: true },
    symbols: [symbolSchema],
}, {
    timestamps: true,
})

watchlistSchema.pre('save', function (next) {
    this.updatedAt = new Date()
    next()
})

export const watchlistModel = model('Watchlist', watchlistSchema)