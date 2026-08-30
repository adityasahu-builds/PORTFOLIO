import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";

// ==========================================
// 1. USER MODEL
// ==========================================
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: "admin" | "editor";
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "editor"], default: "admin" },
    refreshToken: { type: String, default: null },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  const user = this as IUser;
  if (!user.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

userSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

// ==========================================
// 2. PROJECT MODEL
// ==========================================
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
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: String, required: true, trim: true },
    longDescription: { type: String, trim: true },
    techStack: { type: [String], required: true, default: [] },
    gitHubUrl: { type: String, trim: true },
    liveUrl: { type: String, trim: true },
    thumbnail: { type: String, trim: true },
    galleryImages: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    category: { type: String, required: true, trim: true },
    displayOrder: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Currently Building", "Coming Soon", "Planning", "Completed"],
      default: "Completed",
    },
    number: { type: String, trim: true },
    problemStatement: { type: String, trim: true },
    solution: { type: String, trim: true },
    keyFeatures: { type: [String], default: [] },
    accentColor: { type: String, trim: true },
    mockupType: { type: String, enum: ["portfolio", "restaurant", "school"], default: "portfolio" },
  },
  { timestamps: true }
);

projectSchema.index({ displayOrder: 1, createdAt: -1 });

export const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", projectSchema);

// ==========================================
// 3. SKILL MODEL
// ==========================================
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
  x: string;
  y: string;
  connections: string[];
  createdAt: Date;
  updatedAt: Date;
}

const skillSchema = new Schema<ISkill>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    category: { type: String, required: true, trim: true },
    icon: { type: String, trim: true },
    iconName: { type: String, trim: true },
    imageUrl: { type: String, trim: true },
    skillLevel: { type: Number, required: true, min: 0, max: 100, default: 80 },
    experience: { type: Number, default: 1 },
    description: { type: String, trim: true },
    featured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    x: { type: String, default: "50%", trim: true },
    y: { type: String, default: "50%", trim: true },
    connections: { type: [String], default: [] },
  },
  { timestamps: true }
);

skillSchema.index({ displayOrder: 1, createdAt: -1 });

export const Skill: Model<ISkill> =
  mongoose.models.Skill || mongoose.model<ISkill>("Skill", skillSchema);

// ==========================================
// 4. EXPERIENCE MODEL
// ==========================================
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
    companyName: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Freelance", "Contract"],
      default: "Full-time",
    },
    location: { type: String, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    currentlyWorking: { type: Boolean, default: false },
    companyLogo: { type: String, trim: true },
    companyWebsite: { type: String, trim: true },
    description: { type: String, trim: true },
    responsibilities: { type: [String], default: [] },
    achievements: { type: [String], default: [] },
    technologiesUsed: { type: [String], default: [] },
    displayOrder: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    iconName: { type: String, default: "Briefcase", trim: true },
  },
  { timestamps: true }
);

experienceSchema.index({ displayOrder: 1, startDate: -1 });

export const Experience: Model<IExperience> =
  mongoose.models.Experience || mongoose.model<IExperience>("Experience", experienceSchema);

// ==========================================
// 5. EDUCATION MODEL
// ==========================================
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
    institutionName: { type: String, required: true, trim: true },
    degree: { type: String, required: true, trim: true },
    fieldOfStudy: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    currentlyStudying: { type: Boolean, default: false },
    grade: { type: String, trim: true },
    description: { type: String, trim: true },
    achievements: { type: [String], default: [] },
    institutionLogo: { type: String, trim: true },
    institutionWebsite: { type: String, trim: true },
    displayOrder: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  },
  { timestamps: true }
);

educationSchema.index({ displayOrder: 1, startDate: -1 });

export const Education: Model<IEducation> =
  mongoose.models.Education || mongoose.model<IEducation>("Education", educationSchema);

// ==========================================
// 6. CERTIFICATE MODEL
// ==========================================
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
    title: { type: String, required: true, trim: true },
    issuer: { type: String, required: true, trim: true },
    issueDate: { type: String, required: true },
    expiryDate: { type: String, default: "" },
    doesNotExpire: { type: Boolean, default: false },
    credentialId: { type: String, trim: true, default: "" },
    credentialUrl: { type: String, trim: true, default: "" },
    imageUrl: { type: String, trim: true, default: "" },
    skills: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  },
  { timestamps: true }
);

