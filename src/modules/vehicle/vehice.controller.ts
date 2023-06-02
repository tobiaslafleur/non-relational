import { CreateVehicleInput } from "@/modules/vehicle/vehicle.schema";
import { createVehicle } from "@/modules/vehicle/vehicle.service";
import { FastifyReply, FastifyRequest } from "fastify";

export async function createVehicleHandler(
  request: FastifyRequest<{ Body: CreateVehicleInput }>,
  reply: FastifyReply
) {
  try {
    const input = request.body;

    const vehicle = await createVehicle(input);

    reply.status(201).send(vehicle);
  } catch (error: any) {
    reply.status(500).send({ message: "Internal server error" });
  }
}
