import { CreateUserInput, UpdateUserInput } from "@/modules/user/user.schema";
import {
  createUser,
  getAllUsers,
  updateUserById,
} from "@/modules/user/user.service";
import { FastifyReply, FastifyRequest } from "fastify";
import { MongoError } from "mongodb";
import { BSONError } from "bson";

export async function createUserHandler(
  request: FastifyRequest<{ Body: CreateUserInput }>,
  reply: FastifyReply
) {
  try {
    const input = request.body;

    const user = await createUser(input);

    reply.status(201).send(user);
  } catch (error: any) {
    if (error instanceof MongoError && error.code === 11000) {
      reply.status(400).send({ message: "Email already in use" });
    }
    reply.status(500).send({ message: "Internal server error" });
  }
}

export async function getAllUsersHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const users = await getAllUsers();

    reply.status(200).send(users);
  } catch (error: any) {
    reply.status(500).send({ message: "Internal server error" });
  }
}

export async function updateUserByIdHandler(
  request: FastifyRequest<{ Body: UpdateUserInput; Params: { id: string } }>,
  reply: FastifyReply
) {
  const input = request.body;

  try {
    const user = await updateUserById(input, request.params.id);

    if (!user) return reply.status(400).send({ message: "No user found" });

    reply.status(200).send(user);
  } catch (error: any) {
    if (error instanceof BSONError) {
      reply.status(400).send({ message: "Not a valid ObjectId" });
    }

    reply.status(500).send({ message: "Internal server error" });
  }
}
