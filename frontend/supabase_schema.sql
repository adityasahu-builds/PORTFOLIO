-- ============================================================================
-- SUPABASE POSTGRESQL SCHEMA FOR ADITYA SAHU PORTFOLIO & CMS
-- Run this in your Supabase Dashboard -> SQL Editor (Click 'New query' -> 'Run')
-- ============================================================================

-- 1. Users Table (Admin authentication)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    "refreshToken" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    "shortDescription" TEXT,
    "longDescription" TEXT,
    "techStack" TEXT[] DEFAULT '{}',
    technologies TEXT[] DEFAULT '{}',
    "gitHubUrl" TEXT,
    "githubUrl" TEXT,
    "liveUrl" TEXT,
    thumbnail TEXT,
    image TEXT,
    "galleryImages" TEXT[] DEFAULT '{}',
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    category TEXT NOT NULL DEFAULT 'General',
    "displayOrder" INT NOT NULL DEFAULT 0,
    "order" INT NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Completed',
    number TEXT,
    "problemStatement" TEXT,
    solution TEXT,
    "keyFeatures" TEXT[] DEFAULT '{}',
    "accentColor" TEXT,
    "mockupType" TEXT DEFAULT 'portfolio',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Skills Table
CREATE TABLE IF NOT EXISTS skills (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    icon TEXT,
    "iconName" TEXT,
    "imageUrl" TEXT,
    "skillLevel" INT NOT NULL DEFAULT 80,
    experience INT NOT NULL DEFAULT 1,
    description TEXT,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    "displayOrder" INT NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Active',
    x TEXT NOT NULL DEFAULT '50%',
    y TEXT NOT NULL DEFAULT '50%',
    connections TEXT[] DEFAULT '{}',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Experiences Table
CREATE TABLE IF NOT EXISTS experiences (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "companyName" TEXT NOT NULL,
    role TEXT NOT NULL,
    "employmentType" TEXT NOT NULL DEFAULT 'Full-time',
    location TEXT,
    "startDate" TIMESTAMPTZ NOT NULL,
    "endDate" TIMESTAMPTZ,
    "currentlyWorking" BOOLEAN NOT NULL DEFAULT FALSE,
    "companyLogo" TEXT,
    "companyWebsite" TEXT,
    description TEXT,
    responsibilities TEXT[] DEFAULT '{}',
    achievements TEXT[] DEFAULT '{}',
    "technologiesUsed" TEXT[] DEFAULT '{}',
    "displayOrder" INT NOT NULL DEFAULT 0,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'Active',
    "iconName" TEXT NOT NULL DEFAULT 'Briefcase',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Educations Table
CREATE TABLE IF NOT EXISTS educations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "institutionName" TEXT NOT NULL,
    degree TEXT NOT NULL,
    "fieldOfStudy" TEXT NOT NULL,
    location TEXT,
    "startDate" TIMESTAMPTZ NOT NULL,
    "endDate" TIMESTAMPTZ,
    "currentlyStudying" BOOLEAN NOT NULL DEFAULT FALSE,
    grade TEXT,
    description TEXT,
    achievements TEXT[] DEFAULT '{}',
    "institutionLogo" TEXT,
    "institutionWebsite" TEXT,
    "displayOrder" INT NOT NULL DEFAULT 0,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Certificates Table
CREATE TABLE IF NOT EXISTS certificates (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    "issueDate" TEXT NOT NULL,
    "expiryDate" TEXT DEFAULT '',
    "doesNotExpire" BOOLEAN NOT NULL DEFAULT FALSE,
    "credentialId" TEXT DEFAULT '',
    "credentialUrl" TEXT DEFAULT '',
    "imageUrl" TEXT DEFAULT '',
    skills TEXT[] DEFAULT '{}',
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    "displayOrder" INT NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Personal Info Table
CREATE TABLE IF NOT EXISTS personal_info (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    hero JSONB NOT NULL DEFAULT '{}'::jsonb,
    about JSONB NOT NULL DEFAULT '{}'::jsonb,
    contact JSONB NOT NULL DEFAULT '{}'::jsonb,
    "socialLinks" JSONB NOT NULL DEFAULT '{}'::jsonb,
    seo JSONB NOT NULL DEFAULT '{}'::jsonb,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Contacts Table
CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "fullName" TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Visitor Sessions Table
CREATE TABLE IF NOT EXISTS visitor_sessions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "sessionId" TEXT UNIQUE NOT NULL,
    "ipHash" TEXT NOT NULL DEFAULT '',
    country TEXT NOT NULL DEFAULT 'Unknown',
    city TEXT NOT NULL DEFAULT 'Unknown',
    "deviceType" TEXT NOT NULL DEFAULT 'Unknown',
    browser TEXT NOT NULL DEFAULT 'Unknown',
    os TEXT NOT NULL DEFAULT 'Unknown',
    "screenSize" TEXT NOT NULL DEFAULT 'Unknown',
    "referralSource" TEXT NOT NULL DEFAULT 'Direct',
    "landingPage" TEXT NOT NULL DEFAULT '/',
    "visitTime" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "lastActiveTime" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "sessionDuration" INT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Analytics Events Table
CREATE TABLE IF NOT EXISTS analytics_events (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "sessionId" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "pagePath" TEXT NOT NULL DEFAULT '/',
    details JSONB,
    "timestamp" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Media Table
CREATE TABLE IF NOT EXISTS media (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "originalName" TEXT NOT NULL,
    "publicId" TEXT UNIQUE NOT NULL,
    "secureUrl" TEXT NOT NULL,
    width INT,
    height INT,
    size INT NOT NULL,
    "mimeType" TEXT NOT NULL,
    folder TEXT NOT NULL DEFAULT 'portfolio',
    tags TEXT[] DEFAULT '{}',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_projects_order ON projects ("displayOrder" ASC, "createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_skills_order ON skills ("displayOrder" ASC, "createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_experiences_order ON experiences ("displayOrder" ASC, "startDate" DESC);
CREATE INDEX IF NOT EXISTS idx_educations_order ON educations ("displayOrder" ASC, "startDate" DESC);
CREATE INDEX IF NOT EXISTS idx_certificates_order ON certificates ("displayOrder" ASC, "createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_created ON contacts ("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_sessions ON visitor_sessions ("visitTime" DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events ON analytics_events ("timestamp" DESC, "eventName");
