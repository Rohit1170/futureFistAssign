import mongoose, { Schema, Document } from 'mongoose';

export interface IMovie extends Document {
  title: string;
  genre: string[];
  releaseDate: Date;
  director: string;
  cast: string[];
  description: string;
  viewers: number;
  revenue: number;
  marketingSpend: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const movieSchema = new Schema<IMovie>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    genre: {
      type: [String],
      required: true,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    cast: {
      type: [String],
      required: true,
    },
    description: String,
    viewers: {
      type: Number,
      default: 0,
    },
    revenue: {
      type: Number,
      default: 0,
    },
    marketingSpend: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
  },
  { timestamps: true }
);

movieSchema.index({ title: 1 });
movieSchema.index({ genre: 1 });
movieSchema.index({ releaseDate: -1 });

export default mongoose.models.Movie ||
  mongoose.model<IMovie>('Movie', movieSchema);
