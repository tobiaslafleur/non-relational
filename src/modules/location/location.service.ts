import { locationCollection } from "@/utils/db";
import { CreateLocationInput } from "@/modules/location/location.schema";

export async function createLocation(input: CreateLocationInput) {
  const { insertedId } = await locationCollection.insertOne(input);

  const location = await locationCollection.findOne({ _id: insertedId });

  return location;
}
