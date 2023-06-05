import { ObjectId } from "mongodb";
import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

const createVehiceInputSchema = z.object({
  name: z.string(),
  type: z.union([z.literal("SEDAN"), z.literal("SUV"), z.literal("TRUCK")]),
  location: z.string().transform((id) => new ObjectId(id)),
  status: z
    .union([z.literal("AVAILABLE"), z.literal("UNAVAILABLE")])
    .default("AVAILABLE"),
});

export type CreateVehicleInput = z.infer<typeof createVehiceInputSchema>;

export const { schemas: vehicleSchemas, $ref: vehicleRef } = buildJsonSchemas(
  { createVehiceInputSchema },
  {
    $id: "VehicleSchema",
  }
);
