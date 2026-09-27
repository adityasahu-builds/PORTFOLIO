import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  defaultPersonalInfo,
  defaultProjects,
  defaultSkills,
  defaultExperiences,
  defaultEducations,
} from "../src/server/db/seedData";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database via Prisma for Supabase...");

  // 1. Personal Info
  const existingInfo = await prisma.personalInfo.findFirst();
  if (!existingInfo) {
    await prisma.personalInfo.create({
      data: {
        hero: defaultPersonalInfo.hero,
        about: defaultPersonalInfo.about,
        contact: defaultPersonalInfo.contact,
        socialLinks: defaultPersonalInfo.socialLinks,
        seo: defaultPersonalInfo.seo,
      },
    });
    console.log("✓ Seeded Personal Info");
  }

  // 2. Admin User
  const existingAdmin = await prisma.user.findFirst({
    where: { role: "admin" },
  });
  if (!existingAdmin) {
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
    console.log("✓ Seeded Admin User");
  }

  // 3. Skills
  const skillCount = await prisma.skill.count();
  if (skillCount === 0) {
    for (const skill of defaultSkills as any[]) {
      await prisma.skill.create({
        data: {
          title: skill.title,
          slug: skill.slug,
          category: skill.category,
          icon: skill.icon || "",
          iconName: skill.iconName || "",
          imageUrl: skill.imageUrl || "",
          skillLevel: skill.skillLevel || 80,
          experience: skill.experience || 1,
          description: skill.description || "",
          featured: skill.featured || false,
          displayOrder: skill.displayOrder || 0,
          status: (skill.status as any) || "Active",
          x: skill.x || "50%",
          y: skill.y || "50%",
          connections: skill.connections || [],
        },
      });
    }
    console.log(`✓ Seeded ${defaultSkills.length} Skills`);
  }

  // 4. Projects
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
    console.log(`✓ Seeded ${defaultProjects.length} Projects`);
  }

  // 5. Experiences
  const expCount = await prisma.experience.count();
  if (expCount === 0) {
    for (const exp of defaultExperiences as any[]) {
      await prisma.experience.create({
        data: {
          companyName: exp.companyName,
          role: exp.role,
          employmentType: exp.employmentType || "Full-time",
          location: exp.location || "",
          startDate: new Date(exp.startDate),
          endDate: exp.endDate ? new Date(exp.endDate) : null,
          currentlyWorking: exp.currentlyWorking || false,
          companyLogo: exp.companyLogo || "",
          companyWebsite: exp.companyWebsite || "",
          description: exp.description || "",
          responsibilities: exp.responsibilities || [],
          achievements: exp.achievements || [],
          technologiesUsed: exp.technologiesUsed || [],
          displayOrder: exp.displayOrder || 0,
          featured: exp.featured || false,
          status: (exp.status as any) || "Active",
          iconName: exp.iconName || "Briefcase",
        },
      });
    }
    console.log(`✓ Seeded ${defaultExperiences.length} Experiences`);
  }

  // 6. Educations
  const eduCount = await prisma.education.count();
  if (eduCount === 0) {
    for (const edu of defaultEducations as any[]) {
      await prisma.education.create({
        data: {
          institutionName: edu.institutionName,
          degree: edu.degree,
          fieldOfStudy: edu.fieldOfStudy,
          location: edu.location || "",
          startDate: new Date(edu.startDate),
          endDate: edu.endDate ? new Date(edu.endDate) : null,
          currentlyStudying: edu.currentlyStudying || false,
          grade: edu.grade || "",
          description: edu.description || "",
          achievements: edu.achievements || [],
          institutionLogo: edu.institutionLogo || "",
          institutionWebsite: edu.institutionWebsite || "",
          displayOrder: edu.displayOrder || 0,
          featured: edu.featured || false,
          status: (edu.status as any) || "Active",
        },
      });
    }
    console.log(`✓ Seeded ${defaultEducations.length} Educations`);
  }

  console.log("Seeding complete successfully.");
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
