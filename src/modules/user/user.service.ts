import { User } from "@/types";
import { userCollection } from "@/utils/db";

export async function createUser(input: User) {
  const { email } = input;

  const { insertedId } = await userCollection.insertOne(input);

  const user = await userCollection.findOne({ _id: insertedId });

  if (!user) throw new Error("Could not find user");

  return user;
}
