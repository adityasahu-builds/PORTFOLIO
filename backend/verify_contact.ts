import mongoose from "mongoose";
import app from "./src/app";
import { dbConnection } from "./src/database/connection";
import { Contact } from "./src/modules/contact/contact.model";
import { config } from "./src/config/env";
import { MongoMemoryServer } from "mongodb-memory-server";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

const verify = async () => {
  let mongoServer: MongoMemoryServer | null = null;
  try {
    // 1. Connect to Database (MongoMemoryServer directly for reliable test environment)
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    config.databaseUrl = mongoUri;

    await dbConnection.connect();
    console.log("✅ Database connected successfully to in-memory server.");

    // 2. Start server on a test port
    const server = app.listen(5001, async () => {
      console.log("Server started for verification on port 5001.");

      // 3. Send a real POST request
      const payload = {
        fullName: "Aditya Sahu",
        email: "aditya@example.com",
        subject: "Portfolio Test",
        message: "This is a test message from the backend verification."
      };

      console.log("\n--- Sending POST request to /api/v1/contact ---");
      try {
        const res = await fetch("http://127.0.0.1:5001/api/v1/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const json = await res.json();
        
        // Requirement 1 & 2
        console.log("\n1. HTTP Status:", res.status);
        console.log("2. Complete JSON Response:", JSON.stringify(json, null, 2));

        // 3. Verify in MongoDB
        console.log("\n--- Verifying Document in MongoDB ---");
        const docs = await Contact.find({ email: "aditya@example.com" });
        if (docs.length > 0) {
          console.log("3. Verification: Document successfully found in MongoDB.");
          // 4. Print ID
          console.log("4. Inserted Document ID:", docs[0]._id.toString());
        } else {
          console.log("3. Verification: Document NOT found in MongoDB!");
        }

        // 5. Confirm DB and Collection
        console.log("5. Database Name:", mongoose.connection.db?.databaseName);
        console.log("   Collection Name:", Contact.collection.collectionName);

        console.log("\nVerification Complete.");
        
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
    console.error("Verification failed:", error);
    if (mongoServer) await mongoServer.stop();
    process.exit(1);
  }
};

verify();

