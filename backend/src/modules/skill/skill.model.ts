import mongoose, { Document, Schema } from "mongoose";

export interface ISkill extends Document {
  title: string;
  slug: string;
  category: string;
  icon?: string;
  iconName?: string;
  imageUrl?: string;
  skillLevel: number;
  experience?: number;
  description?: string;
  featured: boolean;
  displayOrder: number;
  status: "Active" | "Inactive";
  // Layout coordinates for dynamic constellations
  x: string;
  y: string;
  connections: string[];
  createdAt: Date;
  updatedAt: Date;
}

const skillSchema = new Schema<ISkill>(
  {
    title: {
      type: String,
      required: [true, "Skill title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Skill slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    icon: {
      type: String,
      trim: true,
    },
    iconName: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    skillLevel: {
      type: Number,
      required: [true, "Skill level is required"],
      min: [0, "Skill level must be at least 0"],
      max: [100, "Skill level cannot exceed 100"],
      default: 80,
    },
    experience: {
      type: Number,
      default: 1,
    },
    description: {
      type: String,
      trim: true,
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
    x: {
      type: String,
      default: "50%",
      trim: true,
    },
    y: {
      type: String,
      default: "50%",
      trim: true,
    },
    connections: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
skillSchema.index({ displayOrder: 1, createdAt: -1 });

export const Skill = mongoose.model<ISkill>("Skill", skillSchema);
