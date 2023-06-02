import { FastifyInstance } from "fastify";
import {
  createUserHandler,
  getAllUsersHandler,
  updateUserByIdHandler,
  postCommentHandler,
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

  server.put(
    "/:id",
    {
      schema: {
        body: userRef("updateUserInputSchema"),
      },
      preHandler: [server.requireManager],
    },
    updateUserByIdHandler
  );

  server.post(
    "/:id/comment",
    {
      schema: {
        body: userRef("postCommentInputSchema"),
      },
      preHandler: [server.requireManager],
    },
    postCommentHandler
  );
}
