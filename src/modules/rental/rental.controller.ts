import { BSONError } from "bson";
import { CreateRentalInput } from "@/modules/rental/rental.schema";
import { createRental, getAllRentals } from "@/modules/rental/rental.service";
import { FastifyRequest, FastifyReply } from "fastify";

export async function createRentalHandler(
  request: FastifyRequest<{ Body: CreateRentalInput }>,
  reply: FastifyReply
) {
  try {
    const input = request.body;

    await createRental(input);

    reply.status(201).send(input);
  } catch (error: any) {
    if (error instanceof BSONError) {
      reply.status(400).send({ message: "Not a valid ObjectId" });
    }
    reply.status(500).send({ message: "Internal server error" });
  }
}

export async function getAllRentalsHandler(
  request: FastifyRequest<{ Body: CreateRentalInput }>,
  reply: FastifyReply
) {
  try {
    const vehicles = await getAllRentals();

    reply.status(201).send(vehicles);
  } catch (error: any) {
    reply.status(500).send({ message: "Internal server error" });
  }
}
