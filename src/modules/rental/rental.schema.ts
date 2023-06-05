import { ObjectId } from "mongodb";
import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

const createRentalInputSchema = z.object({
  user: z.string().transform((id) => new ObjectId(id)),
  vehicle: z.string().transform((id) => new ObjectId(id)),
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
    pickup: z.string().transform((id) => new ObjectId(id)),
    dropoff: z.string().transform((id) => new ObjectId(id)),
  }),
  date: z.object({
    pickup: z.date().transform((date) => new Date(date)),
    dropoff: z.date().transform((date) => new Date(date)),
  }),
});

export type CreateRentalInput = z.infer<typeof createRentalInputSchema>;

export const { schemas: rentalSchemas, $ref: rentalRef } = buildJsonSchemas(
  { createRentalInputSchema },
  {
    $id: "RentalSchema",
  }
);
