import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

const createLocationSchema = z.object({
  name: z.string(),
});

export type CreateLocationInput = z.infer<typeof createLocationSchema>;

export const { schemas: locationSchemas, $ref: locationRef } = buildJsonSchemas(
  { createLocationSchema },
  {
    $id: "LocationSchema",
  }
);
