import mongoose, { Schema, Document } from 'mongoose';

export interface IWatchActivity extends Document {
  movieId: mongoose.Types.ObjectId;
  viewerId: mongoose.Types.ObjectId;
  watchTime: number; // minutes
  completionRate: number; // 0-100
  engagementScore: number; // 0-100
  region: string;
  deviceType: string;
  watchedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const watchActivitySchema = new Schema<IWatchActivity>(
  {
    movieId: {
      type: Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    viewerId: {
      type: Schema.Types.ObjectId,
      ref: 'Viewer',
      required: true,
    },
    watchTime: {
      type: Number,
      required: true,
    },
    completionRate: {
      type: Number,
      min: 0,
      max: 100,
    },
    engagementScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    region: String,
    deviceType: {
      type: String,
      enum: ['Mobile', 'Tablet', 'Desktop', 'Smart TV'],
    },
    watchedAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

watchActivitySchema.index({ movieId: 1, viewerId: 1 });
watchActivitySchema.index({ watchedAt: -1 });

export default mongoose.models.WatchActivity ||
  mongoose.model<IWatchActivity>('WatchActivity', watchActivitySchema);
