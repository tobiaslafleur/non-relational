import { createLocationHandler } from "@/modules/location/location.controller";
import { locationRef } from "@/modules/location/location.schema";
import { FastifyInstance } from "fastify";

export async function locationHandler(server: FastifyInstance) {
  server.post(
    "/",
    {
      schema: { body: locationRef("createLocationSchema") },
      preHandler: [server.requireManager],
    },
    createLocationHandler
  );
}
