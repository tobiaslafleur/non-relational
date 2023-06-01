import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const createUserInputSchema = z.object({
  email: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  loyaltyProgram: z.object({
    enrolled: z.boolean(),
    points: z.number().default(0),
  }),
  rentals: z.array(z.string()).default([]),
  role: z
    .union([z.literal("CUSTOMER"), z.literal("EMPLOYEE"), z.literal("MANAGER")])
    .default("CUSTOMER"),
  employeeInformation: z
    .object({
      position: z.string(),
      location: z.string(),
    })
    .optional(),
  comments: z.array(z.string()).optional(),
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

export const { schemas: userSchemas, $ref: userRef } = buildJsonSchemas(
  {
    createUserInputSchema,
  },
  {
    $id: "UserSchema",
  }
);
