import { userSchemas } from "@/modules/user/user.schema";
import { buildDatabase } from "@/utils/db";
import { routeHandler } from "@/utils/routes";
import fastify from "fastify";

export async function buildServer() {
  await buildDatabase();

  const server = fastify({
    logger: false,
  });

  for (const schema of [...userSchemas]) {
    server.addSchema(schema);
  }

  server.register(routeHandler, { prefix: "/api" });

  return server;
}
