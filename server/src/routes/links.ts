import {
	BulkLinkCreateSchema,
	LinkForCreateSchema,
	LinkForUpdateSchema,
} from "@aragualink/shared";
import type { FastifyInstance, RegisterOptions } from "fastify";
import {
	createBulkLinks,
	createLink,
	deleteLink,
	getAllLinks,
	getLink,
	getLinkByShortCode,
	getPublicProfile,
	reorderLinks,
	trackAndRedirect,
	updateLink,
} from "../controllers/links";
import { checkUser } from "../middlewares/checkUser";
import requestValidation from "../utils/requestValidation";

export default function links(
	fastify: FastifyInstance,
	_: RegisterOptions,
	done: () => void,
) {
	// Protected routes (require authentication)
	fastify.register(
		async (authenticatedRoutes) => {
			authenticatedRoutes.register(checkUser);

			// Get all links for authenticated user
			authenticatedRoutes.route({
				method: "GET",
				url: "/",
				handler: getAllLinks,
			});

			// Get a single link by ID
			authenticatedRoutes.route({
				method: "GET",
				url: "/:id",
				handler: getLink,
			});

			// Create a new link
			authenticatedRoutes.route({
				method: "POST",
				url: "/",
				preValidation: requestValidation(LinkForCreateSchema),
				handler: createLink,
			});

			// Update a link
			authenticatedRoutes.route({
				method: "PUT",
				url: "/:id",
				preValidation: requestValidation(LinkForUpdateSchema),
				handler: updateLink,
			});

			// Delete a link
			authenticatedRoutes.route({
				method: "DELETE",
				url: "/:id",
				handler: deleteLink,
			});

			// Reorder links
			authenticatedRoutes.route({
				method: "POST",
				url: "/reorder",
				handler: reorderLinks,
			});

			// Create multiple links at once
			authenticatedRoutes.route({
				method: "POST",
				url: "/bulk",
				preValidation: requestValidation(BulkLinkCreateSchema),
				handler: createBulkLinks,
			});
		},
		{ prefix: "/my" },
	);

	// Public routes (no authentication required)

	// Get link by short code
	fastify.route({
		method: "GET",
		url: "/s/:shortCode",
		handler: getLinkByShortCode,
	});

	// Track click and redirect
	fastify.route({
		method: "GET",
		url: "/r/:shortCode",
		handler: trackAndRedirect,
	});

	// Get public profile with active links
	fastify.route({
		method: "GET",
		url: "/profile/:userId",
		handler: getPublicProfile,
	});

	done();
}
