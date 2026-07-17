import { dbConnection } from "./connection";
import { User } from "../modules/auth/user.model";
import { Project } from "../modules/project/project.model";
import { Skill } from "../modules/skill/skill.model";
import { Experience } from "../modules/experience/experience.model";
import { Education } from "../modules/education/education.model";
import { PersonalInfo } from "../modules/personal-info/personal-info.model";
import { logger } from "../utils/logger";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to database
    await dbConnection.connect();

    // Wait until mongoose is connected (handles fallback async connection time)
    if (mongoose.connection.readyState !== 1) {
      logger.info("Waiting for database connection to be established...");
      await new Promise<void>((resolve) => {
        const interval = setInterval(() => {
          if (mongoose.connection.readyState === 1) {
            clearInterval(interval);
            resolve();
          }
        }, 500);
      });
    }

    // 0. Seed Personal Info
    const personalInfoCount = await PersonalInfo.countDocuments();
    if (personalInfoCount === 0) {
      const defaultInfo = new PersonalInfo({
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
          portfolio: "http://localhost:3000",
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
      await defaultInfo.save();
      logger.info("Successfully seeded default Personal Info record.");
    } else {
      logger.info("Personal Info record already exists. Personal Info seeding skipped.");
    }

    // 1. Seed Admin User
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount === 0) {
      const username = process.env.ADMIN_USERNAME || "admin";
      const email = process.env.ADMIN_EMAIL || "admin@adityasahu.dev";
      const password = process.env.ADMIN_PASSWORD || "AdminSecurePass123!";

      const adminUser = new User({
        username,
        email,
        password,
        role: "admin",
      });

      await adminUser.save();

      logger.info("--------------------------------------------------");
      logger.info("ADMIN USER SEEDED SUCCESSFULLY!");
      logger.info(`Username: ${username}`);
      logger.info(`Email:    ${email}`);
      logger.info(`Password: ${password} (change this on first login)`);
      logger.info("--------------------------------------------------");
    } else {
      logger.info("Admin user already exists. User seeding skipped.");
    }

    // 2. Seed Default Projects
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      const defaultProjects = [
        {
          title: "Portfolio Website",
          slug: "portfolio-website",
          category: "Personal Brand & Showcase",
          description:
            "A premium, Awwwards-inspired personal portfolio designed to showcase projects with immersive 3D effects, glassmorphism, and smooth GSAP animations.",
          longDescription:
            "A highly responsive React + Next.js developer portfolio engineered using advanced WebGL 3D canvas and dynamic GSAP scroll triggers for rich interactivity.",
          techStack: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "GSAP"],
          gitHubUrl: "https://github.com/adityasahu/portfolio",
          liveUrl: "http://localhost:3000",
          thumbnail: "",
          galleryImages: [],
          featured: true,
          displayOrder: 1,
          status: "Currently Building",
          number: "01",
          problemStatement:
            "Traditional portfolios often feel static and fail to capture the user's attention or demonstrate advanced frontend capabilities.",
          solution:
            "Developed a highly interactive, cinematic experience using React, Framer Motion, and GSAP to create a memorable first impression.",
          keyFeatures: [
            "Cinematic GSAP Scroll Animations",
            "Interactive 3D Elements",
            "Custom Cursor & Magnetic Buttons",
            "Dynamic Theming & Neon Glows",
          ],
          accentColor: "#00d2ff",
          mockupType: "portfolio",
        },
        {
          title: "Restaurant Platform",
          slug: "restaurant-platform",
          category: "E-Commerce & Hospitality",
          description:
            "A modern digital storefront for a premium restaurant featuring online ordering, dynamic menus, and reservation management.",
          longDescription:
            "Full stack ordering platform featuring shopping carts, administrative dashboard inventory control, and real-time dashboard analytics.",
          techStack: ["React", "Node.js", "Express", "MongoDB", "Redux", "Stripe"],
          gitHubUrl: "https://github.com/adityasahu/restaurant",
          liveUrl: "https://github.com/adityasahu/restaurant",
          thumbnail: "",
          galleryImages: [],
          featured: true,
          displayOrder: 2,
          status: "Coming Soon",
          number: "02",
          problemStatement:
            "Restaurants struggle with clunky third-party ordering systems that dilute their brand and charge high commission fees.",
          solution:
            "Building a bespoke, highly performant platform that keeps customers engaged while streamlining kitchen operations.",
          keyFeatures: [
            "Real-time Order Tracking",
            "Interactive Menu with 3D Models",
            "Seamless Payment Integration",
            "Admin Dashboard for Analytics",
          ],
          accentColor: "#C8A96E",
          mockupType: "restaurant",
        },
        {
          title: "School Management System",
          slug: "school-management",
          category: "EdTech & Administration",
          description:
            "A comprehensive school portal designed to connect students, teachers, and parents with real-time academic tracking and resource sharing.",
          longDescription:
            "Centralized administrative school panel with role-based auth, secure parents reports portal, and attendance logs.",
          techStack: ["Next.js", "PostgreSQL", "Prisma", "TypeScript", "Tailwind CSS"],
          gitHubUrl: "https://github.com/adityasahu/school",
          liveUrl: "https://github.com/adityasahu/school",
          thumbnail: "",
          galleryImages: [],
          featured: true,
          displayOrder: 3,
          status: "Planning",
          number: "03",
          problemStatement:
            "Educational institutions often rely on fragmented software, leading to communication gaps and inefficient data management.",
          solution:
            "Architecting a centralized hub that unifies attendance, grades, and announcements into a single, intuitive interface.",
          keyFeatures: [
            "Role-based Access Control",
            "Live Attendance Tracking",
            "Secure Parent Portal",
            "Automated Grade Reports",
          ],
          accentColor: "#A78BFA",
          mockupType: "school",
        },
      ];

      await Project.insertMany(defaultProjects);
      logger.info("Successfully seeded 3 default projects into database.");
    } else {
      logger.info("Projects already exist. Projects seeding skipped.");
    }

    // 3. Seed Default Skills
    const skillCount = await Skill.countDocuments();
    if (skillCount === 0) {
      const defaultSkills = [
        {
          title: "Python",
          slug: "python",
          category: "Programming",
          skillLevel: 90,
          experience: 4,
          description: "Automation · AI backends · scripting",
          featured: true,
          displayOrder: 1,
          status: "Active",
          x: "8%",
          y: "15%",
          connections: ["gsap", "gemini-api"],
        },
        {
          title: "React",
          slug: "react",
          category: "Frontend",
          skillLevel: 95,
          experience: 3,
          description: "Component architecture · state management",
          featured: true,
          displayOrder: 2,
          status: "Active",
          x: "55%",
          y: "8%",
          connections: ["gsap", "threejs"],
        },
        {
          title: "TypeScript",
          slug: "typescript",
          category: "Frontend",
          skillLevel: 90,
          experience: 3,
          description: "Type-safe application development",
          featured: true,
          displayOrder: 3,
          status: "Active",
          x: "80%",
          y: "22%",
          connections: ["threejs"],
        },
        {
          title: "GSAP",
          slug: "gsap",
          category: "Tools",
          skillLevel: 85,
          experience: 2,
          description: "Professional-grade web animation",
          featured: true,
          displayOrder: 4,
          status: "Active",
          x: "22%",
          y: "45%",
          connections: ["python", "react"],
        },
        {
          title: "Three.js",
          slug: "threejs",
          category: "Frontend",
          skillLevel: 80,
          experience: 2,
          description: "3D graphics · WebGL environments",
          featured: true,
          displayOrder: 5,
          status: "Active",
          x: "68%",
          y: "52%",
          connections: ["react", "typescript", "nodejs"],
        },
        {
          title: "Gemini API",
          slug: "gemini-api",
          category: "AI/ML",
          skillLevel: 85,
          experience: 1,
          description: "LLM integration · AI pipelines",
          featured: true,
          displayOrder: 6,
          status: "Active",
          x: "40%",
          y: "68%",
          connections: ["python", "android"],
        },
        {
          title: "Android",
          slug: "android",
          category: "Programming",
          skillLevel: 85,
          experience: 3,
          description: "System-level APK development",
          featured: true,
          displayOrder: 7,
          status: "Active",
          x: "10%",
          y: "75%",
          connections: ["gemini-api"],
        },
        {
          title: "Node.js",
          slug: "nodejs",
          category: "Backend",
          skillLevel: 90,
          experience: 3,
          description: "Server-side runtime · APIs",
          featured: true,
          displayOrder: 8,
          status: "Active",
          x: "78%",
          y: "80%",
          connections: ["threejs"],
        },
      ];

      await Skill.insertMany(defaultSkills);
      logger.info("Successfully seeded 8 default skills into database.");
    } else {
      logger.info("Skills already exist. Skills seeding skipped.");
    }

    // 4. Seed Default Experiences
    const experienceCount = await Experience.countDocuments();
    if (experienceCount === 0) {
      const defaultExperiences = [
        {
          companyName: "Self-Learning",
          role: "Started Programming",
          employmentType: "Full-time",
          location: "Remote",
          startDate: new Date("2018-01-01"),
          endDate: new Date("2019-01-01"),
          currentlyWorking: false,
          description: "First lines of code.",
          responsibilities: ["Explored Python, syntax structures, basic automation scripts."],
          achievements: ["Successfully completed online logic and basic automation assignments."],
          technologiesUsed: ["Python", "Algorithms"],
          displayOrder: 1,
          featured: true,
          status: "Active",
          iconName: "TerminalSquare",
        },
        {
          companyName: "Foundations",
          role: "Learned C & C++",
          employmentType: "Full-time",
          location: "Remote",
          startDate: new Date("2019-01-01"),
          endDate: new Date("2020-06-01"),
          currentlyWorking: false,
          description: "Data structures & algorithms.",
          responsibilities: ["Mastered pointer safety, memory allocations, standard algorithms."],
          achievements: [
            "Coded data structures library containing trees, lists, sorting structures.",
          ],
          technologiesUsed: ["C", "C++", "Data Structures"],
          displayOrder: 2,
          featured: true,
          status: "Active",
          iconName: "Code2",
        },
        {
          companyName: "University CSE",
          role: "Entered CSE (AI & ML)",
          employmentType: "Full-time",
          location: "Campus",
          startDate: new Date("2020-08-01"),
          endDate: new Date("2024-06-01"),
          currentlyWorking: false,
          description: "Began formal education.",
          responsibilities: [
            "Enrolled in computer science engineering focusing on deep architectures.",
          ],
          achievements: [
            "Maintained top academic tier grades in advanced machine learning courses.",
          ],
          technologiesUsed: ["Python", "TensorFlow", "Math"],
          displayOrder: 3,
          featured: true,
          status: "Active",
          iconName: "Cpu",
        },
        {
          companyName: "Web Architectures",
          role: "Full Stack Development",
          employmentType: "Full-time",
          location: "Hybrid",
          startDate: new Date("2022-01-01"),
          endDate: new Date("2023-01-01"),
          currentlyWorking: false,
          description: "Built web applications.",
          responsibilities: ["Architected MVC services, React pages routing, responsive views."],
          achievements: ["Built modern e-commerce storefront dashboards with Express and MongoDB."],
          technologiesUsed: ["React", "Express", "Node.js", "MongoDB"],
          displayOrder: 4,
          featured: true,
          status: "Active",
          iconName: "Globe",
        },
        {
          companyName: "Indie Hacking",
          role: "Built Web Projects",
          employmentType: "Full-time",
          location: "Remote",
          startDate: new Date("2023-01-01"),
          endDate: new Date("2024-01-01"),
          currentlyWorking: false,
          description: "Real-world solutions.",
          responsibilities: [
            "Built full-featured dynamic products for customers and agency clients.",
          ],
          achievements: ["Successfully launched two SaaS web applications using Next.js & Stripe."],
          technologiesUsed: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL"],
          displayOrder: 5,
          featured: true,
          status: "Active",
          iconName: "MonitorPlay",
        },
        {
          companyName: "AI Research",
          role: "Learning AI & ML",
          employmentType: "Full-time",
          location: "Remote",
          startDate: new Date("2024-01-01"),
          endDate: new Date("2025-01-01"),
          currentlyWorking: false,
          description: "Neural networks & LLMs.",
          responsibilities: ["Trained deep learning model architectures, integrated transformers."],
          achievements: ["Configured open-source LLM model weights fine-tuning tasks locally."],
          technologiesUsed: ["Python", "PyTorch", "Transformers", "Gemini API"],
          displayOrder: 6,
          featured: true,
          status: "Active",
          iconName: "BrainCircuit",
        },
        {
          companyName: "Next-Gen Agency",
          role: "Modern Digital Products",
          employmentType: "Full-time",
          location: "Remote",
          startDate: new Date("2025-01-01"),
          currentlyWorking: true,
          description: "Award-winning experiences.",
          responsibilities: [
            "Creating immersive animations, WebGL contexts, rich performance layers.",
          ],
          achievements: ["Designed cinematic personal portfolios recognized by design boards."],
          technologiesUsed: ["React", "GSAP", "Three.js", "WebGL", "Framer Motion"],
          displayOrder: 7,
          featured: true,
          status: "Active",
          iconName: "Rocket",
        },
      ];

      await Experience.insertMany(defaultExperiences);
      logger.info("Successfully seeded 7 default experiences into database.");
    } else {
      logger.info("Experiences already exist. Experience seeding skipped.");
    }

    // 5. Seed Default Education
    const educationCount = await Education.countDocuments();
    if (educationCount === 0) {
      const defaultEducations = [
        {
          institutionName: "Maharana Pratap Engineering College (MPGI)",
          degree: "Bachelor of Technology",
          fieldOfStudy: "Computer Science Engineering (AI & ML)",
          location: "Mandsaur, Madhya Pradesh, India",
          startDate: new Date("2021-08-01"),
          currentlyStudying: true,
          grade: "7.8 CGPA",
          description:
            "Pursuing B.Tech in Computer Science with specialization in Artificial Intelligence and Machine Learning. Focused on building scalable web applications and exploring AI/ML research.",
          achievements: [
            "Top performer in Advanced Web Development course",
            "Led college technical fest web development team",
            "Active member of IEEE student chapter",
          ],
          institutionWebsite: "https://www.mpgi.edu.in",
          displayOrder: 1,
          featured: true,
          status: "Active",
        },
      ];

      await Education.insertMany(defaultEducations);
      logger.info("Successfully seeded 1 default education record into database.");
    } else {
      logger.info("Education records already exist. Education seeding skipped.");
    }

    process.exit(0);
  } catch (error: any) {
    logger.error("Seeding database failed:", { error: error.message });
    process.exit(1);
  }
};

seedDatabase();
