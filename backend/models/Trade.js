import mongoose from 'mongoose';

const tradeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symbol: { type: String, required: true, uppercase: true },
  type: { type: String, enum: ['BUY', 'SELL'], required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  total: { type: Number, required: true },
  executedAt: { type: Date, default: Date.now },
});

tradeSchema.index({ user: 1, executedAt: -1 });

const Trade = mongoose.model('Trade', tradeSchema);
export default Trade;