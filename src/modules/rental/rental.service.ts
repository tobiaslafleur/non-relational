import { ObjectId } from "mongodb";
import { CreateRentalInput } from "@/modules/rental/rental.schema";
import { mongoClient, rentalCollection, userCollection } from "@/utils/db";

export async function createRental(input: CreateRentalInput) {
  const session = mongoClient.startSession();
  session.startTransaction({
    readPreference: "primary",
    readConcern: { level: "local" },
    writeConcern: { w: "majority" },
  });

  try {
    const { user, vehicle, date, location, ...rest } = input;

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

    await session.commitTransaction();

    const rental = await rentalCollection.findOne({ _id: insertedId });

    return rental;
  } catch (error: any) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}
