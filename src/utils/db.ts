import { Location, Rental, User, Vehicle } from "@/types";
import * as dotenv from "dotenv";
dotenv.config();
import { Collection, Filter, MongoClient } from "mongodb";

export const mongoClient = new MongoClient(process.env.MONGO_URI as string);
export const db = mongoClient.db("car-rental");

export const userCollection = db.collection<User>("user", {
  ignoreUndefined: true,
});
export const rentalCollection = db.collection<Rental>("rental", {
  ignoreUndefined: true,
});
export const vehicleCollection = db.collection<Vehicle>("vehicle", {
  ignoreUndefined: true,
});
export const locationCollection = db.collection<Location>("location", {
  ignoreUndefined: true,
});

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

export async function updateOne<T>(
  collection: Collection<T>,
  input: T,
  filter: Filter<T> = {}
) {
  const data = await collection.findOneAndUpdate(
    filter,
    { $set: input },
    {
      upsert: true,
      returnDocument: "after",
    }
  );

  console.log(data);

  return data.value;
}

async function findOne<T>(collection: Collection<T>, filter: Filter<T>) {
  return await collection.find(filter).toArray();
}
