import { CreateVehicleInput } from "@/modules/vehicle/vehicle.schema";
import {
  createVehicle,
  getAllVechiles,
} from "@/modules/vehicle/vehicle.service";
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

export async function getAllVehiclesHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const vehicles = await getAllVechiles();

    reply.status(200).send(vehicles);
  } catch (error: any) {
    reply.status(500).send({ message: "Internal server error" });
  }
}
