import { CreateUserInput } from "@/modules/user/user.schema";
import { createUser } from "@/modules/user/user.service";
import { FastifyReply, FastifyRequest } from "fastify";

export async function createUserHandler(
  request: FastifyRequest<{ Body: CreateUserInput }>,
  reply: FastifyReply
) {
  try {
    const input = request.body;

    const user = await createUser(input);

    reply.status(201).send(user);
  } catch (error) {
    reply.status(500).send({ message: "Something went wrong" });
  }
}
