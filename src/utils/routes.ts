import { FastifyInstance } from "fastify";
import { userHandler } from "@/modules/user/user.route";
import { rentalHandler } from "@/modules/rental/rental.route";

export async function routeHandler(server: FastifyInstance) {
  server.register(userHandler, {
    prefix: "/user",
  });
  server.register(rentalHandler, {
    prefix: "/rental",
  });
}
