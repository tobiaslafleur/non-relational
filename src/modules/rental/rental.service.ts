import { vehicleCollection } from "@/utils/db";
import { ObjectId } from "mongodb";
import { mongoClient, rentalCollection, userCollection } from "@/utils/db";
import { getLocationById } from "@/modules/location/location.service";
import { Rental } from "@/types";
import { getUserById } from "@/modules/user/user.service";
import { getVehicleById } from "@/modules/vehicle/vehicle.service";

export async function createRental(input: Rental) {
  const session = mongoClient.startSession();
  session.startTransaction({
    readPreference: "primary",
    readConcern: { level: "local" },
    writeConcern: { w: "majority" },
  });

  try {
    const _id = new ObjectId();

    const userObj = await getUserById(input.user as any, {
      projection: {
        _id: 1,
        email: 1,
        firstname: 1,
        lastname: 1,
      },
      session,
    });

    const vehicleObj = await getVehicleById(input.vehicle as any, {
      projection: {
        rentals: 0,
        location: 0,
        status: 0,
      },
      session,
    });

    const pickupObj = await getLocationById(input.location.pickup);

    const dropoffObj = await getLocationById(input.location.dropoff);

    if (!userObj || !vehicleObj || !pickupObj || !dropoffObj) {
      throw new Error("User or vehicle not found");
    }

    input._id = _id;
    input.user = userObj;
    input.vehicle = vehicleObj;
    input.location = {
      pickup: pickupObj,
      dropoff: dropoffObj,
    };

    await rentalCollection.insertOne(input, {
      session,
    });

    await session.commitTransaction();
  } catch (error: any) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}
