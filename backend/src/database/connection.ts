import mongoose from "mongoose";
import { config } from "../config/env";
import { logger } from "../utils/logger";

const MAX_RETRIES = 1;
const RETRY_INTERVAL = 1000; // 1 second

class Database {
  private retryCount = 0;

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners() {
    mongoose.connection.on("connected", () => {
      logger.info("Database Connected successfully");
      this.retryCount = 0; // reset on successful connection
    });

    mongoose.connection.on("error", (err) => {
      logger.error("Database connection error", { error: err.message });
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("Database Disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      logger.info("Database Reconnected successfully");
    });
  }

  public async connect(): Promise<void> {
    try {
      if (mongoose.connection.readyState === 1) {
        logger.info("Database already connected");
        return;
      }

      if (config.databaseUrl.includes("<username>")) {
        logger.warn("Database connection skipped due to placeholder URL (Phase 2).");
        return;
      }

      logger.info(`Attempting database connection to ${config.databaseUrl.substring(0, 30)}...`);
      await mongoose.connect(config.databaseUrl, {
        serverSelectionTimeoutMS: 2000,
      });

      // Auto-seed database collections dynamically if they are empty
      try {
        logger.info("Checking database collections to run auto-seed if needed...");
        const { seedDatabase } = await import("./seed");
        await seedDatabase(false);
      } catch (seedErr: any) {
        logger.error("Auto-seeding primary database failed", { error: seedErr.message });
      }
    } catch (error: unknown) {
      this.handleConnectionError(error);
    }
  }

  private handleConnectionError(error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    logger.error("Failed to connect to database", { error: errMessage });

    if (this.retryCount < MAX_RETRIES) {
      this.retryCount++;
      const timeout = RETRY_INTERVAL * Math.pow(2, this.retryCount - 1); // Exponential backoff
      logger.info(
        `Retrying database connection in ${timeout / 1000} seconds... (Attempt ${this.retryCount} of ${MAX_RETRIES})`
      );

      setTimeout(() => {
        this.connect();
      }, timeout);
    } else {
      logger.error("Max database connection retries reached for primary Database URL.");
      logger.info(
        "Automatically falling back to in-memory database for testing and development..."
      );

      import("mongodb-memory-server")
        .then(async ({ MongoMemoryServer }) => {
          try {
            const mongoServer = await MongoMemoryServer.create();
            const uri = mongoServer.getUri();
            logger.info(`Started mongodb-memory-server at ${uri}`);
            config.databaseUrl = uri; // override for current run
            this.retryCount = 0; // reset
            await mongoose.connect(uri);

            // Auto-seed local in-memory DB for smooth development/testing flows
            const { User } = await import("../modules/auth/user.model");
            const { Project } = await import("../modules/project/project.model");
            const { Skill } = await import("../modules/skill/skill.model");
            const { Experience } = await import("../modules/experience/experience.model");
            const { Education } = await import("../modules/education/education.model");
            const { PersonalInfo } = await import("../modules/personal-info/personal-info.model");

            const rawFrontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
            const seededFrontendUrl = rawFrontendUrl.startsWith("http") ? rawFrontendUrl : `https://${rawFrontendUrl}`;

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
                  profileImage: "/hero-avatar.jpg",
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
                  portraitImage: "/aditya.jpg",
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
              await defaultInfo.save();
              logger.info("Auto-seeded default Personal Info record to in-memory database.");
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
              logger.info("Auto-seeded admin user to in-memory database.");
            }

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
                  techStack: [
                    "React",
                    "Next.js",
                    "TypeScript",
                    "Tailwind CSS",
                    "Framer Motion",
                    "GSAP",
                  ],
                  gitHubUrl: "https://github.com/adityasahu/portfolio",
                  liveUrl: seededFrontendUrl,
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
              logger.info("Auto-seeded 3 default projects to in-memory database.");
            }

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
              logger.info("Auto-seeded 8 default skills to in-memory database.");
            }

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
                  responsibilities: [
                    "Explored Python, syntax structures, basic automation scripts.",
                  ],
                  achievements: [
                    "Successfully completed online logic and basic automation assignments.",
                  ],
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
                  responsibilities: [
                    "Mastered pointer safety, memory allocations, standard algorithms.",
                  ],
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
                  responsibilities: [
                    "Architected MVC services, React pages routing, responsive views.",
                  ],
                  achievements: [
                    "Built modern e-commerce storefront dashboards with Express and MongoDB.",
                  ],
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
                  achievements: [
                    "Successfully launched two SaaS web applications using Next.js & Stripe.",
                  ],
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
                  responsibilities: [
                    "Trained deep learning model architectures, integrated transformers.",
                  ],
                  achievements: [
                    "Configured open-source LLM model weights fine-tuning tasks locally.",
                  ],
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
                  achievements: [
                    "Designed cinematic personal portfolios recognized by design boards.",
                  ],
                  technologiesUsed: ["React", "GSAP", "Three.js", "WebGL", "Framer Motion"],
                  displayOrder: 7,
                  featured: true,
                  status: "Active",
                  iconName: "Rocket",
                },
              ];
              await Experience.insertMany(defaultExperiences);
              logger.info("Auto-seeded 7 default experiences to in-memory database.");
            }

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
                    "Pursuing B.Tech in Computer Science with specialization in Artificial Intelligence and Machine Learning.",
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
              logger.info("Auto-seeded 1 default education record to in-memory database.");
            }
          } catch (memError) {
            logger.error("Failed to start fallback in-memory database", { error: memError });
            process.exit(1);
          }
        })
        .catch((err) => {
          logger.error("mongodb-memory-server not installed, exiting...", { error: err });
          process.exit(1);
        });
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await mongoose.connection.close();
      logger.info("Database disconnection complete.");
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "Unknown error";
      logger.error("Error during database disconnection", { error: errMessage });
    }
  }
}

export const dbConnection = new Database();
