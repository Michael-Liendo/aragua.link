import type { FastifyInstance, RegisterOptions } from "fastify";
import {
	getClickEvents,
	getLinkAnalytics,
	getUserAnalytics,
} from "../controllers/analytics";
import { checkUser } from "../middlewares/checkUser";

export default function analytics(
	fastify: FastifyInstance,
	_: RegisterOptions,
	done: () => void,
) {
	// All analytics routes require authentication
	fastify.register(checkUser);

	// Get user-level analytics (all links)
	fastify.route({
		method: "GET",
		url: "/user",
		handler: getUserAnalytics,
	});

	// Get analytics for a specific link
	fastify.route({
		method: "GET",
		url: "/link/:linkId",
		handler: getLinkAnalytics,
	});

	// Get click events for a link (paginated)
	fastify.route({
		method: "GET",
		url: "/link/:linkId/events",
		handler: getClickEvents,
	});

	done();
}
