import { FastifyInstance } from "fastify";
import { createUserHandler } from "@/modules/user/user.controller";
import { userRef } from "@/modules/user/user.schema";

export async function userHandler(server: FastifyInstance) {
  server.post(
    "/",
    {
      schema: {
        body: userRef("createUserInputSchema"),
      },
    },
    createUserHandler
  );
}
