import {
  CreateUserInput,
  PostCommentInput,
  UpdateUserInput,
} from "@/modules/user/user.schema";
import {
  createUser,
  getAllUsers,
  updateUserById,
  postCommentById,
  getUserById,
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

    await createUser(input);

    reply.status(201).send(input);
  } catch (error: any) {
    if (error instanceof MongoError && error.code === 11000) {
      reply.status(400).send({ message: "Email already in use" });
    }
    console.log(error);
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

export async function getUserByIdHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const users = await getUserById(request.params.id);

    reply.status(200).send(users);
  } catch (error: any) {
    reply.status(500).send({ message: "Internal server error" });
  }
}

export async function updateUserByIdHandler(
  request: FastifyRequest<{ Body: UpdateUserInput; Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const input = request.body;

    const user = await updateUserById(input, request.params.id);

    reply.status(200).send(user);
  } catch (error: any) {
    if (error instanceof BSONError) {
      reply.status(400).send({ message: "Not a valid ObjectId" });
    }

    reply.status(500).send({ message: "Internal server error" });
  }
}

export async function postCommentHandler(
  request: FastifyRequest<{ Body: PostCommentInput; Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const input = request.body;

    const user = await postCommentById(input, request.params.id);

    reply.status(200).send(user);
  } catch (error: any) {
    reply.status(500).send({ message: "Internal server error" });
  }
}
