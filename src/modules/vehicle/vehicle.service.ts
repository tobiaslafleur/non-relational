import { FindOptions, ObjectId } from "mongodb";
import { vehicleCollection } from "@/utils/db";
import { CreateVehicleInput } from "@/modules/vehicle/vehicle.schema";
import { Vehicle } from "@/types";

export async function createVehicle(input: CreateVehicleInput) {
  input.location = new ObjectId(input.location);

  await vehicleCollection.insertOne(input);
}

export async function getAllVechiles() {
  const vechiles = await vehicleCollection.find().toArray();

  return vechiles;
}

export async function getVehicleById(
  id: string,
  options?: FindOptions<Vehicle>
) {
  const vechile = await vehicleCollection.findOne(
    { _id: new ObjectId(id) },
    options
  );

  return vechile;
}
