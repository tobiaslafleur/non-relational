import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

const createVehiceInputSchema = z.object({
  name: z.string(),
  type: z.union([z.literal("SEDAN"), z.literal("SUV"), z.literal("TRUCK")]),
  rentals: z.array(z.string()).default([]),
  location: z.string(),
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
