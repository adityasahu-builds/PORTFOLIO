import mongoose from "mongoose";
import app from "./src/app";
import { dbConnection } from "./src/database/connection";
import { config } from "./src/config/env";
import dns from "dns";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Skill } from "./src/modules/skill/skill.model";
import { Project } from "./src/modules/project/project.model";
import { Experience } from "./src/modules/experience/experience.model";
import { Education } from "./src/modules/education/education.model";
import { Certificate } from "./src/modules/certificate/certificate.model";
import { PersonalInfo } from "./src/modules/personal-info/personal-info.model";

dns.setDefaultResultOrder("ipv4first");

const verifyDynamicPortfolio = async () => {
  console.log("=== DYNAMIC PORTFOLIO ENDPOINTS VERIFICATION ===");
  let mongoServer: MongoMemoryServer | null = null;

  try {
    // 1. Connect to Database (MongoMemoryServer directly for isolated test env)
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    config.databaseUrl = mongoUri;

    await dbConnection.connect();
    console.log("✅ Connected successfully to in-memory database server.");

    // Seed mock data matching our required portfolio sections
    console.log("Seeding test MongoDB dataset...");
    
    // Seed Personal Info
    await PersonalInfo.create({
      hero: {
        fullName: "Aditya Sahu Test",
        professionalTitle: "Creative Architect & Test Lead",
        shortTagline: "Frontend Architect",
        typingText: ["Automated Tester", "TypeScript Lover"],
        heroDescription: "Verify dynamic portfolio works 100% from DB.",
        ctaButtonText: "Work With Me",
        ctaButtonUrl: "#projects",
        profileImage: "https://cloudinary.com/avatar.png",
        resumeUrl: "https://cloudinary.com/resume.pdf",
        availabilityStatus: "Open for Verification Tasks"
      },
      about: {
        aboutHeading: "About The System",
        aboutDescription: "System Check Suite",
        longBiography: "Seeded from MongoDB verification runner.",
        location: "Delhi, India",
        nationality: "Indian",
        languages: ["English", "Hindi"],
        interests: ["TDD", "Automation"]
      },
      contact: {
        primaryEmail: "aditya_test@example.com",
        phoneNumber: "+91-9999999999",
        address: "123 Test Street",
        city: "Delhi",
        state: "Delhi",
        country: "India",
        timezone: "Asia/Kolkata"
      },
      socialLinks: {
        github: "https://github.com/adityatest",
        linkedin: "https://linkedin.com/in/adityatest"
      },
      seo: {
        metaTitle: "Aditya Sahu - Test Portfolio",
        metaDescription: "Automated portfolio test details."
      }
    });

    // Seed active skill
    await Skill.create({
      title: "React Validation",
      slug: "react-val",
      category: "Frontend Tools",
      skillLevel: 95,
      featured: true,
      displayOrder: 1,
      status: "Active",
      x: "30%",
      y: "40%",
      connections: []
    });

    // Seed featured project
    await Project.create({
      title: "Verifier Platform",
      slug: "verifier-platform",
      description: "Test run portfolio dashboard.",
      techStack: ["React", "Express", "Mongoose"],
      featured: true,
      category: "Automation Frameworks",
      displayOrder: 1,
      status: "Currently Building",
      mockupType: "portfolio",
      thumbnail: "https://cloudinary.com/thumbnail.png",
      keyFeatures: ["Mock Test Support"]
    });

    // Seed experience
    await Experience.create({
      companyName: "QA Corp",
      role: "Lead QA Engineer",
      employmentType: "Full-time",
      startDate: "2024-01-01",
      currentlyWorking: true,
      displayOrder: 1,
      status: "Active",
      responsibilities: ["Reviewing code integrations"],
      achievements: ["Speed up test execution by 300%"],
      technologiesUsed: ["Jest", "Supertest"],
      companyLogo: "https://cloudinary.com/qacorp.png"
    });

    // Seed education
    await Education.create({
      institutionName: "Tech University",
      degree: "Bachelor of Technology",
      fieldOfStudy: "Computer Science",
      startDate: "2020-01-01",
      currentlyStudying: true,
      displayOrder: 1,
      status: "Active",
      achievements: ["First rank in code challenge"],
      institutionLogo: "https://cloudinary.com/tu.png"
    });

    // Seed certificate
    await Certificate.create({
      title: "Certified QA Lead",
      issuer: "QA Alliance",
      issueDate: "2025-06-01",
      doesNotExpire: true,
      featured: true,
      displayOrder: 1,
      status: "Active",
      imageUrl: "https://cloudinary.com/cert.png"
    });

    console.log("✅ Seeding complete.\n");

    // 2. Start express server on port 5002
    const server = app.listen(5002, async () => {
      console.log("Server started on port 5002 for verification.\n");

      try {
        // Test 1: Fetch Personal Info (GET /api/v1/personal-info)
        console.log("--- Test 1: Fetching personal-info ---");
        const piRes = await fetch("http://127.0.0.1:5002/api/v1/personal-info");
        console.log("Status:", piRes.status);
        const piJson = await piRes.json();
        console.log("Full Name from DB:", piJson?.data?.hero?.fullName);
        if (piRes.status !== 200 || piJson?.data?.hero?.fullName !== "Aditya Sahu Test") {
          throw new Error("❌ Dynamic personal-info verification failed.");
        }
        console.log("✅ Personal-info endpoint confirmed.\n");

        // Test 2: Fetch Active Skills (GET /api/v1/skills?status=Active)
        console.log("--- Test 2: Fetching active skills ---");
        const skillRes = await fetch("http://127.0.0.1:5002/api/v1/skills?status=Active");
        console.log("Status:", skillRes.status);
        const skillJson = await skillRes.json();
        console.log("Active skill count found:", skillJson?.data?.length);
        if (skillRes.status !== 200 || skillJson?.data?.[0]?.title !== "React Validation") {
          throw new Error("❌ Dynamic skills verification failed.");
        }
        console.log("✅ Skills endpoint confirmed.\n");

        // Test 3: Fetch Featured Projects (GET /api/v1/projects?featured=true)
        console.log("--- Test 3: Fetching featured projects ---");
        const projectRes = await fetch("http://127.0.0.1:5002/api/v1/projects?featured=true");
        console.log("Status:", projectRes.status);
        const projectJson = await projectRes.json();
        console.log("Featured project count found:", projectJson?.data?.length);
        if (projectRes.status !== 200 || projectJson?.data?.[0]?.title !== "Verifier Platform") {
          throw new Error("❌ Dynamic projects verification failed.");
        }
        console.log("✅ Projects endpoint confirmed.\n");

        // Test 4: Fetch Active Experiences (GET /api/v1/experience?status=Active)
        console.log("--- Test 4: Fetching active experiences ---");
        const expRes = await fetch("http://127.0.0.1:5002/api/v1/experience?status=Active");
        console.log("Status:", expRes.status);
        const expJson = await expRes.json();
        console.log("Active experiences found:", expJson?.data?.length);
        console.log("Company Logo URL from DB:", expJson?.data?.[0]?.companyLogo);
        if (expRes.status !== 200 || expJson?.data?.[0]?.companyLogo !== "https://cloudinary.com/qacorp.png") {
          throw new Error("❌ Dynamic experience logo verification failed.");
        }
        console.log("✅ Experience endpoint confirmed.\n");

        // Test 5: Fetch Active Educations (GET /api/v1/education?status=Active)
        console.log("--- Test 5: Fetching active educations ---");
        const eduRes = await fetch("http://127.0.0.1:5002/api/v1/education?status=Active");
        console.log("Status:", eduRes.status);
        const eduJson = await eduRes.json();
        console.log("Active education records found:", eduJson?.data?.length);
        if (eduRes.status !== 200 || eduJson?.data?.[0]?.institutionName !== "Tech University") {
          throw new Error("❌ Dynamic education verification failed.");
        }
        console.log("✅ Education endpoint confirmed.\n");

        // Test 6: Fetch Active Certificates (GET /api/v1/certificates?status=Active)
        console.log("--- Test 6: Fetching active certificates ---");
        const certRes = await fetch("http://127.0.0.1:5002/api/v1/certificates?status=Active");
        console.log("Status:", certRes.status);
        const certJson = await certRes.json();
        console.log("Active certificates found:", certJson?.data?.length);
        console.log("Certificate Image URL from DB:", certJson?.data?.[0]?.imageUrl);
        if (certRes.status !== 200 || certJson?.data?.[0]?.imageUrl !== "https://cloudinary.com/cert.png") {
          throw new Error("❌ Dynamic certificates verification failed.");
        }
        console.log("✅ Certificates endpoint confirmed.\n");

        console.log("⭐️ ALL DYNAMIC PORTFOLIO API ENDPOINTS PASS SUCCESSFULLY! ⭐️");
        
        server.close();
        await dbConnection.disconnect();
        if (mongoServer) await mongoServer.stop();
        process.exit(0);
      } catch (innerErr) {
        console.error("Test execution failed:", innerErr);
        server.close();
        await dbConnection.disconnect();
        if (mongoServer) await mongoServer.stop();
        process.exit(1);
      }
    });
  } catch (error) {
    console.error("Verification setup failed:", error);
    if (mongoServer) await mongoServer.stop();
    process.exit(1);
  }
};

verifyDynamicPortfolio();
