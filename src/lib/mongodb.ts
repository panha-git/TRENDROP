import { MongoClient } from "mongodb";
import mongoose from "mongoose";

const globalForMongo = globalThis as typeof globalThis & {
  mongoClientPromise?: Promise<MongoClient>;
};

export async function connectToMongoDB() {
  const uri = process.env.MONGODB_URI!;
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB ?? "C0" });

  if (!uri) {
    throw new Error(
      "Set the MONGODB_URI environment variable to connect to MongoDB.",
    );
  }

  const clientPromise =
    globalForMongo.mongoClientPromise ?? new MongoClient(uri).connect();

  if (process.env.NODE_ENV !== "production") {
    globalForMongo.mongoClientPromise = clientPromise;
  }

  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB ?? "C0");
}
