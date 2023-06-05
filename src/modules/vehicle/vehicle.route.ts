import {
  createVehicleHandler,
  getAllVehiclesHandler,
  getVehicleByIdHandler,
} from "@/modules/vehicle/vehice.controller";
import { vehicleRef } from "@/modules/vehicle/vehicle.schema";
import { FastifyInstance } from "fastify";

export async function vehicleHandler(server: FastifyInstance) {
  server.post(
    "/",
    {
      schema: {
        body: vehicleRef("createVehiceInputSchema"),
      },
      preHandler: [server.requireEmployee],
    },
    createVehicleHandler
  );

  server.get("/", getAllVehiclesHandler);

  server.get("/:id", getVehicleByIdHandler);
}
