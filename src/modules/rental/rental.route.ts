import { createRentalHandler } from "@/modules/rental/rental.controller";
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
}
