import mongoose from "mongoose";
import app from "./src/app";
import { dbConnection } from "./src/database/connection";
import { PersonalInfo } from "./src/modules/personal-info/personal-info.model";
import { User } from "./src/modules/auth/user.model";
import jwt from "jsonwebtoken";
import { config } from "./src/config/env";
import dns from "dns";
import { MongoMemoryServer } from "mongodb-memory-server";

dns.setDefaultResultOrder("ipv4first");

const verifyPersonalInfo = async () => {
  console.log("=== PERSONAL INFO MODULE INTEGRATION VERIFICATION ===");
  let mongoServer: MongoMemoryServer | null = null;

  try {
    // 1. Connect to Database (MongoMemoryServer directly for reliable test environment)
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    config.databaseUrl = mongoUri;

    await dbConnection.connect();
    console.log("✅ Database connected successfully to in-memory server.");

    // Seed default personal info if database is empty
    const count = await PersonalInfo.countDocuments();
    if (count === 0) {
      await PersonalInfo.create({
        hero: {
          fullName: "Aditya Sahu",
          professionalTitle: "Full Stack Developer & AI/ML Engineer",
          shortTagline: "Full-Stack Developer & Designer",
          typingText: [
            "Creative Developer",
            "Full Stack Developer",
            "AI/ML Enthusiast",
            "Creative Problem Solver"
          ],
          heroDescription: "I am a passionate software developer with a strong interest in Full Stack Web Development and AI/ML.",
          profileImage: "",
          resumeUrl: "",
          currentCompany: "Self-Learning",
          currentPosition: "Full Stack Developer",
          experienceYears: 3,
          availabilityStatus: "Open to Internship Opportunities",
          ctaButtonText: "Explore My Projects",
          ctaButtonUrl: "#projects"
        },
        about: {
          aboutHeading: "About Me",
          aboutDescription: "I love building modern, scalable, and user-friendly web applications that provide seamless digital experiences.",
          longBiography: "I am a passionate software developer with a strong interest in Full Stack Web Development. Currently, I am expanding my horizons by learning Artificial Intelligence & Machine Learning. I love building modern, scalable, and user-friendly web applications that provide seamless digital experiences. Constantly improving my problem-solving and development skills, my goal is to become an exceptional software engineer who creates real-world solutions through technology.",
          location: "Mandsaur, Madhya Pradesh, India",
          nationality: "Indian",
          languages: ["English", "Hindi"],
          interests: ["Coding", "Machine Learning", "Gaming", "Continuous Learning"],
          portraitTitle: "Aditya Sahu",
          portraitSubtitle: "Developer & ML Engineer",
          portraitRingColor: "#3b82f6",
          portraitGlowColor: "rgba(59, 130, 246, 0.5)",
          portraitAccentColor: "#60a5fa",
          portraitAnimationEnabled: true,
        },
        contact: {
          primaryEmail: "hello@adityasahu.dev",
          secondaryEmail: "",
          phoneNumber: "+91-XXXXXXXXXX",
          whatsApp: "+91-XXXXXXXXXX",
          address: "Mandsaur, Madhya Pradesh",
          city: "Mandsaur",
          state: "Madhya Pradesh",
          country: "India",
          timezone: "IST (GMT+5:30)"
        },
        socialLinks: {
          github: "https://github.com/adityasahu",
          linkedin: "https://linkedin.com/in/adityasahu",
          portfolio: "http://localhost:3000",
          resume: "",
          twitter: "",
          instagram: "https://instagram.com/adityasahu",
          youtube: "",
          leetcode: "",
          codeforces: "",
        },
        seo: {
          metaTitle: "Aditya Sahu Portfolio",
          metaDescription: "Dynamic CMS-driven Portfolio Website.",
          metaKeywords: ["Aditya Sahu", "Developer", "Portfolio"],
        }
      });
      console.log("🌱 Seeded mock personal-info successfully.");
    }

    // 2. Start express server on port 5001
    const server = app.listen(5001, async () => {
      console.log("Server started for verification on port 5001.\n");

      try {
        // Test 1: Fetch Personal Info (Public Endpoint)
        console.log("--- Test 1: Fetching seeded personal info (Public GET) ---");
        const getRes = await fetch("http://127.0.0.1:5001/api/v1/personal-info");
        console.log("HTTP Status:", getRes.status);
        const getJson = await getRes.json();
        console.log("Seeded Hero Name:", getJson?.data?.hero?.fullName);
        console.log("Seeded Availability Status:", getJson?.data?.hero?.availabilityStatus);

        if (getRes.status !== 200 || !getJson?.data) {
          throw new Error("❌ Failed public GET verification.");
        }
        console.log("✅ Public GET personal-info verified successfully.\n");

        // Test 2: Unauthenticated PUT Request (Should fail with 401)
        console.log("--- Test 2: Attempting unauthenticated update (PUT) ---");
        const putUnauthRes = await fetch("http://127.0.0.1:5001/api/v1/personal-info", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hero: { fullName: "Intruder Sahu" } }),
        });
        console.log("HTTP Status (Expected: 401):", putUnauthRes.status);
        const putUnauthJson = await putUnauthRes.json();
        console.log("Unauthenticated Response message:", putUnauthJson.message);

        if (putUnauthRes.status !== 401) {
          throw new Error("❌ Unauthenticated PUT request did not return 401 Unauthorized.");
        }
        console.log("✅ Authenticated check verified successfully.\n");

        // Test 3: Authenticated PUT Request with validation error (Should fail with 400)
        console.log("--- Test 3: Creating test admin & signing token for validation test ---");
        
        // Ensure test user does not already exist
        await User.deleteMany({ email: "test_verifier@example.com" });
        
        const testUser = await User.create({
          username: "test_verifier",
          email: "test_verifier@example.com",
          password: "password123",
          role: "admin",
          refreshToken: "temp-refresh-token",
        }) as any;

        const token = jwt.sign(
          { id: testUser._id.toString(), email: testUser.email, role: testUser.role },
          config.jwtSecret,
          { expiresIn: "15m" }
        );

        console.log("Sending invalid PUT request (invalid email structure)...");
        const putInvalidRes = await fetch("http://127.0.0.1:5001/api/v1/personal-info", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            contact: { primaryEmail: "not-an-email" },
          }),
        });

        console.log("HTTP Status (Expected: 400/422):", putInvalidRes.status);
        const putInvalidJson = await putInvalidRes.json();
        console.log("Validation Error Response:", JSON.stringify(putInvalidJson));

        if (putInvalidRes.status !== 400 && putInvalidRes.status !== 422) {
          throw new Error(`❌ Invalid PUT request did not return 400 or 422. Got: ${putInvalidRes.status}`);
        }
        console.log("✅ Zod structural validation verified successfully.\n");

        // Test 4: Authenticated PUT Request with valid payload (Should succeed with 200)
        console.log("--- Test 4: Sending valid update payload (PUT) ---");
        const validPayload = {
          hero: {
            fullName: "Aditya Sahu (QA Updated)",
            professionalTitle: "Elite Principal Engineer",
            shortTagline: "Framer Motion & WebGL Architect",
            heroDescription: "Verifying e2e connection successfully.",
            availabilityStatus: "Open to High-Profile Freelance Projects",
            ctaButtonText: "View Case Studies",
            ctaButtonUrl: "#portfolio",
            profileImage: "https://example.com/avatar.jpg",
            resumeUrl: "https://example.com/aditya_cv.pdf",
            typingText: ["Expert Developer", "Lead Architect", "AI Innovator"],
            currentCompany: "Self-Learning",
            currentPosition: "Full Stack Developer",
            experienceYears: 3,
          },
          about: {
            aboutHeading: "Pioneering the Future",
            aboutDescription: "About Aditya Sahu (Dynamic)",
            longBiography: "I am a verification-proven software engineering wizard.",
            location: "Mandsaur, MP, India (QA)",
            nationality: "Indian (QA)",
            languages: ["JavaScript", "TypeScript", "Python"],
            interests: ["Advanced Agentic Coding", "Three.js", "AI Pipelines"],
            portraitTitle: "Aditya QA",
            portraitSubtitle: "Lead QA Engineer",
            portraitRingColor: "#10b981",
            portraitGlowColor: "rgba(16, 185, 129, 0.5)",
            portraitAccentColor: "#34d399",
            portraitAnimationEnabled: false,
          },
          contact: {
            primaryEmail: "aditya_qa@example.com",
            secondaryEmail: "aditya_alt@example.com",
            phoneNumber: "+91-9876543210",
            whatsApp: "+91-9876543210",
            address: "Mandsaur, Madhya Pradesh, India",
            city: "Mandsaur",
            state: "Madhya Pradesh",
            country: "India",
            timezone: "IST (GMT+5:30)",
          },
          socialLinks: {
            github: "https://github.com/adityasahu",
            linkedin: "https://linkedin.com/in/adityasahu",
            portfolio: "https://adityasahu.dev",
            resume: "https://example.com/cv.pdf",
            twitter: "https://twitter.com/adityasahu",
            instagram: "https://instagram.com/adityasahu",
            youtube: "",
            leetcode: "https://leetcode.com/adityasahu",
            codeforces: "",
            codechef: "",
            geeksforgeeks: "",
            hackerrank: "",
            hackerone: "",
            medium: "",
            devto: "",
            stackoverflow: "https://stackoverflow.com/users/adityasahu",
          },
          seo: {
            metaTitle: "Aditya Sahu Portfolio (QA)",
            metaDescription: "Verified Dynamic Portfolio",
            keywords: ["Aditya Sahu", "Dynamic CMS", "Software Engineer"],
            ogImage: "https://example.com/og.jpg",
          },
        };

        const putValidRes = await fetch("http://127.0.0.1:5001/api/v1/personal-info", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(validPayload),
        });

        console.log("HTTP Status (Expected: 200):", putValidRes.status);
        const putValidJson = await putValidRes.json();
        console.log("Successful Update Response:", putValidJson?.message);

        if (putValidRes.status !== 200) {
          throw new Error("❌ Valid PUT request failed.");
        }
        console.log("✅ Authenticated valid PUT update verified successfully.\n");

        // Test 5: Verify update persists in MongoDB
        console.log("--- Test 5: Verifying document persistence in MongoDB ---");
        const storedDoc = await PersonalInfo.findOne();
        console.log("Stored Hero Name:", storedDoc?.hero?.fullName);
        console.log("Stored About Nationality:", storedDoc?.about?.nationality);
        console.log("Stored Social LinkedIn Link:", storedDoc?.socialLinks?.linkedin);

        if (storedDoc?.hero?.fullName !== "Aditya Sahu (QA Updated)") {
          throw new Error("❌ Data in MongoDB does not match updated payload.");
        }
        console.log("✅ Database storage verification successful.\n");

        // Clean up verifier user
        await User.deleteMany({ email: "test_verifier@example.com" });
        console.log("🧹 Test user cleaned up successfully.");

        console.log("\n⭐️ ALL VERIFICATION TESTS PASSED SUCCESSFULLY! ⭐️");
        
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

verifyPersonalInfo();
