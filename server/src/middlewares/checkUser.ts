import type { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";
import Services from "../services";
import type { Request } from "../types";
import { UnauthorizedError } from "../utils/errorHandler";
import { Jwt } from "../utils/jwt";

function getUser(fastify: FastifyInstance, _: unknown, done: () => void) {
	fastify.decorateRequest("user", undefined);
	fastify.addHook("preHandler", checkRequestJwt);
	done();
}

export async function checkRequestJwt(request: Request) {
	const authorization = request.headers.authorization;

	const token = authorization?.split(" ")[1];

	if (!token) {
		throw new UnauthorizedError("Access denied Jwt is required");
	}

	try {
		const jwt = token;
		const payload = Jwt.verifyToken(`${jwt}`);
		const user = await Services.users.getByID(payload.id);

		if (!user) {
			throw new UnauthorizedError("Access denied");
		}

		request.user = user;
	} catch (error) {
		throw new UnauthorizedError(error as string);
	}
}

export const checkUser = fastifyPlugin(getUser);
