import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

const createRentalInputSchema = z.object({
  user: z.string(),
  vehicle: z.string(),
  condition: z
    .object({
      before: z.string(),
      after: z.string(),
    })
    .optional(),
  miles: z
    .object({
      before: z.number(),
      after: z.number(),
    })
    .optional(),
  payment: z.object({
    method: z.union([z.literal("MONEY"), z.literal("POINTS")]).default("MONEY"),
    amount: z.number(),
    pointsGenerated: z.number(),
  }),
  location: z.object({
    pickup: z.string(),
    dropoff: z.string(),
  }),
  date: z.object({
    pickup: z.date(),
    dropoff: z.date(),
  }),
});

export type CreateRentalInput = z.infer<typeof createRentalInputSchema>;

export const { schemas: rentalSchemas, $ref: rentalRef } = buildJsonSchemas(
  { createRentalInputSchema },
  {
    $id: "RentalSchema",
  }
);
