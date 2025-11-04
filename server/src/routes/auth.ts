import { UserForLoginSchema, UserForRegisterSchema } from "@aragualink/shared";
import type { FastifyInstance, RegisterOptions } from "fastify";
import { login, register } from "../controllers/auth";
import requestValidation from "../utils/requestValidation";

export default function auth(
	fastify: FastifyInstance,
	_: RegisterOptions,
	done: () => void,
) {
	fastify.route({
		method: "POST",
		url: "/register",
		preValidation: requestValidation(UserForRegisterSchema),
		handler: register,
	});

	fastify.route({
		method: "POST",
		url: "/login",
		preValidation: requestValidation(UserForLoginSchema),
		handler: login,
	});

	done();
}
