import { User } from "@/types";
import * as dotenv from "dotenv";
dotenv.config();
import { MongoClient } from "mongodb";

export const mongoClient = new MongoClient(process.env.MONGO_URI as string);
export const db = mongoClient.db("car-rental");

export const userCollection = db.collection<User>("user");

export async function buildDatabase() {
  try {
    await createIndexes();

    await mongoClient.connect();
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.log("Unable to connect to MongoDB");
    console.error(error);
    process.exit(1);
  }
}

async function createIndexes() {
  await userCollection.createIndex({ email: 1 }, { unique: true });
}
