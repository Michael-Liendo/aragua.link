import { UserForUpdateSchema } from "@aragualink/shared";
import type { FastifyInstance, RegisterOptions } from "fastify";
import {
	deleteUser,
	getByEmail,
	getOne,
	me,
	update,
} from "../controllers/users";
import { checkUser } from "../middlewares/checkUser";
import requestValidation from "../utils/requestValidation";

export default function user(
	fastify: FastifyInstance,
	_: RegisterOptions,
	done: () => void,
) {
	fastify.register(checkUser);

	fastify.route({
		method: "GET",
		url: "/me",
		handler: me,
	});

	fastify.route({
		method: "GET",
		url: "/by-email",
		handler: getByEmail,
	});

	fastify.route({
		method: "PUT",
		url: "/update",
		preValidation: requestValidation(UserForUpdateSchema),
		handler: update,
	});

	fastify.route({
		method: "DELETE",
		url: "/delete",
		handler: deleteUser,
	});

	fastify.route({
		method: "GET",
		url: "/:id",
		handler: getOne,
	});

	done();
}
