import mongoose, { Schema, Document } from 'mongoose';

export interface IQueryLog extends Document {
  userId: mongoose.Types.ObjectId;
  queryText: string;
  toolsUsed: string[];
  response: string;
  executionTime: number; // milliseconds
  status: 'success' | 'failed' | 'partial';
  error?: string;
  createdAt: Date;
}

const queryLogSchema = new Schema<IQueryLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    queryText: {
      type: String,
      required: true,
    },
    toolsUsed: {
      type: [String],
      default: [],
    },
    response: {
      type: String,
      required: true,
    },
    executionTime: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['success', 'failed', 'partial'],
      default: 'success',
    },
    error: String,
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

queryLogSchema.index({ userId: 1, createdAt: -1 });
queryLogSchema.index({ createdAt: -1 });

export default mongoose.models.QueryLog ||
  mongoose.model<IQueryLog>('QueryLog', queryLogSchema);
