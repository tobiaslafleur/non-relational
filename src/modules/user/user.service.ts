import { User } from "@/types";
import { userCollection } from "@/utils/db";

export async function createUser(input: Omit<User, "_id">) {
  const res = await userCollection.insertOne(input);

  console.log(res);

  const user = await userCollection.findOne({ _id: res.insertedId });

  if (!user) throw new Error("Could not find user");

  return user;
}

export async function getAllUsers() {
  const users = await userCollection.find().toArray();

  return users;
}