certificateSchema.index({ displayOrder: 1, createdAt: -1 });

export const Certificate: Model<ICertificate> =
  mongoose.models.Certificate || mongoose.model<ICertificate>("Certificate", certificateSchema);

// ==========================================
// 7. PERSONAL INFO MODEL
// ==========================================
export interface IPersonalInfo extends Document {
  hero: {
    fullName: string;
    professionalTitle: string;
    shortTagline: string;
    typingText: string[];
    heroDescription: string;
    profileImage: string;
    resumeUrl: string;
    currentCompany: string;
    currentPosition: string;
    experienceYears: number;
    availabilityStatus: string;
    ctaButtonText: string;
    ctaButtonUrl: string;
  };
  about: {
    aboutHeading: string;
    aboutDescription: string;
    longBiography: string;
    location: string;
    nationality: string;
    languages: string[];
    interests: string[];
    portraitTitle: string;
    portraitSubtitle: string;
    portraitRingColor: string;
    portraitGlowColor: string;
    portraitAccentColor: string;
    portraitBackgroundEffect: string;
    portraitAnimationEnabled: boolean;
    portraitImage: string;
  };
  contact: {
    primaryEmail: string;
    secondaryEmail: string;
    phoneNumber: string;
    whatsApp: string;
    address: string;
    city: string;
    state: string;
    country: string;
    timezone: string;
  };
  socialLinks: {
    github: string;
    linkedin: string;
    portfolio: string;
    resume: string;
    twitter: string;
    instagram: string;
    youtube: string;
    leetcode: string;
    codeforces: string;
    codechef: string;
    geeksforgeeks: string;
    hackerrank: string;
    hackerone: string;
    medium: string;
    devto: string;
    stackoverflow: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    ogImage: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const personalInfoSchema = new Schema<IPersonalInfo>(
  {
    hero: {
      fullName: { type: String, required: true, trim: true },
      professionalTitle: { type: String, required: true, trim: true },
      shortTagline: { type: String, required: true, trim: true },
      typingText: { type: [String], required: true, default: [] },
      heroDescription: { type: String, required: true, trim: true },
      profileImage: { type: String, default: "", trim: true },
      resumeUrl: { type: String, default: "", trim: true },
      currentCompany: { type: String, default: "", trim: true },
      currentPosition: { type: String, default: "", trim: true },
      experienceYears: { type: Number, default: 0 },
      availabilityStatus: { type: String, default: "", trim: true },
      ctaButtonText: { type: String, default: "", trim: true },
      ctaButtonUrl: { type: String, default: "", trim: true },
    },
    about: {
      aboutHeading: { type: String, required: true, trim: true },
      aboutDescription: { type: String, required: true, trim: true },
      longBiography: { type: String, required: true, trim: true },
      location: { type: String, required: true, trim: true },
      nationality: { type: String, required: true, trim: true },
      languages: { type: [String], required: true, default: [] },
      interests: { type: [String], required: true, default: [] },
      portraitTitle: { type: String, required: true, default: "AS", trim: true },
      portraitSubtitle: { type: String, required: true, default: "PORTRAIT", trim: true },
      portraitRingColor: { type: String, required: true, default: "#3b82f6", trim: true },
      portraitGlowColor: { type: String, required: true, default: "#00d2ff", trim: true },
      portraitAccentColor: { type: String, required: true, default: "#00d2ff", trim: true },
      portraitBackgroundEffect: {
        type: String,
        default: "bg-gradient-to-b from-blue-500/10 to-transparent",
        trim: true,
      },
      portraitAnimationEnabled: { type: Boolean, required: true, default: true },
      portraitImage: { type: String, default: "", trim: true },
    },
    contact: {
      primaryEmail: { type: String, required: true, trim: true },
      secondaryEmail: { type: String, default: "", trim: true },
      phoneNumber: { type: String, required: true, trim: true },
      whatsApp: { type: String, default: "", trim: true },
      address: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      country: { type: String, required: true, trim: true },
      timezone: { type: String, required: true, trim: true },
    },
    socialLinks: {
      github: { type: String, default: "", trim: true },
      linkedin: { type: String, default: "", trim: true },
      portfolio: { type: String, default: "", trim: true },
      resume: { type: String, default: "", trim: true },
      twitter: { type: String, default: "", trim: true },
      instagram: { type: String, default: "", trim: true },
      youtube: { type: String, default: "", trim: true },
      leetcode: { type: String, default: "", trim: true },
      codeforces: { type: String, default: "", trim: true },
      codechef: { type: String, default: "", trim: true },
      geeksforgeeks: { type: String, default: "", trim: true },
      hackerrank: { type: String, default: "", trim: true },
      hackerone: { type: String, default: "", trim: true },
      medium: { type: String, default: "", trim: true },
      devto: { type: String, default: "", trim: true },
      stackoverflow: { type: String, default: "", trim: true },
    },
    seo: {
      metaTitle: { type: String, required: true, trim: true },
      metaDescription: { type: String, required: true, trim: true },
      keywords: { type: [String], default: [] },
      ogImage: { type: String, default: "", trim: true },
    },
  },
  { timestamps: true }
);

export const PersonalInfo: Model<IPersonalInfo> =
  mongoose.models.PersonalInfo ||
  mongoose.model<IPersonalInfo>("PersonalInfo", personalInfoSchema);

// ==========================================
// 8. CONTACT MODEL
// ==========================================
export interface IContact extends Document {
  fullName: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new Schema<IContact>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

contactSchema.index({ createdAt: -1 });

export const Contact: Model<IContact> =
  mongoose.models.Contact || mongoose.model<IContact>("Contact", contactSchema);

// ==========================================
// 9. ANALYTICS MODELS
// ==========================================
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
  sessionDuration: number;
  createdAt: Date;
  updatedAt: Date;
}

const visitorSessionSchema = new Schema<IVisitorSession>(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    ipHash: { type: String, default: "" },
    country: { type: String, default: "Unknown", index: true },
    city: { type: String, default: "Unknown" },
    deviceType: { type: String, enum: ["Desktop", "Mobile", "Tablet", "Unknown"], default: "Unknown", index: true },
    browser: { type: String, default: "Unknown", index: true },
    os: { type: String, default: "Unknown", index: true },
    screenSize: { type: String, default: "Unknown" },
    referralSource: { type: String, default: "Direct", index: true },
    landingPage: { type: String, default: "/" },
    visitTime: { type: Date, default: Date.now, index: true },
    lastActiveTime: { type: Date, default: Date.now },
    sessionDuration: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const VisitorSession: Model<IVisitorSession> =
  mongoose.models.VisitorSession ||
  mongoose.model<IVisitorSession>("VisitorSession", visitorSessionSchema);

export interface IAnalyticsEvent extends Document {
  sessionId: string;
  eventName: "pageView" | "projectView" | "resumeDownload" | "contactSubmission" | "socialClick" | "ctaClick";
  pagePath: string;
  details?: Record<string, any>;
  timestamp: Date;
}

const analyticsEventSchema = new Schema<IAnalyticsEvent>(
  {
    sessionId: { type: String, required: true, index: true },
    eventName: {
      type: String,
      required: true,
      enum: ["pageView", "projectView", "resumeDownload", "contactSubmission", "socialClick", "ctaClick"],
      index: true,
    },
    pagePath: { type: String, default: "/", index: true },
    details: { type: Schema.Types.Mixed, default: {} },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

export const AnalyticsEvent: Model<IAnalyticsEvent> =
  mongoose.models.AnalyticsEvent ||
  mongoose.model<IAnalyticsEvent>("AnalyticsEvent", analyticsEventSchema);

// ==========================================
// 10. MEDIA MODEL
// ==========================================
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
    originalName: { type: String, required: true, trim: true },
    publicId: { type: String, required: true, unique: true, trim: true },
    secureUrl: { type: String, required: true, trim: true },
    width: { type: Number },
    height: { type: Number },
    size: { type: Number, required: true },
    mimeType: { type: String, required: true, trim: true },
    folder: { type: String, default: "portfolio", trim: true },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Media: Model<IMedia> =
  mongoose.models.Media || mongoose.model<IMedia>("Media", mediaSchema);
