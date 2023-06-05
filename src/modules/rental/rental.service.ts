import { ObjectId } from "mongodb";
import {
  mongoClient,
  rentalCollection,
  userCollection,
  vehicleCollection,
} from "@/utils/db";
import { getLocationById } from "@/modules/location/location.service";
import { Rental } from "@/types";
import { getUserById } from "@/modules/user/user.service";
import { getVehicleById } from "@/modules/vehicle/vehicle.service";
import { UpdateRentalInput } from "@/modules/rental/rental.schema";

export async function createRental(input: Rental) {
  const session = mongoClient.startSession();
  session.startTransaction({
    readPreference: "primary",
    readConcern: { level: "local" },
    writeConcern: { w: "majority" },
  });

  try {
    const _id = new ObjectId();

    const user = await getUserById(input.user as any);

    if (!user) {
      throw new Error("User not found");
    }

    if (input.payment.method === "MONEY") {
      if (user.loyaltyProgram.enrolled) {
        await userCollection.findOneAndUpdate(
          {
            _id: new ObjectId(input.user as any),
          },
          {
            $inc: {
              "loyaltyProgram.points": input.payment.pointsGenerated,
            },
          },
          {
            session,
          }
        );
      }
    } else {
      if (input.payment.amount > user.loyaltyProgram.points) {
        throw new Error("Insufficent funds");
      }

      await userCollection.findOneAndUpdate(
        {
          _id: new ObjectId(input.user as any),
        },
        {
          $inc: {
            "loyaltyProgram.points": -input.payment.pointsGenerated,
          },
        },
        {
          session,
        }
      );
    }

    const vehicle = await getVehicleById(input.vehicle as any, {
      projection: {
        rentals: 0,
        location: 0,
        status: 0,
      },
      session,
    });

    const pickup = await getLocationById(input.location.pickup);

    const dropoff = await getLocationById(input.location.dropoff);

    if (!vehicle || !pickup || !dropoff) {
      throw new Error("User or location not found");
    }

    input._id = _id;
    input.user = user;
    input.vehicle = vehicle;
    input.location = {
      pickup: pickup,
      dropoff: dropoff,
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

export async function getAllRentals() {
  const vehicles = await rentalCollection.find().toArray();

  return vehicles;
}

export async function updateRentalById(input: UpdateRentalInput, id: string) {
  const { location, ...rest } = input;

  const { value: rental } = await rentalCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...(rest as Rental),
      },
    },
    { upsert: false, returnDocument: "after" }
  );

  if (!location) {
    return rental;
  }

  await vehicleCollection.updateOne(
    { _id: new ObjectId(location.vehicle) },
    { $set: { location: new ObjectId(location.id) } }
  );

  return rental;
}
