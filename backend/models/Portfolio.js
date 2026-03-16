import mongoose from 'mongoose';

const holdingSchema = new mongoose.Schema(
  {
    symbol: { 
        type: String,
        required: true,
        uppercase: true },
    companyName: {
            type: String, 
            default: ''
         },
    quantity: { 
        type: Number,
         required: true,
         min: 1 
        },

    avgBuyPrice: { 
        type: Number,
         
        required: true },

    boughtAt: { 
        type: Date,
         default: Date.now },
  },
  { _id: false }
);

const portfolioSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId,
     ref: 'User',
      required: true, 
      unique: true },
  holdings: [holdingSchema],
  updatedAt: {
     type: Date,
      default: Date.now },
},{
    timestamps:true
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);
export default Portfolio;