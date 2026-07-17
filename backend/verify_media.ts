import mongoose from "mongoose";
import app from "./src/app";
import { dbConnection } from "./src/database/connection";
import { Media } from "./src/modules/media/media.model";
import { User } from "./src/modules/auth/user.model";
import jwt from "jsonwebtoken";
import { config } from "./src/config/env";
import dns from "dns";
import { MongoMemoryServer } from "mongodb-memory-server";

dns.setDefaultResultOrder("ipv4first");

const verifyMedia = async () => {
  console.log("=== MEDIA MANAGER INTEGRATION VERIFICATION ===");
  let mongoServer: MongoMemoryServer | null = null;

  try {
    // 1. Connect to Database (MongoMemoryServer directly for reliable test environment)
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    config.databaseUrl = mongoUri;

    await dbConnection.connect();
    console.log("✅ Database connected successfully to in-memory server.");

    // 2. Start express server on port 5001
    const server = app.listen(5001, async () => {
      console.log("Server started for verification on port 5001.\n");

      try {
        // Create test admin & token
        await User.deleteMany({ email: "test_media_verifier@example.com" });
        const testUser = await User.create({
          username: "media_verifier",
          email: "test_media_verifier@example.com",
          password: "password123",
          role: "admin",
          refreshToken: "temp-refresh-token",
        }) as any;

        const token = jwt.sign(
          { id: testUser._id.toString(), email: testUser.email, role: testUser.role },
          config.jwtSecret,
          { expiresIn: "15m" }
        );

        // Test 1: Unauthenticated Upload (Should return 401)
        console.log("--- Test 1: Attempting unauthenticated upload (POST) ---");
        const uploadUnauthRes = await fetch("http://127.0.0.1:5001/api/v1/media/upload", {
          method: "POST",
        });
        console.log("HTTP Status (Expected: 401):", uploadUnauthRes.status);
        if (uploadUnauthRes.status !== 401) {
          throw new Error("❌ Unauthenticated upload did not return 401.");
        }
        console.log("✅ Unauthenticated upload block verified successfully.\n");

        // Test 2: Authenticated Upload (Should return 201)
        console.log("--- Test 2: Sending authenticated upload payload (POST) ---");
        // Create a dummy multipart body
        const boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW";
        const bodyParts = [
          `--${boundary}\r\n`,
          `Content-Disposition: form-data; name="file"; filename="test_image.png"\r\n`,
          `Content-Type: image/png\r\n\r\n`,
          `fake-binary-content-data`,
          `\r\n--${boundary}\r\n`,
          `Content-Disposition: form-data; name="tags"\r\n\r\n`,
          `test,verify\r\n`,
          `--${boundary}--\r\n`
        ].join("");

        const uploadRes = await fetch("http://127.0.0.1:5001/api/v1/media/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": `multipart/form-data; boundary=${boundary}`,
          },
          body: bodyParts,
        });

        console.log("HTTP Status (Expected: 201):", uploadRes.status);
        const uploadJson = await uploadRes.json();
        console.log("Upload Response Payload:", JSON.stringify(uploadJson));

        if (uploadRes.status !== 201 || !uploadJson?.data?._id) {
          throw new Error("❌ Authenticated upload failed.");
        }
        const createdMediaId = uploadJson.data._id;
        const secureUrl = uploadJson.data.secureUrl;
        console.log(`✅ Authenticated upload verified successfully (ID: ${createdMediaId}, URL: ${secureUrl}).\n`);

        // Test 3: Fetch Media Listing (GET /api/v1/media)
        console.log("--- Test 3: Fetching media library list (GET) ---");
        const listRes = await fetch("http://127.0.0.1:5001/api/v1/media");
        console.log("HTTP Status:", listRes.status);
        const listJson = await listRes.json();
        console.log("List total items found:", listJson?.data?.total);

        if (listRes.status !== 200 || listJson?.data?.media?.length === 0) {
          throw new Error("❌ Media listing did not return uploaded asset.");
        }
        console.log("✅ Media listing verified successfully.\n");

        // Test 4: Fetch Media Details by ID (GET /api/v1/media/:id)
        console.log(`--- Test 4: Fetching single asset details (GET /:id) ---`);
        const detailsRes = await fetch(`http://127.0.0.1:5001/api/v1/media/${createdMediaId}`);
        console.log("HTTP Status:", detailsRes.status);
        const detailsJson = await detailsRes.json();
        console.log("Asset secureUrl:", detailsJson?.data?.secureUrl);

        if (detailsRes.status !== 200 || detailsJson?.data?.originalName !== "test_image.png") {
          throw new Error("❌ Failed to retrieve correct media details.");
        }
        console.log("✅ Single asset fetch verified successfully.\n");

        // Test 5: Authenticated Delete Media (DELETE /api/v1/media/:id)
        console.log(`--- Test 5: Deleting asset (DELETE /:id) ---`);
        const deleteRes = await fetch(`http://127.0.0.1:5001/api/v1/media/${createdMediaId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("HTTP Status (Expected: 200):", deleteRes.status);
        
        if (deleteRes.status !== 200) {
          throw new Error("❌ Failed to delete media asset.");
        }
        console.log("✅ Authenticated deletion verified successfully.\n");

        // Test 6: Verify deletion persistence in DB
        console.log("--- Test 6: Checking media database cleanup ---");
        const searchDoc = await Media.findById(createdMediaId);
        console.log("Asset found in database:", searchDoc ? "Yes" : "No");

        if (searchDoc) {
          throw new Error("❌ Document still persists in MongoDB after deletion.");
        }
        console.log("✅ Deletion database persistence verified successfully.\n");

        // Clean up verifier user
        await User.deleteMany({ email: "test_media_verifier@example.com" });
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

verifyMedia();
