import mongoose, { Document, Schema } from "mongoose";

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
  {
    timestamps: true,
  }
);

export const PersonalInfo = mongoose.model<IPersonalInfo>("PersonalInfo", personalInfoSchema);
