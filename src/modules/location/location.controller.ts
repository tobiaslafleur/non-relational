import { CreateLocationInput } from "@/modules/location/location.schema";
import { createLocation } from "@/modules/location/location.service";
import { FastifyRequest, FastifyReply } from "fastify";

export async function createLocationHandler(
  request: FastifyRequest<{ Body: CreateLocationInput }>,
  reply: FastifyReply
) {
  try {
    const input = request.body;

    const location = await createLocation(input);

    reply.status(201).send(location);
  } catch (error) {
    reply.status(500).send({ message: "Internal server error" });
  }
}
