import { CreateUserInput, UpdateUserInput } from "@/modules/user/user.schema";
import { userCollection } from "@/utils/db";
import { ObjectId } from "mongodb";

export async function createUser(input: CreateUserInput) {
  const { rentals, employeeInformation, ...rest } = input;

  const rentalsAsObjectId = rentals.map(function (rental) {
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

  const res = await userCollection.insertOne({
    rentals: rentalsAsObjectId,
    ...employeeInfo,
    ...rest,
  });

  const user = await userCollection.findOne({ _id: res.insertedId });

  return user;
}

export async function getAllUsers() {
  const users = await userCollection.find().toArray();

  return users;
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
