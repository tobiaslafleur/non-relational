import { FastifyInstance } from "fastify";
import {
  createUserHandler,
  getAllUsersHandler,
} from "@/modules/user/user.controller";
import { userRef } from "@/modules/user/user.schema";

export async function userHandler(server: FastifyInstance) {
  server.post(
    "/",
    {
      schema: {
        body: userRef("createUserInputSchema"),
      },
      preHandler: [server.requireEmployee],
    },
    createUserHandler
  );

  server.get("/", { preHandler: [server.requireManager] }, getAllUsersHandler);
}
