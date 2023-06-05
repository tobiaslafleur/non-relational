import { PostCommentInput, UpdateUserInput } from "@/modules/user/user.schema";
import { User } from "@/types";
import { userCollection } from "@/utils/db";
import { FindOptions } from "mongodb";
import { ObjectId } from "mongodb";

export async function createUser(input: User) {
  await userCollection.insertOne(input);
}

export async function getAllUsers() {
  const users = await userCollection.find().toArray();

  return users;
}

export async function getUserById(id: string, options?: FindOptions) {
  const user = await userCollection.findOne({ _id: new ObjectId(id) }, options);

  return user;
}

export async function updateUserById(input: UpdateUserInput, id: string) {
  const { value: user } = await userCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...(input as User),
      },
    },
    { upsert: false, returnDocument: "after" }
  );

  return user;
}

export async function postCommentById(input: PostCommentInput, id: string) {
  const { value: user } = await userCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $push: {
        comments: {
          author: new ObjectId(input.author),
          comment: input.comment,
        },
      },
    },
    { upsert: false, returnDocument: "after" }
  );

  return user;
}
