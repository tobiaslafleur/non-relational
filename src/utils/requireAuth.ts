import { Role } from "@/types";
import { FastifyReply, FastifyRequest } from "fastify";

export async function requireEmployee(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authRole = request.headers.authorization as Role;

  if (authRole !== "EMPLOYEE" && authRole !== "MANAGER") {
    reply.status(401).send({ message: "Unauthorized" });
  }
}

export async function requireManager(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authRole = request.headers.authorization;

  if (authRole !== "MANAGER") {
    reply.status(401).send({ message: "Unauthorized" });
  }
}
