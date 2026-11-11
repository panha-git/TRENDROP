import { MongoClient } from "mongodb";
import mongoose from "mongoose";

const globalForMongo = globalThis as typeof globalThis & {
  mongoClientPromise?: Promise<MongoClient>;
};

export async function connectToMongoDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "Set the MONGODB_URI environment variable to connect to MongoDB.",
    );
  }

  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(uri, { dbName: process.env.MONGODB_DB ?? "C0" });
  }

  const clientPromise =
    globalForMongo.mongoClientPromise ?? new MongoClient(uri).connect();

  globalForMongo.mongoClientPromise = clientPromise;
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB ?? "C0");
}
