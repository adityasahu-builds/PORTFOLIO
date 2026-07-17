import mongoose, { Document, Schema } from "mongoose";

export interface IEducation extends Document {
  institutionName: string;
  degree: string;
  fieldOfStudy: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  currentlyStudying: boolean;
  grade?: string;
  description?: string;
  achievements: string[];
  institutionLogo?: string;
  institutionWebsite?: string;
  displayOrder: number;
  featured: boolean;
  status: "Active" | "Inactive";
  createdAt: Date;
  updatedAt: Date;
}

const educationSchema = new Schema<IEducation>(
  {
    institutionName: {
      type: String,
      required: [true, "Institution name is required"],
      trim: true,
    },
    degree: {
      type: String,
      required: [true, "Degree is required"],
      trim: true,
    },
    fieldOfStudy: {
      type: String,
      required: [true, "Field of study is required"],
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
    },
    currentlyStudying: {
      type: Boolean,
      default: false,
    },
    grade: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    achievements: {
      type: [String],
      default: [],
    },
    institutionLogo: {
      type: String,
      trim: true,
    },
    institutionWebsite: {
      type: String,
      trim: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
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
educationSchema.index({ displayOrder: 1, startDate: -1 });

export const Education = mongoose.model<IEducation>("Education", educationSchema);
