import { ObjectId } from "mongodb";
import { vehicleCollection } from "@/utils/db";
import { CreateVehicleInput } from "@/modules/vehicle/vehicle.schema";

export async function createVehicle(input: CreateVehicleInput) {
  const { location, rentals, ...rest } = input;

  const rentalsAsObjectId = rentals.map(function (rental) {
    return new ObjectId(rental);
  });

  const { insertedId } = await vehicleCollection.insertOne({
    location: new ObjectId(location),
    rentals: rentalsAsObjectId,
    ...rest,
  });

  const vehicle = await vehicleCollection.findOne({ _id: insertedId });

  return vehicle;
}

export async function getAllVechiles() {
  const vechiles = await vehicleCollection.find().toArray();

  return vechiles;
}
