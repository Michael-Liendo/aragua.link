import {
	BioPageForCreateSchema,
	BioPageForUpdateSchema,
	BioPageLinkForCreateSchema,
	BioPageLinkForUpdateSchema,
} from "@aragualink/shared";
import type { FastifyInstance, RegisterOptions } from "fastify";
import {
	addLinkToBioPage,
	createBioPage,
	deleteBioPage,
	getBioPage,
	getBioPageLinks,
	getPublicBioPage,
	removeLinkFromBioPage,
	reorderBioPageLinks,
	updateBioPage,
	updateBioPageLink,
} from "../controllers/bioPages";
import { checkUser } from "../middlewares/checkUser";
import requestValidation from "../utils/requestValidation";

export default function bioPages(
	fastify: FastifyInstance,
	_: RegisterOptions,
	done: () => void,
) {
	// Protected routes (require authentication)
	fastify.register(
		async (authenticatedRoutes) => {
			authenticatedRoutes.register(checkUser);

			// Get user's bio page
			authenticatedRoutes.route({
				method: "GET",
				url: "/",
				handler: getBioPage,
			});

			// Create bio page
			authenticatedRoutes.route({
				method: "POST",
				url: "/",
				preValidation: requestValidation(BioPageForCreateSchema),
				handler: createBioPage,
			});

			// Update bio page
			authenticatedRoutes.route({
				method: "PUT",
				url: "/",
				preValidation: requestValidation(BioPageForUpdateSchema),
				handler: updateBioPage,
			});

			// Delete bio page
			authenticatedRoutes.route({
				method: "DELETE",
				url: "/",
				handler: deleteBioPage,
			});

			// Get links in bio page
			authenticatedRoutes.route({
				method: "GET",
				url: "/links",
				handler: getBioPageLinks,
			});

			// Add link to bio page
			authenticatedRoutes.route({
				method: "POST",
				url: "/links",
				preValidation: requestValidation(BioPageLinkForCreateSchema),
				handler: addLinkToBioPage,
			});

			// Update link in bio page
			authenticatedRoutes.route({
				method: "PUT",
				url: "/links/:id",
				preValidation: requestValidation(BioPageLinkForUpdateSchema),
				handler: updateBioPageLink,
			});

			// Remove link from bio page
			authenticatedRoutes.route({
				method: "DELETE",
				url: "/links/:id",
				handler: removeLinkFromBioPage,
			});

			// Reorder links in bio page
			authenticatedRoutes.route({
				method: "POST",
				url: "/links/reorder",
				handler: reorderBioPageLinks,
			});
		},
		{ prefix: "/my" },
	);

	// Public routes (no authentication required)

	// Get public bio page by slug
	fastify.route({
		method: "GET",
		url: "/:slug",
		handler: getPublicBioPage,
	});

	done();
}
