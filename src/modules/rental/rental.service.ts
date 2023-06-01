import { ObjectId } from "mongodb";
import { CreateRentalInput } from "@/modules/rental/rental.schema";
import { mongoClient, rentalCollection, userCollection } from "@/utils/db";

export async function createRental(input: CreateRentalInput) {
  const session = mongoClient.startSession();

  try {
    const { user, vehicle, date, location, ...rest } = input;

    const data = await session.withTransaction(async function () {
      const { insertedId } = await rentalCollection.insertOne(
        {
          user: new ObjectId(user),
          vehicle: vehicle as any,
          date: {
            pickup: new Date(date.pickup),
            dropoff: new Date(date.dropoff),
          },
          location: {
            pickup: location.pickup as any,
            dropoff: location.dropoff as any,
          },
          ...rest,
        },
        {
          session,
        }
      );

      await userCollection.findOneAndUpdate(
        { _id: new ObjectId(input.user) },
        { $push: { rentals: insertedId } },
        {
          session,
        }
      );
    });

    console.log(data);
  } catch (error: any) {
    throw new Error(error);
  } finally {
    session.endSession();
  }
}
