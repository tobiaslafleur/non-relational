import {
  CreateUserInput,
  PostCommentInput,
  UpdateUserInput,
} from "@/modules/user/user.schema";
import { userCollection } from "@/utils/db";
import { ObjectId } from "mongodb";

export async function createUser(input: CreateUserInput) {
  const { rentals, employeeInformation, comments, ...rest } = input;

  const rentalsAsObjectId = rentals?.map(function (rental) {
    return new ObjectId(rental);
  });

  const employeeInfo = {
    employeeInformation: employeeInformation
      ? {
          location: employeeInformation?.location
            ? new ObjectId(employeeInformation?.location)
            : undefined,
          position: employeeInformation?.position
            ? employeeInformation?.position
            : undefined,
        }
      : undefined,
  };

  const commentsAsObjectId = comments?.map(function (comment) {
    return {
      author: new ObjectId(comment.author),
      comment: comment.comment,
    };
  });

  const res = await userCollection.insertOne({
    rentals: rentalsAsObjectId,
    ...employeeInfo,
    ...commentsAsObjectId,
    ...rest,
  });

  const user = await userCollection.findOne({ _id: res.insertedId });

  return user;
}

export async function getAllUsers() {
  const users = await userCollection.find().toArray();

  return users;
}

export async function getUserById(id: string) {
  const user = await userCollection.findOne({ _id: new ObjectId(id) });

  return user;
}

export async function updateUserById(input: UpdateUserInput, id: string) {
  const { value: user } = await userCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...(input as any),
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
