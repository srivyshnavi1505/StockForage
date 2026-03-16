import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symbol: { type: String, required: true, uppercase: true },
  targetPrice: { type: Number, required: true, min: 0 },
  condition: { type: String, enum: ['ABOVE', 'BELOW'], required: true },
  triggered: { type: Boolean, default: false },
  triggeredAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});

alertSchema.index({ symbol: 1, triggered: 1 });
alertSchema.index({ user: 1 });

const Alert = mongoose.model('Alert', alertSchema);
export default Alert;