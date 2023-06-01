import { FastifyInstance } from "fastify";
import { createUserHandler } from "@/modules/user/user.controller";

export async function userHandler(server: FastifyInstance) {
  server.post("/", {}, createUserHandler);
}
