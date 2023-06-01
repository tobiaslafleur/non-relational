import { CreateUserInput, UpdateUserInput } from "@/modules/user/user.schema";
import { userCollection } from "@/utils/db";
import { ObjectId } from "mongodb";

export async function createUser(input: CreateUserInput) {
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

export async function updateUserById(input: UpdateUserInput, id: string) {
  const _id = new ObjectId(id);

  const { value: user } = await userCollection.findOneAndUpdate(
    { _id },
    {
      $set: {
        ...(input as any),
      },
    },
    { upsert: false, returnDocument: "after" }
  );

  return user;
}
