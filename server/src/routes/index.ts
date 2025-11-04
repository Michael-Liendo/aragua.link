import type { FastifyInstance, RegisterOptions } from "fastify";
import type { ErrorWithDetails } from "../utils/errorHandler";
import admin from "./admin";
import auth from "./auth";
import user from "./user";

export default function routes(
	fastify: FastifyInstance,
	_: RegisterOptions,
	done: () => void,
) {
	fastify.setErrorHandler((error: ErrorWithDetails, _, reply) => {
		if (error.statusCode >= 400 && error.statusCode < 500) {
			fastify.log.info(error);
			return reply.status(error.statusCode || 400).send({
				success: false,
				error: error.name || "BAD_REQUEST",
				message: error.statusCode === 400 ? "Validation error" : error.message,
				errors:
					error.statusCode === 400
						? [
								{
									code: error.details?.code ?? error.name,
									path: error.details?.path ?? "root",
									message: error.details?.message ?? error.message,
								},
							]
						: undefined,
			});
		}
		fastify.log.error(error);
		console.error(error);
		return reply.code(500).send({
			error: "INTERNAL_SERVER_ERROR",
			message: error.message,
			// todo: check if this is the right send the stack
			details: error.stack,
			success: false,
		});
	});

	fastify.get("/", async () => {
		return { hello: "world" };
	});

	fastify.register(auth, { prefix: "/auth" });
	fastify.register(user, { prefix: "/users" });
	fastify.register(admin, { prefix: "/admin" });

	done();
}
