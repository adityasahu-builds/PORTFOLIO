import { z } from "zod";
import sanitizeHtml from "sanitize-html";

// Helper to sanitize html in string inputs to prevent XSS
const sanitizeString = (val: string) => {
  return sanitizeHtml(val, {
    allowedTags: [], // strip all tags for safe simple string values
    allowedAttributes: {},
  }).trim();
};

export const personalInfoBodySchema = z.object({
  hero: z.object({
    fullName: z
      .string({ required_error: "Full name is required" })
      .min(1, "Full name cannot be empty")
      .max(100, "Full name cannot exceed 100 characters")
      .transform(sanitizeString),
    professionalTitle: z
      .string({ required_error: "Professional title is required" })
      .min(1, "Professional title cannot be empty")
      .max(100, "Professional title cannot exceed 100 characters")
      .transform(sanitizeString),
    shortTagline: z
      .string({ required_error: "Short tagline is required" })
      .min(1, "Short tagline cannot be empty")
      .max(150, "Short tagline cannot exceed 150 characters")
      .transform(sanitizeString),
    typingText: z
      .array(z.string().max(100, "Typing text element too long").transform(sanitizeString))
      .min(1, "At least one typing text element is required"),
    heroDescription: z
      .string({ required_error: "Hero description is required" })
      .min(1, "Hero description cannot be empty")
      .max(1000, "Hero description cannot exceed 1000 characters")
      .transform(sanitizeString),
    profileImage: z
      .string()
      .trim()
      .refine((val) => val === "" || z.string().url().safeParse(val).success, {
        message: "Invalid profile image URL format",
      }),
    resumeUrl: z
      .string()
      .trim()
      .refine((val) => val === "" || z.string().url().safeParse(val).success, {
        message: "Invalid resume URL format",
      }),
    currentCompany: z
      .string({ required_error: "Current company is required" })
      .max(100, "Company name cannot exceed 100 characters")
      .transform(sanitizeString),
    currentPosition: z
      .string({ required_error: "Current position is required" })
      .max(100, "Position name cannot exceed 100 characters")
      .transform(sanitizeString),
    experienceYears: z
      .number({ required_error: "Experience years is required" })
      .min(0, "Experience years cannot be negative")
      .max(60, "Experience years cannot exceed 60 years"),
    availabilityStatus: z
      .string({ required_error: "Availability status is required" })
      .max(100, "Availability status cannot exceed 100 characters")
      .transform(sanitizeString),
    ctaButtonText: z.string().max(50, "CTA button text too long").transform(sanitizeString),
    ctaButtonUrl: z.string().max(200, "CTA button URL too long").transform(sanitizeString),
  }),
  about: z.object({
    aboutHeading: z
      .string({ required_error: "About heading is required" })
      .min(1, "About heading cannot be empty")
      .max(200, "About heading cannot exceed 200 characters")
      .transform(sanitizeString),
    aboutDescription: z
      .string({ required_error: "About description is required" })
      .min(1, "About description cannot be empty")
      .max(1000, "About description cannot exceed 1000 characters")
      .transform(sanitizeString),
    longBiography: z
      .string({ required_error: "Long biography is required" })
      .min(1, "Long biography cannot be empty")
      .max(5000, "Long biography cannot exceed 5000 characters")
      .transform(sanitizeString),
    location: z
      .string({ required_error: "Location is required" })
      .max(150, "Location cannot exceed 150 characters")
      .transform(sanitizeString),
    nationality: z
      .string({ required_error: "Nationality is required" })
      .max(100, "Nationality cannot exceed 100 characters")
      .transform(sanitizeString),
    languages: z
      .array(z.string().max(50, "Language string too long").transform(sanitizeString))
      .min(1, "At least one language is required"),
    interests: z
      .array(z.string().max(50, "Interest string too long").transform(sanitizeString))
      .min(1, "At least one interest is required"),
    portraitTitle: z
      .string({ required_error: "Portrait Title is required" })
      .min(1, "Portrait Title cannot be empty")
      .max(20, "Portrait Title cannot exceed 20 characters")
      .transform(sanitizeString),
    portraitSubtitle: z
      .string({ required_error: "Portrait Subtitle is required" })
      .min(1, "Portrait Subtitle cannot be empty")
      .max(50, "Portrait Subtitle cannot exceed 50 characters")
      .transform(sanitizeString),
    portraitRingColor: z
      .string({ required_error: "Portrait Ring Color is required" })
      .min(3, "Invalid color format")
      .max(30, "Color value too long")
      .transform(sanitizeString),
    portraitGlowColor: z
      .string({ required_error: "Portrait Glow Color is required" })
      .min(3, "Invalid color format")
      .max(30, "Color value too long")
      .transform(sanitizeString),
    portraitAccentColor: z
      .string({ required_error: "Portrait Accent Color is required" })
      .min(3, "Invalid color format")
      .max(30, "Color value too long")
      .transform(sanitizeString),
    portraitBackgroundEffect: z
      .string()
      .max(150, "Effect string too long")
      .transform(sanitizeString)
      .default("bg-gradient-to-b from-blue-500/10 to-transparent"),
    portraitAnimationEnabled: z.boolean({
      required_error: "Portrait Animation Enabled flag is required",
    }),
    portraitImage: z
      .string()
      .trim()
      .refine((val) => val === "" || z.string().url().safeParse(val).success, {
        message: "Invalid portrait image URL format",
      })
      .default(""),
  }),
  contact: z.object({
    primaryEmail: z
      .string({ required_error: "Primary email is required" })
      .email("Invalid primary email format")
      .max(100, "Email cannot exceed 100 characters")
      .transform(sanitizeString),
    secondaryEmail: z
      .string()
      .trim()
      .refine((val) => val === "" || z.string().email().safeParse(val).success, {
        message: "Invalid secondary email format",
      })
      .transform(sanitizeString),
    phoneNumber: z
      .string({ required_error: "Phone number is required" })
      .min(5, "Phone number is too short")
      .max(30, "Phone number is too long")
      .transform(sanitizeString),
    whatsApp: z.string().max(30, "WhatsApp number is too long").transform(sanitizeString),
    address: z
      .string({ required_error: "Address is required" })
      .max(200, "Address cannot exceed 200 characters")
      .transform(sanitizeString),
    city: z
      .string({ required_error: "City is required" })
      .max(100, "City cannot exceed 100 characters")
      .transform(sanitizeString),
    state: z
      .string({ required_error: "State is required" })
      .max(100, "State cannot exceed 100 characters")
      .transform(sanitizeString),
    country: z
      .string({ required_error: "Country is required" })
      .max(100, "Country cannot exceed 100 characters")
      .transform(sanitizeString),
    timezone: z
      .string({ required_error: "Timezone is required" })
      .max(50, "Timezone cannot exceed 50 characters")
      .transform(sanitizeString),
  }),
  socialLinks: z.object({
    github: z
      .string()
      .trim()
      .refine((val) => val === "" || z.string().url().safeParse(val).success, {
        message: "Invalid GitHub URL",
      }),
    linkedin: z
      .string()
      .trim()
      .refine((val) => val === "" || z.string().url().safeParse(val).success, {
        message: "Invalid LinkedIn URL",
      }),
    portfolio: z
      .string()
      .trim()
      .refine((val) => val === "" || z.string().url().safeParse(val).success, {
        message: "Invalid Portfolio URL",
      }),
    resume: z
      .string()
      .trim()
      .refine((val) => val === "" || z.string().url().safeParse(val).success, {
        message: "Invalid Resume URL",
      }),
    twitter: z
      .string()
      .trim()
      .refine((val) => val === "" || z.string().url().safeParse(val).success, {
        message: "Invalid Twitter URL",
      }),
    instagram: z
      .string()
      .trim()
      .refine((val) => val === "" || z.string().url().safeParse(val).success, {
        message: "Invalid Instagram URL",
      }),
    youtube: z
      .string()
      .trim()
      .refine((val) => val === "" || z.string().url().safeParse(val).success, {
        message: "Invalid YouTube URL",
      }),
    leetcode: z
      .string()
      .trim()
      .refine((val) => val === "" || z.string().url().safeParse(val).success, {
        message: "Invalid LeetCode URL",
      }),
    codeforces: z
      .string()
      .trim()
      .refine((val) => val === "" || z.string().url().safeParse(val).success, {
        message: "Invalid Codeforces URL",
      }),
    codechef: z
      .string()
      .trim()
      .refine((val) => val === "" || z.string().url().safeParse(val).success, {
        message: "Invalid CodeChef URL",
      }),
    geeksforgeeks: z
      .string()
      .trim()
      .refine((val) => val === "" || z.string().url().safeParse(val).success, {
        message: "Invalid GeeksforGeeks URL",
      }),
    hackerrank: z
      .string()
      .trim()
      .refine((val) => val === "" || z.string().url().safeParse(val).success, {
        message: "Invalid HackerRank URL",
      }),
    hackerone: z
      .string()
      .trim()
      .refine((val) => val === "" || z.string().url().safeParse(val).success, {
        message: "Invalid HackerOne URL",
      }),
    medium: z
      .string()
      .trim()
      .refine((val) => val === "" || z.string().url().safeParse(val).success, {
        message: "Invalid Medium URL",
      }),
    devto: z
      .string()
      .trim()
      .refine((val) => val === "" || z.string().url().safeParse(val).success, {
        message: "Invalid Dev.to URL",
      }),
    stackoverflow: z
      .string()
      .trim()
      .refine((val) => val === "" || z.string().url().safeParse(val).success, {
        message: "Invalid StackOverflow URL",
      }),
  }),
  seo: z.object({
    metaTitle: z
      .string({ required_error: "Meta title is required" })
      .max(100, "Meta title cannot exceed 100 characters")
      .transform(sanitizeString),
    metaDescription: z
      .string({ required_error: "Meta description is required" })
      .max(300, "Meta description cannot exceed 300 characters")
      .transform(sanitizeString),
    keywords: z.array(z.string().max(50, "Keyword too long").transform(sanitizeString)).default([]),
    ogImage: z
      .string()
      .trim()
      .refine((val) => val === "" || z.string().url().safeParse(val).success, {
        message: "Invalid OpenGraph Image URL format",
      }),
  }),
});

export const updatePersonalInfoSchema = z.object({
  body: personalInfoBodySchema,
});

export type UpdatePersonalInfoInput = z.infer<typeof updatePersonalInfoSchema>["body"];
