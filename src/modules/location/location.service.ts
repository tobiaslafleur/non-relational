import { FindOptions, ObjectId } from "mongodb";
import { locationCollection } from "@/utils/db";
import { CreateLocationInput } from "@/modules/location/location.schema";
import { Location } from "@/types";

export async function createLocation(input: CreateLocationInput) {
  await locationCollection.insertOne(input);
}

export async function getLocationById(
  id: string | ObjectId | Location,
  options?: FindOptions<Location>
) {
  if (typeof id === "string") {
    id = new ObjectId(id);
  }

  if (id instanceof ObjectId) {
    const location = await locationCollection.findOne({ _id: id }, options);

    if (!location) {
      throw new Error("No location found");
    }

    return location;
  }

  return id;
}
