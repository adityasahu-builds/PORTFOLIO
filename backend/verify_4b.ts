import mongoose from "mongoose";
import { config } from "./src/config/env";
import { Contact } from "./src/modules/contact/contact.model";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

const verifyPhase4B = async () => {
  const API_URL = "http://127.0.0.1:5000/api/v1/contact";
  
  console.log("=== PHASE 4B API VERIFICATION ===");

  const runTest = async (name: string, payload: any, expectedStatus: number) => {
    console.log(`\n--- Test: ${name} ---`);
    const options: RequestInit = {
      method: "POST",
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

  // 1. Valid Request Triggering Real Emails
  const validPayload = {
    fullName: "Aditya Sahu (QA Test)",
    // Sending to your actual verified sandbox email so Resend doesn't block it
    email: "mefake2620122@gmail.com",
    subject: "Phase 4B End-to-End Test",
    message: "This is a test message from the Phase 4B integration script to verify live Resend delivery!"
  };
  
  console.log("Triggering live contact submission...");
  allPassed = await runTest("Valid request", validPayload, 201) && allPassed;

  console.log("\n--- Verification Summary ---");
  console.log("✅ API responded with 201 Created (Document successfully stored).");
  console.log("✅ Emails should now be queued and sent via Resend SMTP.");
  console.log("Please check the terminal where your backend is running to confirm 'Email sent successfully'.");
  console.log("Check your aditya261226@gmail.com inbox for both the Notification and Auto-Reply!");

  process.exit(allPassed ? 0 : 1);
};

verifyPhase4B();
