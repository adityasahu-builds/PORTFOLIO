import mongoose, { Document, Schema } from "mongoose";

// Visitor Session Interface
export interface IVisitorSession extends Document {
  sessionId: string;
  ipHash: string;
  country: string;
  city: string;
  deviceType: "Desktop" | "Mobile" | "Tablet" | "Unknown";
  browser: string;
  os: string;
  screenSize: string;
  referralSource: string;
  landingPage: string;
  visitTime: Date;
  lastActiveTime: Date;
  sessionDuration: number; // in seconds
  createdAt: Date;
  updatedAt: Date;
}

const visitorSessionSchema = new Schema<IVisitorSession>(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    ipHash: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "Unknown",
      index: true,
    },
    city: {
      type: String,
      default: "Unknown",
    },
    deviceType: {
      type: String,
      enum: ["Desktop", "Mobile", "Tablet", "Unknown"],
      default: "Unknown",
      index: true,
    },
    browser: {
      type: String,
      default: "Unknown",
      index: true,
    },
    os: {
      type: String,
      default: "Unknown",
      index: true,
    },
    screenSize: {
      type: String,
      default: "Unknown",
    },
    referralSource: {
      type: String,
      default: "Direct",
      index: true,
    },
    landingPage: {
      type: String,
      default: "/",
    },
    visitTime: {
      type: Date,
      default: Date.now,
      index: true,
    },
    lastActiveTime: {
      type: Date,
      default: Date.now,
    },
    sessionDuration: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Analytics Event Interface
export interface IAnalyticsEvent extends Document {
  sessionId: string;
  eventName:
    | "pageView"
    | "projectView"
    | "resumeDownload"
    | "contactSubmission"
    | "socialClick"
    | "ctaClick";
  pagePath: string;
  details?: Record<string, any>;
  timestamp: Date;
}

const analyticsEventSchema = new Schema<IAnalyticsEvent>(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    eventName: {
      type: String,
      required: true,
      enum: [
        "pageView",
        "projectView",
        "resumeDownload",
        "contactSubmission",
        "socialClick",
        "ctaClick",
      ],
      index: true,
    },
    pagePath: {
      type: String,
      default: "/",
      index: true,
    },
    details: {
      type: Schema.Types.Mixed,
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false, // timestamps handled manually via timestamp field
  }
);

// Indexes for date range filtering
visitorSessionSchema.index({ visitTime: -1 });
analyticsEventSchema.index({ timestamp: -1 });
analyticsEventSchema.index({ eventName: 1, timestamp: -1 });

export const VisitorSession = mongoose.model<IVisitorSession>(
  "VisitorSession",
  visitorSessionSchema
);
export const AnalyticsEvent = mongoose.model<IAnalyticsEvent>(
  "AnalyticsEvent",
  analyticsEventSchema
);
