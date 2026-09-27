import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {
  defaultPersonalInfo,
  defaultProjects,
  defaultSkills,
  defaultExperiences,
  defaultEducations,
} from "./seedData";

interface PrismaConnectionCache {
  isConnected: boolean;
  hasSeeded: boolean;
}

declare global {
  // eslint-disable-next-line no-var
  var prismaConnectionCache: PrismaConnectionCache | undefined;
}

const cached: PrismaConnectionCache = global.prismaConnectionCache || {
  isConnected: false,
  hasSeeded: false,
};

if (!global.prismaConnectionCache) {
  global.prismaConnectionCache = cached;
}

export async function connectDB() {
  const databaseUrl = process.env.DATABASE_URL;

  if (
    !databaseUrl ||
    databaseUrl.includes("<username>") ||
    databaseUrl.includes("mongodb+srv") ||
    databaseUrl.includes("[PROJECT-REF]") ||
    databaseUrl.includes("[YOUR-PASSWORD]")
  ) {
    // If DATABASE_URL is not yet set or contains placeholder credentials
    return prisma;
  }

  if (cached.isConnected) {
    return prisma;
  }

  try {
    await prisma.$connect();
    cached.isConnected = true;
    console.log("Connected to Supabase PostgreSQL successfully via Prisma.");

    if (!cached.hasSeeded) {
      cached.hasSeeded = true;
      runAutoSeed().catch((err: any) => {
        console.error("Supabase auto-seed warning:", err?.message || err);
      });
    }
  } catch (err: any) {
    console.warn("Supabase PostgreSQL connection notice:", err?.message || err);
  }

  return prisma;
}

async function runAutoSeed() {
  try {
    const personalInfoCount = await prisma.personalInfo.count();
    if (personalInfoCount === 0) {
      await prisma.personalInfo.create({
        data: {
          hero: defaultPersonalInfo.hero,
          about: defaultPersonalInfo.about,
          contact: defaultPersonalInfo.contact,
          socialLinks: defaultPersonalInfo.socialLinks,
          seo: defaultPersonalInfo.seo,
        },
      });
      console.log("Auto-seeded default Personal Info into Supabase.");
    }

    const projectCount = await prisma.project.count();
    if (projectCount === 0) {
      for (const p of defaultProjects as any[]) {
        await prisma.project.create({
          data: {
            title: p.title,
            slug: p.slug,
            description: p.description || p.shortDescription || "",
            shortDescription: p.shortDescription || p.description || "",
            longDescription: p.longDescription || "",
            techStack: p.techStack || p.technologies || [],
            technologies: p.technologies || p.techStack || [],
            gitHubUrl: p.gitHubUrl || p.githubUrl || "",
            githubUrl: p.githubUrl || p.gitHubUrl || "",
            liveUrl: p.liveUrl || "",
            thumbnail: p.thumbnail || p.image || "",
            image: p.image || p.thumbnail || "",
            galleryImages: p.galleryImages || [],
            featured: p.featured || false,
            category: p.category || "General",
            displayOrder: p.displayOrder || p.order || 0,
            order: p.order || p.displayOrder || 0,
            status: p.status || "Completed",
            number: p.number || "",
            problemStatement: p.problemStatement || "",
            solution: p.solution || "",
            keyFeatures: p.keyFeatures || [],
            accentColor: p.accentColor || "#00d2ff",
            mockupType: p.mockupType || "portfolio",
          },
        });
      }
      console.log("Auto-seeded default Projects into Supabase.");
    }

    const skillCount = await prisma.skill.count();
    if (skillCount === 0) {
      for (const s of defaultSkills as any[]) {
        await prisma.skill.create({
          data: {
            title: s.title,
            slug: s.slug,
            category: s.category,
            icon: s.icon || "",
            iconName: s.iconName || "",
            imageUrl: s.imageUrl || "",
            skillLevel: s.skillLevel || 80,
            experience: s.experience || 1,
            description: s.description || "",
            featured: s.featured || false,
            displayOrder: s.displayOrder || 0,
            status: (s.status as any) || "Active",
            x: s.x || "50%",
            y: s.y || "50%",
            connections: s.connections || [],
          },
        });
      }
      console.log("Auto-seeded default Skills into Supabase.");
    }

    const expCount = await prisma.experience.count();
    if (expCount === 0) {
      for (const e of defaultExperiences as any[]) {
        await prisma.experience.create({
          data: {
            companyName: e.companyName,
            role: e.role,
            employmentType: e.employmentType || "Full-time",
            location: e.location || "",
            startDate: new Date(e.startDate),
            endDate: e.endDate ? new Date(e.endDate) : null,
            currentlyWorking: e.currentlyWorking || false,
            companyLogo: e.companyLogo || "",
            companyWebsite: e.companyWebsite || "",
            description: e.description || "",
            responsibilities: e.responsibilities || [],
            achievements: e.achievements || [],
            technologiesUsed: e.technologiesUsed || [],
            displayOrder: e.displayOrder || 0,
            featured: e.featured || false,
            status: (e.status as any) || "Active",
            iconName: e.iconName || "Briefcase",
          },
        });
      }
      console.log("Auto-seeded default Experiences into Supabase.");
    }

    const eduCount = await prisma.education.count();
    if (eduCount === 0) {
      for (const ed of defaultEducations as any[]) {
        await prisma.education.create({
          data: {
            institutionName: ed.institutionName,
            degree: ed.degree,
            fieldOfStudy: ed.fieldOfStudy,
            location: ed.location || "",
            startDate: new Date(ed.startDate),
            endDate: ed.endDate ? new Date(ed.endDate) : null,
            currentlyStudying: ed.currentlyStudying || false,
            grade: ed.grade || "",
            description: ed.description || "",
            achievements: ed.achievements || [],
            institutionLogo: ed.institutionLogo || "",
            institutionWebsite: ed.institutionWebsite || "",
            displayOrder: ed.displayOrder || 0,
            featured: ed.featured || false,
            status: (ed.status as any) || "Active",
          },
        });
      }
      console.log("Auto-seeded default Educations into Supabase.");
    }

    const adminCount = await prisma.user.count({ where: { role: "admin" } });
    if (adminCount === 0) {
      const rawPassword = process.env.ADMIN_PASSWORD || "AdminSecurePass123!";
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(rawPassword, salt);

      await prisma.user.create({
        data: {
          username: process.env.ADMIN_USERNAME || "admin",
          email: process.env.ADMIN_EMAIL || "admin@adityasahu.dev",
          password: hashedPassword,
          role: "admin",
        },
      });
      console.log("Auto-seeded default Admin User into Supabase.");
    }
  } catch (err: any) {
    console.warn("Auto-seed check note:", err?.message || err);
  }
}
