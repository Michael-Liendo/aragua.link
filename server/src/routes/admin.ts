import { validateMasterName } from "@aragualink/shared";
import type { FastifyInstance, RegisterOptions } from "fastify";
import { create, findAll, findOne, remove, update } from "../controllers/admin";
import { checkAdmin } from "../middlewares/checkAdmin";
import type { Reply, Request } from "../types";

export default function admin(
	fastify: FastifyInstance,
	_: RegisterOptions,
	done: () => void,
) {
	fastify.register(checkAdmin);

	fastify.addHook("preHandler", async (req: Request, res: Reply) => {
		const { master_name } = req.params as { master_name: string };
		if (!validateMasterName(master_name)) {
			return res.status(400).send({
				success: false,
				error: "NOT_FOUND_MASTER_NAME",
				message: "Invalid master_name",
			});
		}
	});

	fastify.route({
		method: "GET",
		url: "/findAll/:master_name",
		handler: findAll,
	});

	fastify.route({
		method: "GET",
		url: "/findOne/:master_name/:master_id",
		handler: findOne,
	});

	fastify.route({
		method: "POST",
		url: "/create/:master_name",
		handler: create,
	});

	fastify.route({
		method: "PUT",
		url: "/update/:master_name/:master_id",
		handler: update,
	});

	fastify.route({
		method: "DELETE",
		url: "/delete/:master_name/:master_id",
		handler: remove,
	});

	done();
}
