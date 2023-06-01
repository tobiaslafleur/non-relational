import { CreateRentalInput } from "@/modules/rental/rental.schema";
import { createRental } from "@/modules/rental/rental.service";
import { FastifyRequest, FastifyReply } from "fastify";

export async function createRentalHandler(
  request: FastifyRequest<{ Body: CreateRentalInput }>,
  reply: FastifyReply
) {
  try {
    const input = request.body;

    const rental = await createRental(input);

    reply.status(201).send(rental);
  } catch (error: any) {
    reply.status(500).send({ message: "Internal server error" });
  }
}
