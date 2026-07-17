import mongoose, { Document, Schema } from "mongoose";

export interface IProject extends Document {
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  techStack: string[];
  gitHubUrl?: string;
  liveUrl?: string;
  thumbnail?: string;
  galleryImages: string[];
  featured: boolean;
  category: string;
  displayOrder: number;
  status: "Currently Building" | "Coming Soon" | "Planning" | "Completed";
  // UI-specific properties
  number?: string;
  problemStatement?: string;
  solution?: string;
  keyFeatures: string[];
  accentColor?: string;
  mockupType: "portfolio" | "restaurant" | "school";
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Project slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Short description is required"],
      trim: true,
    },
    longDescription: {
      type: String,
      trim: true,
    },
    techStack: {
      type: [String],
      required: [true, "Tech stack is required"],
      validate: {
        validator: function (v: string[]) {
          return v.length > 0;
        },
        message: "Tech stack must contain at least one technology",
      },
    },
    gitHubUrl: {
      type: String,
      trim: true,
    },
    liveUrl: {
      type: String,
      trim: true,
    },
    thumbnail: {
      type: String,
      trim: true,
    },
    galleryImages: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Currently Building", "Coming Soon", "Planning", "Completed"],
      default: "Completed",
    },
    number: {
      type: String,
      trim: true,
    },
    problemStatement: {
      type: String,
      trim: true,
    },
    solution: {
      type: String,
      trim: true,
    },
    keyFeatures: {
      type: [String],
      default: [],
    },
    accentColor: {
      type: String,
      trim: true,
    },
    mockupType: {
      type: String,
      enum: ["portfolio", "restaurant", "school"],
      default: "portfolio",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for pagination and quick lookup
projectSchema.index({ displayOrder: 1, createdAt: -1 });
projectSchema.index({ featured: 1 });

export const Project = mongoose.model<IProject>("Project", projectSchema);
