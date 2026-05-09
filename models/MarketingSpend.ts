import mongoose, { Schema, Document } from 'mongoose';

export interface IMarketingSpend extends Document {
  movieId: mongoose.Types.ObjectId;
  region: string;
  channel: string; // 'TV', 'Digital', 'Print', 'Outdoor'
  spendAmount: number;
  impressions: number;
  conversions: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const marketingSpendSchema = new Schema<IMarketingSpend>(
  {
    movieId: {
      type: Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
    channel: {
      type: String,
      enum: ['TV', 'Digital', 'Print', 'Outdoor'],
      required: true,
    },
    spendAmount: {
      type: Number,
      required: true,
    },
    impressions: {
      type: Number,
      required: true,
    },
    conversions: {
      type: Number,
      default: 0,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

marketingSpendSchema.index({ movieId: 1, region: 1 });
marketingSpendSchema.index({ date: -1 });

export default mongoose.models.MarketingSpend ||
  mongoose.model<IMarketingSpend>('MarketingSpend', marketingSpendSchema);
