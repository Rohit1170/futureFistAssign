import mongoose, { Schema, Document } from 'mongoose';

export interface IViewer extends Document {
  region: string;
  ageGroup: string; // '13-17', '18-24', '25-34', '35-44', '45-54', '55+'
  watchCount: number;
  totalWatchTime: number; // minutes
  favoriteGenres: string[];
  subscriptionType: string; // 'Free', 'Premium', 'Premium+
  createdAt: Date;
  updatedAt: Date;
}

const viewerSchema = new Schema<IViewer>(
  {
    region: {
      type: String,
      required: true,
    },
    ageGroup: {
      type: String,
      enum: ['13-17', '18-24', '25-34', '35-44', '45-54', '55+'],
      required: true,
    },
    watchCount: {
      type: Number,
      default: 0,
    },
    totalWatchTime: {
      type: Number,
      default: 0,
    },
    favoriteGenres: {
      type: [String],
      default: [],
    },
    subscriptionType: {
      type: String,
      enum: ['Free', 'Premium', 'Premium+'],
      default: 'Free',
    },
  },
  { timestamps: true }
);

viewerSchema.index({ region: 1 });
viewerSchema.index({ ageGroup: 1 });

export default mongoose.models.Viewer ||
  mongoose.model<IViewer>('Viewer', viewerSchema);
