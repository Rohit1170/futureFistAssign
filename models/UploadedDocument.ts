import mongoose, { Schema, Document } from 'mongoose';

export interface IDocumentChunk {
  text: string;
  embedding?: number[];
  pageNumber?: number;
}

export interface IUploadedDocument extends Document {
  name: string;
  fileType: 'pdf' | 'csv';
  filePath: string;
  uploadedBy: mongoose.Types.ObjectId;
  chunks: IDocumentChunk[];
  metadata: {
    pageCount?: number;
    rowCount?: number;
    fileSize: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const documentChunkSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  embedding: [Number],
  pageNumber: Number,
});

const uploadedDocumentSchema = new Schema<IUploadedDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: ['pdf', 'csv'],
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    chunks: [documentChunkSchema],
    metadata: {
      pageCount: Number,
      rowCount: Number,
      fileSize: {
        type: Number,
        required: true,
      },
    },
  },
  { timestamps: true }
);

uploadedDocumentSchema.index({ uploadedBy: 1, createdAt: -1 });
uploadedDocumentSchema.index({ name: 'text' });

export default mongoose.models.UploadedDocument ||
  mongoose.model<IUploadedDocument>('UploadedDocument', uploadedDocumentSchema);
