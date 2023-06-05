import {
  createRentalHandler,
  getAllRentalsHandler,
  getCurrentRentalsHandler,
  updateRentalByIdHandler,
} from "@/modules/rental/rental.controller";
import { rentalRef } from "@/modules/rental/rental.schema";
import { FastifyInstance } from "fastify";

export async function rentalHandler(server: FastifyInstance) {
  server.post(
    "/",
    {
      schema: {
        body: rentalRef("createRentalInputSchema"),
      },
      preHandler: [server.requireEmployee],
    },
    createRentalHandler
  );

  server.get(
    "/",
    { preHandler: [server.requireEmployee] },
    getAllRentalsHandler
  );

  server.put(
    "/:id",
    {
      schema: { body: rentalRef("updateRentalInputSchema") },
      preHandler: [server.requireEmployee],
    },
    updateRentalByIdHandler
  );

  server.get(
    "/current",
    { preHandler: [server.requireEmployee] },
    getCurrentRentalsHandler
  );
}
