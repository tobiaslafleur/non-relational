import { createUser } from "@/modules/user/user.service";
import { FastifyReply, FastifyRequest } from "fastify";

export async function createUserHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { email } = request.body as { email: string };

    const user = await createUser({ email });

    reply.status(201).send(user);
  } catch (error) {
    reply.status(500).send({ message: "Something went wrong" });
  }
}
