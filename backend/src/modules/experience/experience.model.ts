import mongoose, { Document, Schema } from "mongoose";

export interface IExperience extends Document {
  companyName: string;
  role: string;
  employmentType: "Full-time" | "Part-time" | "Internship" | "Freelance" | "Contract";
  location?: string;
  startDate: Date;
  endDate?: Date;
  currentlyWorking: boolean;
  companyLogo?: string;
  companyWebsite?: string;
  description?: string;
  responsibilities: string[];
  achievements: string[];
  technologiesUsed: string[];
  displayOrder: number;
  featured: boolean;
  status: "Active" | "Inactive";
  iconName: string;
  createdAt: Date;
  updatedAt: Date;
}

const experienceSchema = new Schema<IExperience>(
  {
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    role: {
      type: String,
      required: [true, "Role / Position is required"],
      trim: true,
    },
    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Freelance", "Contract"],
      default: "Full-time",
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
    currentlyWorking: {
      type: Boolean,
      default: false,
    },
    companyLogo: {
      type: String,
      trim: true,
    },
    companyWebsite: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    achievements: {
      type: [String],
      default: [],
    },
    technologiesUsed: {
      type: [String],
      default: [],
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
    iconName: {
      type: String,
      default: "Briefcase",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
experienceSchema.index({ displayOrder: 1, startDate: -1 });

export const Experience = mongoose.model<IExperience>("Experience", experienceSchema);
