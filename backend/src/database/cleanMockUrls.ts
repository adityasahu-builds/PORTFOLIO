/**
 * cleanMockUrls.ts
 * ─────────────────────────────────────────────────────
 * Yeh script database mein se saari mock Cloudinary
 * URLs dhundh ke clear karta hai.
 *
 * Mock URL pattern: "res.cloudinary.com/demo" ya "mock_"
 *
 * Run: npx ts-node src/database/cleanMockUrls.ts
 * ─────────────────────────────────────────────────────
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import { dbConnection } from "./connection";
import { Media } from "../modules/media/media.model";
import { Project } from "../modules/project/project.model";
import { PersonalInfo } from "../modules/personal-info/personal-info.model";
import { Experience } from "../modules/experience/experience.model";
import { Certificate } from "../modules/certificate/certificate.model";
import { logger } from "../utils/logger";

dotenv.config();

const MOCK_PATTERN = /res\.cloudinary\.com\/demo|mock_/;

const isMockUrl = (url?: string): boolean => {
  if (!url) return false;
  return MOCK_PATTERN.test(url);
};

const cleanMockUrls = async () => {
  await dbConnection.connect();

  // Wait for connection
  if (mongoose.connection.readyState !== 1) {
    await new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (mongoose.connection.readyState === 1) {
          clearInterval(interval);
          resolve();
        }
      }, 500);
    });
  }

  logger.info("=== Mock URL Cleanup Script Started ===");

  // ─── 1. Media Collection ──────────────────────────────────────────
  const mockMediaDocs = await Media.find({
    $or: [
      { secureUrl: { $regex: /res\.cloudinary\.com\/demo/ } },
      { secureUrl: { $regex: /mock_/ } },
      { publicId: { $regex: /mock_/ } },
    ],
  });

  if (mockMediaDocs.length > 0) {
    const ids = mockMediaDocs.map((d) => d._id);
    await Media.deleteMany({ _id: { $in: ids } });
    logger.info(`[Media] Deleted ${mockMediaDocs.length} mock media document(s).`);
    mockMediaDocs.forEach((d) => logger.info(`  - Removed: ${d.originalName} → ${d.secureUrl}`));
  } else {
    logger.info("[Media] No mock documents found. ✅");
  }

  // ─── 2. Projects Collection ───────────────────────────────────────
  const allProjects = await Project.find({});
  let projectsUpdated = 0;

  for (const project of allProjects) {
    const updates: Record<string, any> = {};

    if (isMockUrl(project.thumbnail)) {
      updates.thumbnail = "";
      logger.info(`[Project] "${project.title}" → thumbnail cleared.`);
    }

    const cleanGallery = project.galleryImages.filter((img) => !isMockUrl(img));
    if (cleanGallery.length !== project.galleryImages.length) {
      updates.galleryImages = cleanGallery;
      logger.info(
        `[Project] "${project.title}" → ${project.galleryImages.length - cleanGallery.length} gallery image(s) cleared.`
      );
    }

    if (Object.keys(updates).length > 0) {
      await Project.findByIdAndUpdate(project._id, { $set: updates });
      projectsUpdated++;
    }
  }

  if (projectsUpdated === 0) {
    logger.info("[Projects] No mock URLs found. ✅");
  } else {
    logger.info(`[Projects] Updated ${projectsUpdated} project(s).`);
  }

  // ─── 3. PersonalInfo Collection ───────────────────────────────────
  const personalInfo = await PersonalInfo.findOne({});
  if (personalInfo) {
    const piUpdates: Record<string, any> = {};

    if (isMockUrl(personalInfo.hero?.profileImage)) {
      piUpdates["hero.profileImage"] = "";
      logger.info("[PersonalInfo] hero.profileImage cleared.");
    }
    if (isMockUrl(personalInfo.hero?.resumeUrl)) {
      piUpdates["hero.resumeUrl"] = "";
      logger.info("[PersonalInfo] hero.resumeUrl cleared.");
    }
    if (isMockUrl(personalInfo.about?.portraitImage)) {
      piUpdates["about.portraitImage"] = "";
      logger.info("[PersonalInfo] about.portraitImage cleared.");
    }
    if (isMockUrl(personalInfo.seo?.ogImage)) {
      piUpdates["seo.ogImage"] = "";
      logger.info("[PersonalInfo] seo.ogImage cleared.");
    }

    if (Object.keys(piUpdates).length > 0) {
      await PersonalInfo.findByIdAndUpdate(personalInfo._id, { $set: piUpdates });
      logger.info(`[PersonalInfo] ${Object.keys(piUpdates).length} field(s) updated.`);
    } else {
      logger.info("[PersonalInfo] No mock URLs found. ✅");
    }
  }

  // ─── 4. Experience Collection ─────────────────────────────────────
  const allExperiences = await Experience.find({});
  let expUpdated = 0;

  for (const exp of allExperiences) {
    if (isMockUrl(exp.companyLogo)) {
      await Experience.findByIdAndUpdate(exp._id, { $set: { companyLogo: "" } });
      logger.info(`[Experience] "${exp.companyName}" → companyLogo cleared.`);
      expUpdated++;
    }
  }

  if (expUpdated === 0) {
    logger.info("[Experience] No mock URLs found. ✅");
  }

  // ─── 5. Certificate Collection ────────────────────────────────────
  const allCerts = await Certificate.find({});
  let certUpdated = 0;

  for (const cert of allCerts) {
    if (isMockUrl(cert.imageUrl)) {
      await Certificate.findByIdAndUpdate(cert._id, { $set: { imageUrl: "" } });
      logger.info(`[Certificate] "${cert.title}" → imageUrl cleared.`);
      certUpdated++;
    }
  }

  if (certUpdated === 0) {
    logger.info("[Certificate] No mock URLs found. ✅");
  }

  logger.info("=== Cleanup Complete! Ab admin panel se real files upload karo. ===");
  process.exit(0);
};

cleanMockUrls().catch((err) => {
  logger.error("Cleanup failed:", { error: err.message });
  process.exit(1);
});
