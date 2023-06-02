import { FastifyInstance } from "fastify";
import { userHandler } from "@/modules/user/user.route";
import { rentalHandler } from "@/modules/rental/rental.route";
import { vehicleHandler } from "@/modules/vehicle/vehicle.route";
import { locationHandler } from "@/modules/location/location.route";

export async function routeHandler(server: FastifyInstance) {
  server.register(userHandler, {
    prefix: "/user",
  });

  server.register(rentalHandler, {
    prefix: "/rental",
  });

  server.register(vehicleHandler, { prefix: "/vehicle" });

  server.register(locationHandler, { prefix: "/location" });
}
