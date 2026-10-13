import mongoose from "mongoose";
import { env } from "./env.js";

/**
 * Connects to MONGODB_URI. If nothing is listening there (the common case
 * on a fresh checkout with no local MongoDB installed), transparently falls
 * back to an ephemeral in-memory MongoDB for local development so the app
 * runs with zero setup. Data in the fallback does not persist across
 * restarts — set MONGODB_URI to a real local or Atlas instance to persist.
 */
export async function connectDb(): Promise<void> {
  try {
    await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 2000 });
    console.log(`MongoDB connected: ${env.mongoUri}`);
    return;
  } catch (error) {
    console.warn(`Could not reach MongoDB at ${env.mongoUri}. Falling back to an in-memory MongoDB for local dev.`);
    console.warn("Set MONGODB_URI in server/.env to use a real (persistent) database.");
  }

  const { MongoMemoryServer } = await import("mongodb-memory-server");
  const memoryServer = await MongoMemoryServer.create();
  const uri = memoryServer.getUri();
  await mongoose.connect(uri);
  console.log(`MongoDB connected (ephemeral in-memory instance): ${uri}`);

  process.on("SIGINT", async () => {
    await memoryServer.stop();
    process.exit(0);
  });
}
