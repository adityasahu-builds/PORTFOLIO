import mongoose from "mongoose";
import { config } from "./src/config/env";
import { Contact } from "./src/modules/contact/contact.model";

const verifyPhase3B = async () => {
  const API_URL = "http://127.0.0.1:5001/api/v1/contact";
  
  console.log("=== PHASE 3B API VERIFICATION ===");
  
  // Connect to DB directly to verify insertions
  await mongoose.connect(config.databaseUrl);
  console.log(`Connected to MongoDB: ${mongoose.connection.db?.databaseName}`);

  const runTest = async (name: string, payload: any, method = "POST", expectedStatus: number) => {
    console.log(`\n--- Test: ${name} ---`);
    const options: RequestInit = {
      method,
      headers: { "Content-Type": "application/json" }
    };
    if (payload) options.body = JSON.stringify(payload);
    
    const res = await fetch(API_URL, options);
    const json = await res.json().catch(() => null);
    
    console.log(`Status: ${res.status} (Expected: ${expectedStatus})`);
    console.log(`Response:`, JSON.stringify(json));
    
    if (res.status !== expectedStatus) {
      console.error(`❌ FAILED: Expected ${expectedStatus} but got ${res.status}`);
      return false;
    }
    console.log("✅ PASSED");
    return true;
  };

  let allPassed = true;

  // 1. Empty body
  allPassed = await runTest("Empty body", {}, "POST", 422) && allPassed;

  // 2. Missing field (e.g. subject)
  allPassed = await runTest("Missing field", {
    fullName: "Test User",
    email: "test@example.com",
    message: "Valid message content."
  }, "POST", 422) && allPassed;

  // 3. Invalid email
  allPassed = await runTest("Invalid email", {
    fullName: "Test User",
    email: "not-an-email",
    subject: "Hello",
    message: "Valid message content."
  }, "POST", 422) && allPassed;

  // 4. Oversized payload
  allPassed = await runTest("Oversized payload", {
    fullName: "A".repeat(150), // Schema says max 100
    email: "test@example.com",
    subject: "Hello",
    message: "Valid message content."
  }, "POST", 422) && allPassed;

  // 5. Wrong HTTP method
  console.log(`\n--- Test: Wrong HTTP method (GET) ---`);
  const getRes = await fetch(API_URL, { method: "GET" });
  if (getRes.status === 404) {
    console.log("Status: 404 (Expected: 404)");
    console.log("✅ PASSED");
  } else {
    console.error(`❌ FAILED: Expected 404 but got ${getRes.status}`);
    allPassed = false;
  }

  // 6. Valid Request
  const validPayload = {
    fullName: "Aditya Sahu",
    email: "aditya@example.com",
    subject: "Portfolio Test",
    message: "This is a test message from the backend verification."
  };
  allPassed = await runTest("Valid request", validPayload, "POST", 201) && allPassed;

  // 7. Verify MongoDB Insertion
  console.log("\n--- Verifying MongoDB Insertion ---");
  const docs = await Contact.find({ email: "aditya@example.com" }).sort({ createdAt: -1 }).limit(1);
  if (docs.length > 0) {
    console.log("✅ PASSED: Document found in MongoDB!");
    console.log("Document Data:", {
      id: docs[0]._id.toString(),
      fullName: docs[0].fullName,
      email: docs[0].email,
      subject: docs[0].subject,
      message: docs[0].message,
      createdAt: docs[0].createdAt,
      updatedAt: docs[0].updatedAt
    });
  } else {
    console.error("❌ FAILED: Document not found in MongoDB!");
    allPassed = false;
  }

  await mongoose.disconnect();
  process.exit(allPassed ? 0 : 1);
};

verifyPhase3B();
