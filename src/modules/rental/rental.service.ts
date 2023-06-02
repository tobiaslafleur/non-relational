import { vehicleCollection } from "./../../utils/db";
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
        vehicle: new ObjectId(vehicle),
        date: {
          pickup: new Date(date.pickup),
          dropoff: new Date(date.dropoff),
        },
        location: {
          pickup: new ObjectId(location.pickup),
          dropoff: new ObjectId(location.dropoff),
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

    await vehicleCollection.findOneAndUpdate(
      { _id: new ObjectId(input.vehicle) },
      { $push: { rentals: insertedId } },
      {
        session,
      }
    );

    const rental = await rentalCollection.findOne(
      { _id: insertedId },
      { session }
    );

    await session.commitTransaction();

    return rental;
  } catch (error: any) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}
