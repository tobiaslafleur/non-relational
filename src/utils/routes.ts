import { FastifyInstance } from "fastify";
import { userHandler } from "@/modules/user/user.route";

export async function routeHandler(server: FastifyInstance) {
  server.register(userHandler, {
    prefix: "/user",
  });
}
