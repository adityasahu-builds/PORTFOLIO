import mongoose, { Document, Schema } from "mongoose";

export interface ICertificate extends Document {
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  doesNotExpire: boolean;
  credentialId?: string;
  credentialUrl?: string;
  imageUrl?: string;
  skills: string[];
  featured: boolean;
  displayOrder: number;
  status: "Active" | "Inactive";
  createdAt: Date;
  updatedAt: Date;
}

const certificateSchema = new Schema<ICertificate>(
  {
    title: {
      type: String,
      required: [true, "Certificate title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    issuer: {
      type: String,
      required: [true, "Issuer is required"],
      trim: true,
      maxlength: [150, "Issuer cannot exceed 150 characters"],
    },
    issueDate: {
      type: String,
      required: [true, "Issue date is required"],
    },
    expiryDate: {
      type: String,
      default: "",
    },
    doesNotExpire: {
      type: Boolean,
      default: false,
    },
    credentialId: {
      type: String,
      trim: true,
      default: "",
    },
    credentialUrl: {
      type: String,
      trim: true,
      default: "",
    },
    imageUrl: {
      type: String,
      trim: true,
      default: "",
    },
    skills: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
certificateSchema.index({ displayOrder: 1, createdAt: -1 });
certificateSchema.index({ featured: 1 });

export const Certificate = mongoose.model<ICertificate>("Certificate", certificateSchema);
