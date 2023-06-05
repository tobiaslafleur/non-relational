import { BSONError, ObjectId } from "bson";
import {
  CreateRentalInput,
  UpdateRentalInput,
} from "@/modules/rental/rental.schema";
import {
  createRental,
  getAllRentals,
  getCurrentRentals,
  updateRentalById,
} from "@/modules/rental/rental.service";
import { FastifyRequest, FastifyReply } from "fastify";
import { Filter, FindOptions } from "mongodb";
import { Rental } from "@/types";

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
  request: FastifyRequest<{
    Body: CreateRentalInput;
    Querystring: {
      type: "date" | "location" | "user";
      start?: string;
      end?: string;
      id?: string;
    };
  }>,
  reply: FastifyReply
) {
  try {
    const { type, start, end, id } = request.query;

    let options: Filter<Rental> = {};

    switch (type) {
      case "user":
        if (!id) {
          throw new Error("Invalid querystring");
        }

        options = { "user._id": new ObjectId(id) };
        break;
      case "location":
        if (!id) {
          throw new Error("Invalid querystring");
        }

        options = {
          $or: [
            { "location.pickup._id": new ObjectId(id) },
            { "location.dropoff._id": new ObjectId(id) },
          ],
        };
        break;
      case "date":
        if (!start || !end) {
          throw new Error("Invalid querystring");
        }

        options = {
          $and: [
            { "date.pickup": { $gte: new Date(start).toISOString() } },
            { "date.dropoff": { $lte: new Date(end).toISOString() } },
          ],
        };
        break;
    }

    const vehicles = await getAllRentals(options);

    reply.status(201).send(vehicles);
  } catch (error: any) {
    reply.status(500).send({ message: "Internal server error" });
  }
}

export async function updateRentalByIdHandler(
  request: FastifyRequest<{ Params: { id: string }; Body: UpdateRentalInput }>,
  reply: FastifyReply
) {
  try {
    const id = request.params.id;
    const input = request.body;

    const rental = await updateRentalById(input, id);

    reply.status(200).send(rental);
  } catch (error: any) {
    reply.status(500).send({ message: "Internal server error" });
  }
}

export async function getCurrentRentalsHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const rentals = await getCurrentRentals();

    reply.status(200).send(rentals);
  } catch (error: any) {
    reply.status(500).send({ message: "Internal server error" });
  }
}
