import { FastifyInstance } from "fastify";
import {
  createUserHandler,
  getAllUsersHandler,
} from "@/modules/user/user.controller";
import { userRef } from "@/modules/user/user.schema";
import { requireManager } from "@/utils/requireAuth";

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

  server.get("/", { preHandler: [requireManager] }, getAllUsersHandler);
}
