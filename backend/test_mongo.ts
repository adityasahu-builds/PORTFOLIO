import mongoose from 'mongoose';
import { config } from './src/config/env';

mongoose.connect(config.databaseUrl)
  .then(async () => {
    console.log("Connected to MongoDB successfully via standard URI!");
    const collections = await mongoose.connection.db!.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
    process.exit(0);
  })
  .catch((err) => {
    console.error("Failed to connect:", err);
    process.exit(1);
  });
