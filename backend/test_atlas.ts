import mongoose from "mongoose";
import { config } from "./src/config/env";
import dns from "dns";

// Try with ipv4first
dns.setDefaultResultOrder("ipv4first");

const test = async () => {
  try {
    console.log("Connecting to:", config.databaseUrl);
    await mongoose.connect(config.databaseUrl, { serverSelectionTimeoutMS: 30000 });
    console.log("SUCCESS!");
    process.exit(0);
  } catch (e) {
    console.error("FAIL:", e);
    process.exit(1);
  }
};
test();
