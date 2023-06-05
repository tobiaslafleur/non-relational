import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";
import { ObjectId } from "bson";

const createUserInputSchema = z.object({
  email: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  loyaltyProgram: z.object({
    enrolled: z.boolean(),
    points: z.number().default(0),
  }),
  role: z
    .union([z.literal("CUSTOMER"), z.literal("EMPLOYEE"), z.literal("MANAGER")])
    .default("CUSTOMER"),
  employeeInformation: z
    .object({
      position: z.string().optional(),
      location: z
        .string()
        .transform((id) => new ObjectId(id))
        .optional(),
    })
    .optional(),
  comments: z
    .array(
      z.object({
        author: z.string().transform((id) => new ObjectId(id)),
        comment: z.string(),
      })
    )
    .optional(),
});

const updateUserInputSchema = z.object({
  email: z.string().optional(),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  loyaltyProgram: z
    .object({
      enrolled: z.boolean().optional(),
      points: z.number().optional(),
    })
    .optional(),
  rentals: z.array(z.string()).optional(),
  role: z
    .union([z.literal("CUSTOMER"), z.literal("EMPLOYEE"), z.literal("MANAGER")])
    .optional(),
  employeeInformation: z
    .object({
      position: z.string().optional(),
      location: z.string().optional(),
    })
    .optional(),
  comments: z
    .array(
      z.object({
        author: z.string(),
        comment: z.string(),
      })
    )
    .optional(),
});

const postCommentInputSchema = z.object({
  author: z.string(),
  comment: z.string(),
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;
export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;
export type PostCommentInput = z.infer<typeof postCommentInputSchema>;

export const { schemas: userSchemas, $ref: userRef } = buildJsonSchemas(
  {
    createUserInputSchema,
    updateUserInputSchema,
    postCommentInputSchema,
  },
  {
    $id: "UserSchema",
  }
);
