import mongoose from "mongoose";
import dns from "dns";
import { defaultPersonalInfo, defaultProjects, defaultSkills, defaultExperiences, defaultEducations } from "./seedData";

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  // Ignore in browser/edge environments
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  hasSeeded: boolean;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
  hasSeeded: false,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectDB(): Promise<typeof mongoose | null> {
  const databaseUrl = process.env.DATABASE_URL || process.env.MONGODB_URI;

  if (!databaseUrl || databaseUrl.includes("<username>")) {
    console.warn("DATABASE_URL is not configured or using placeholder. Running in fallback mode.");
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
      maxPoolSize: 10,
    };

    cached.promise = mongoose.connect(databaseUrl, opts).then((m) => {
      console.log("Connected to MongoDB Atlas successfully.");
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
    
    // Auto-seed collections if empty
    if (!cached.hasSeeded && cached.conn) {
      cached.hasSeeded = true;
      runAutoSeed().catch((err) => {
        console.error("Auto-seed error:", err.message);
      });
    }
  } catch (e: any) {
    cached.promise = null;
    console.error("MongoDB Connection Failed:", e.message);
    return null;
  }

  return cached.conn;
}

async function runAutoSeed() {
  try {
    const { PersonalInfo, Project, Skill, Experience, Education, User } = await import("../models");

    const personalInfoCount = await PersonalInfo.countDocuments();
    if (personalInfoCount === 0) {
      await PersonalInfo.create(defaultPersonalInfo);
      console.log("Auto-seeded default Personal Info.");
    }

    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      await Project.insertMany(defaultProjects);
      console.log("Auto-seeded default Projects.");
    }

    const skillCount = await Skill.countDocuments();
    if (skillCount === 0) {
      await Skill.insertMany(defaultSkills);
      console.log("Auto-seeded default Skills.");
    }

    const expCount = await Experience.countDocuments();
    if (expCount === 0) {
      await Experience.insertMany(defaultExperiences);
      console.log("Auto-seeded default Experiences.");
    }

    const eduCount = await Education.countDocuments();
    if (eduCount === 0) {
      await Education.insertMany(defaultEducations);
      console.log("Auto-seeded default Education.");
    }

    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount === 0) {
      const adminUser = new User({
        username: process.env.ADMIN_USERNAME || "admin",
        email: process.env.ADMIN_EMAIL || "admin@adityasahu.dev",
        password: process.env.ADMIN_PASSWORD || "AdminSecurePass123!",
        role: "admin",
      });
      await adminUser.save();
      console.log("Auto-seeded default Admin User.");
    }
  } catch (err: any) {
    console.error("Error during auto-seed:", err.message);
  }
}
