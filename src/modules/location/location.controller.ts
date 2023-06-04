import { CreateLocationInput } from "@/modules/location/location.schema";
import { createLocation } from "@/modules/location/location.service";
import { FastifyRequest, FastifyReply } from "fastify";

export async function createLocationHandler(
  request: FastifyRequest<{ Body: CreateLocationInput }>,
  reply: FastifyReply
) {
  try {
    const input = request.body;

    await createLocation(input);

    reply.status(201).send(input);
  } catch (error) {
    console.log(error);
    reply.status(500).send({ message: "Internal server error" });
  }
}
