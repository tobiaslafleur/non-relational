import { rentalSchemas } from "@/modules/rental/rental.schema";
import { userSchemas } from "@/modules/user/user.schema";
import { Role } from "@/types";
import { buildDatabase } from "@/utils/db";
import { routeHandler } from "@/utils/routes";
import fastify, { FastifyReply, FastifyRequest } from "fastify";

declare module "fastify" {
  export interface FastifyInstance {
    requireManager: any;
    requireEmployee: any;
  }
}

export async function buildServer() {
  await buildDatabase();

  const server = fastify({
    logger: false,
  });

  server.decorate(
    "requireManager",
    async function (request: FastifyRequest, reply: FastifyReply) {
      const authRole = request.headers.authorization as Role;

      if (authRole !== "MANAGER") {
        reply.status(401).send({ message: "Unauthorized" });
      }
    }
  );

  server.decorate(
    "requireEmployee",
    async function (request: FastifyRequest, reply: FastifyReply) {
      const authRole = request.headers.authorization as Role;

      if (authRole !== "EMPLOYEE" && authRole !== "MANAGER") {
        reply.status(401).send({ message: "Unauthorized" });
      }
    }
  );

  for (const schema of [...userSchemas, ...rentalSchemas]) {
    server.addSchema(schema);
  }

  server.register(routeHandler, { prefix: "/api" });

  return server;
}
