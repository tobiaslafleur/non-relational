import { FindOptions, ObjectId } from "mongodb";
import { locationCollection, updateOne } from "@/utils/db";
import { CreateLocationInput } from "@/modules/location/location.schema";

export async function createLocation(input: CreateLocationInput) {
  await locationCollection.insertOne(input);
}

export async function getLocationById(
  id: string,
  options?: FindOptions<Location>
) {
  const location = await locationCollection.findOne(
    { _id: new ObjectId(id) },
    options
  );

  if (!location) {
    throw new Error("No location found");
  }

  return location;
}
