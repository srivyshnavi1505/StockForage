import { model, Schema } from 'mongoose'

const stockSnapshotSchema = new Schema({
    symbol: {
        type: String,
        required: [true, 'symbol is required'],
        uppercase: true
    },
    open: {
        type: Number,
        required: [true, 'open price is required']
    },
    high: {
        type: Number,
        required: [true, 'high price is required']
    },
    low: {
        type: Number,
        required: [true, 'low price is required']
    },
    close: {
        type: Number,
        required: [true, 'close price is required']
    },
    recordedAt: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true
})

stockSnapshotSchema.index({ symbol: 1, recordedAt: -1 })

export const stockSnapshotModel = model('StockSnapshot', stockSnapshotSchema)