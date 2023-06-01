import { CreateUserInput } from "@/modules/user/user.schema";
import { createUser, getAllUsers } from "@/modules/user/user.service";
import { FastifyReply, FastifyRequest } from "fastify";
import { MongoError } from "mongodb";

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
  request: FastifyRequest<{ Body: { user: string } }>,
  reply: FastifyReply
) {
  try {
    const users = await getAllUsers();

    reply.status(200).send(users);
  } catch (error: any) {
    reply.status(500).send({ message: "Internal server error" });
  }
}
