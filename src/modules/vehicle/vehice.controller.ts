import { CreateVehicleInput } from "@/modules/vehicle/vehicle.schema";
import {
  createVehicle,
  getAllVechiles,
  getVehicleById,
} from "@/modules/vehicle/vehicle.service";
import { FastifyReply, FastifyRequest } from "fastify";

export async function createVehicleHandler(
  request: FastifyRequest<{ Body: CreateVehicleInput }>,
  reply: FastifyReply
) {
  try {
    const input = request.body;

    await createVehicle(input);

    reply.status(201).send(input);
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

export async function getVehicleByIdHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const id = request.params.id;

    const vehicle = await getVehicleById(id);

    if (!vehicle) {
      reply.status(404).send({ message: "No vehicle found" });
    }

    reply.status(200).send(vehicle);
  } catch (error: any) {
    reply.status(500).send({ message: "Internal server error" });
  }
}
