import mongoose from 'mongoose';

const symbolSchema = new mongoose.Schema(
  {
    symbol: { type: String, required: true, uppercase: true },
    companyName: { type: String, default: '' },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const watchlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  symbols: [symbolSchema],
  updatedAt: { type: Date, default: Date.now },
});

watchlistSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const Watchlist = mongoose.model('Watchlist', watchlistSchema);
export default Watchlist;