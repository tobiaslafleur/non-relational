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

const updateRentalInputSchema = z.object({
  condition: z
    .object({
      before: z.string().optional(),
      after: z.string().optional(),
    })
    .optional(),
  miles: z
    .object({
      before: z.number().optional(),
      after: z.number().optional(),
    })
    .optional(),
  location: z
    .object({
      id: z.string(),
      vehicle: z.string(),
    })
    .optional(),
});

export type CreateRentalInput = z.infer<typeof createRentalInputSchema>;
export type UpdateRentalInput = z.infer<typeof updateRentalInputSchema>;

export const { schemas: rentalSchemas, $ref: rentalRef } = buildJsonSchemas(
  { createRentalInputSchema, updateRentalInputSchema },
  {
    $id: "RentalSchema",
  }
);
