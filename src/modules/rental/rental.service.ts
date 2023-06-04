import { vehicleCollection } from "@/utils/db";
import { ObjectId } from "mongodb";
import { CreateRentalInput } from "@/modules/rental/rental.schema";
import { mongoClient, rentalCollection, userCollection } from "@/utils/db";
import { getLocationById } from "@/modules/location/location.service";

export async function createRental(input: CreateRentalInput) {
  const session = mongoClient.startSession();
  session.startTransaction({
    readPreference: "primary",
    readConcern: { level: "local" },
    writeConcern: { w: "majority" },
  });

  try {
    const { user, vehicle, date, location, ...rest } = input;

    let _id = new ObjectId();

    const userObj = await userCollection.findOneAndUpdate(
      { _id: new ObjectId(input.user) },
      { $push: { rentals: _id } },
      {
        projection: {
          _id: 1,
          email: 1,
          firstname: 1,
          lastname: 1,
        },
        session,
        returnDocument: "after",
      }
    );

    const vehicleObj = await vehicleCollection.findOneAndUpdate(
      { _id: new ObjectId(input.vehicle) },
      { $push: { rentals: _id } },
      {
        projection: {
          rentals: 0,
          location: 0,
          status: 0,
        },
        session,
        returnDocument: "after",
      }
    );

    if (!userObj.value || !vehicleObj.value) {
      throw new Error("User or vehicle not found");
    }

    await rentalCollection.insertOne(
      {
        _id,
        user: userObj.value,
        vehicle: vehicleObj.value,
        date: {
          pickup: new Date(date.pickup),
          dropoff: new Date(date.dropoff),
        },
        location: {
          pickup: await getLocationById(location.pickup),
          dropoff: await getLocationById(location.dropoff),
        },
        ...rest,
      },
      {
        session,
      }
    );

    const rental = await rentalCollection.findOne({ _id }, { session });

    await session.commitTransaction();

    return rental;
  } catch (error: any) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}
