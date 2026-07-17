import mongoose, { Document, Schema } from "mongoose";

export interface IMedia extends Document {
  originalName: string;
  publicId: string;
  secureUrl: string;
  width?: number;
  height?: number;
  size: number;
  mimeType: string;
  folder: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const mediaSchema = new Schema<IMedia>(
  {
    originalName: {
      type: String,
      required: [true, "Original name is required"],
      trim: true,
    },
    publicId: {
      type: String,
      required: [true, "Public ID is required"],
      unique: true,
      trim: true,
    },
    secureUrl: {
      type: String,
      required: [true, "Secure URL is required"],
      trim: true,
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    size: {
      type: Number,
      required: [true, "Size is required"],
    },
    mimeType: {
      type: String,
      required: [true, "Mime type is required"],
      trim: true,
    },
    folder: {
      type: String,
      default: "portfolio",
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for search and filters
mediaSchema.index({ originalName: "text", tags: "text" });
mediaSchema.index({ mimeType: 1 });
mediaSchema.index({ createdAt: -1 });

export const Media = mongoose.model<IMedia>("Media", mediaSchema);
