import { PersonalInfo, IPersonalInfo } from "./personal-info.model";
import { UpdatePersonalInfoInput } from "./personal-info.schema";
import { logger } from "../../utils/logger";

export class PersonalInfoService {
  /**
   * Fetch the single PersonalInfo configuration document.
   * If it doesn't exist, create it automatically with default values.
   */
  public async getPersonalInfo(): Promise<IPersonalInfo> {
    let info = await PersonalInfo.findOne();
    if (!info) {
      logger.info("No personal info document found. Creating default document automatically...");
      const rawFrontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
      const seededFrontendUrl = rawFrontendUrl.startsWith("http") ? rawFrontendUrl : `https://${rawFrontendUrl}`;

      info = new PersonalInfo({
        hero: {
          fullName: "Aditya Sahu",
          professionalTitle: "Full Stack Developer & AI/ML Engineer",
          shortTagline: "Full-Stack Developer & Designer",
          typingText: [
            "Creative Developer",
            "Full Stack Developer",
            "AI/ML Enthusiast",
            "Creative Problem Solver",
          ],
          heroDescription:
            "I am a passionate software developer with a strong interest in Full Stack Web Development and AI/ML.",
          profileImage: "",
          resumeUrl: "",
          currentCompany: "Self-Learning",
          currentPosition: "Full Stack Developer",
          experienceYears: 3,
          availabilityStatus: "Open to Internship Opportunities",
          ctaButtonText: "Explore My Projects",
          ctaButtonUrl: "#projects",
        },
        about: {
          aboutHeading: "About Me",
          aboutDescription:
            "I love building modern, scalable, and user-friendly web applications that provide seamless digital experiences.",
          longBiography:
            "I am a passionate software developer with a strong interest in Full Stack Web Development. Currently, I am expanding my horizons by learning Artificial Intelligence & Machine Learning. I love building modern, scalable, and user-friendly web applications that provide seamless digital experiences. Constantly improving my problem-solving and development skills, my goal is to become an exceptional software engineer who creates real-world solutions through technology.",
          location: "Mandsaur, Madhya Pradesh, India",
          nationality: "Indian",
          languages: ["English", "Hindi"],
          interests: ["Coding", "Machine Learning", "Gaming", "Continuous Learning"],
          portraitTitle: "AS",
          portraitSubtitle: "PORTRAIT",
          portraitRingColor: "#3b82f6",
          portraitGlowColor: "#00d2ff",
          portraitAccentColor: "#00d2ff",
          portraitBackgroundEffect: "bg-gradient-to-b from-blue-500/10 to-transparent",
          portraitAnimationEnabled: true,
          portraitImage: "",
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
          timezone: "IST (GMT+5:30)",
        },
        socialLinks: {
          github: "https://github.com/adityasahu",
          linkedin: "https://linkedin.com/in/adityasahu",
          portfolio: seededFrontendUrl,
          resume: "",
          twitter: "",
          instagram: "https://instagram.com/adityasahu",
          youtube: "",
          leetcode: "",
          codeforces: "",
          codechef: "",
          geeksforgeeks: "",
          hackerrank: "",
          hackerone: "",
          medium: "",
          devto: "",
          stackoverflow: "",
        },
        seo: {
          metaTitle: "Aditya Sahu — Software Developer & Frontend Architect",
          metaDescription:
            "Portfolio of Aditya Sahu — Software Developer and Frontend Architect specializing in Python, React, AI API Integrations, and Web Environments.",
          keywords: [
            "Aditya Sahu",
            "Software Developer",
            "Frontend Architect",
            "React",
            "Python",
            "AI Integration",
            "Web Development",
          ],
          ogImage: "",
        },
      });
      await info.save();
      logger.info("Successfully created default personal info record.");
    } else {
      // Self-healing migration for existing installations
      let hasMigrationChanges = false;
      if (info.about.portraitTitle === undefined) {
        info.about.portraitTitle = "AS";
        hasMigrationChanges = true;
      }
      if (info.about.portraitSubtitle === undefined) {
        info.about.portraitSubtitle = "PORTRAIT";
        hasMigrationChanges = true;
      }
      if (info.about.portraitRingColor === undefined) {
        info.about.portraitRingColor = "#3b82f6";
        hasMigrationChanges = true;
      }
      if (info.about.portraitGlowColor === undefined) {
        info.about.portraitGlowColor = "#00d2ff";
        hasMigrationChanges = true;
      }
      if (info.about.portraitAccentColor === undefined) {
        info.about.portraitAccentColor = "#00d2ff";
        hasMigrationChanges = true;
      }
      if (info.about.portraitBackgroundEffect === undefined) {
        info.about.portraitBackgroundEffect = "bg-gradient-to-b from-blue-500/10 to-transparent";
        hasMigrationChanges = true;
      }
      if (info.about.portraitAnimationEnabled === undefined) {
        info.about.portraitAnimationEnabled = true;
        hasMigrationChanges = true;
      }
      if (info.about.portraitImage === undefined) {
        info.about.portraitImage = "";
        hasMigrationChanges = true;
      }
      if (hasMigrationChanges) {
        await info.save();
        logger.info(
          "Successfully migrated existing Personal Info record with default portrait values."
        );
      }
    }
    return info;
  }

  /**
   * Update the single PersonalInfo configuration document.
   * If it doesn't exist, create it.
   */
  public async updatePersonalInfo(data: UpdatePersonalInfoInput): Promise<IPersonalInfo> {
    let info = await PersonalInfo.findOne();
    if (!info) {
      logger.info("No personal info document found during update. Creating new document...");
      info = new PersonalInfo(data);
    } else {
      Object.assign(info, data);
    }
    const updated = await info.save();
    logger.info("Personal info configuration updated successfully.");
    return updated;
  }
}

export const personalInfoService = new PersonalInfoService();
