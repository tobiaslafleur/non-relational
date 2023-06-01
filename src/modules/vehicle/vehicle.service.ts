import { ObjectId } from "mongodb";
import { vehicleCollection } from "@/utils/db";
import { CreateVehicleInput } from "@/modules/vehicle/vehicle.schema";

export async function createVehicle(input: CreateVehicleInput) {
  const { location, rentals, ...rest } = input;

  const rentalsAsObjectId = rentals.map(function (rental) {
    return new ObjectId(rental);
  });

  const { insertedId } = await vehicleCollection.insertOne({
    location: location as any,
    rentals: rentalsAsObjectId,
    ...rest,
  });

  const vehicle = await vehicleCollection.findOne({ _id: insertedId });

  return vehicle;
}
