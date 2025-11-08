import type {
	IBioPageForCreate,
	IBioPageForUpdate,
	IBioPageLinkForCreate,
	IBioPageLinkForUpdate,
} from "@aragualink/shared";
import type { FastifyReply, FastifyRequest } from "fastify";
import Services from "../services";
import type { Request } from "../types/Request";

// Get user's bio page
export async function getBioPage(request: Request, reply: FastifyReply) {
	const bioPage = await Services.bioPages.getByUserId(request.user!.id);
	return reply.send({
		success: true,
		data: bioPage,
	});
}

// Create bio page
export async function createBioPage(request: Request, reply: FastifyReply) {
	const bioPage = await Services.bioPages.create(
		request.user!.id,
		request.body as IBioPageForCreate,
	);
	return reply.status(201).send({
		success: true,
		data: bioPage,
	});
}

// Update bio page
export async function updateBioPage(request: Request, reply: FastifyReply) {
	const bioPage = await Services.bioPages.update(
		request.user!.id,
		request.body as IBioPageForUpdate,
	);
	return reply.send({
		success: true,
		data: bioPage,
	});
}

// Delete bio page
export async function deleteBioPage(request: Request, reply: FastifyReply) {
	await Services.bioPages.delete(request.user!.id);
	return reply.status(204).send();
}

// Get links in bio page
export async function getBioPageLinks(request: Request, reply: FastifyReply) {
	const links = await Services.bioPages.getLinks(request.user!.id);
	return reply.send({
		success: true,
		data: links,
	});
}

// Add link to bio page
export async function addLinkToBioPage(request: Request, reply: FastifyReply) {
	const link = await Services.bioPages.addLink(
		request.user!.id,
		request.body as IBioPageLinkForCreate,
	);
	return reply.status(201).send({
		success: true,
		data: link,
	});
}

// Update link in bio page
export async function updateBioPageLink(request: Request, reply: FastifyReply) {
	const { id } = request.params as { id: string };
	const link = await Services.bioPages.updateLink(
		request.user!.id,
		id,
		request.body as IBioPageLinkForUpdate,
	);
	return reply.send({
		success: true,
		data: link,
	});
}

// Remove link from bio page
export async function removeLinkFromBioPage(
	request: Request,
	reply: FastifyReply,
) {
	const { id } = request.params as { id: string };
	await Services.bioPages.removeLink(request.user!.id, id);
	return reply.status(204).send();
}

// Reorder links in bio page
export async function reorderBioPageLinks(
	request: Request,
	reply: FastifyReply,
) {
	const { linkOrders } = request.body as {
		linkOrders: Array<{ id: string; position: number }>;
	};
	await Services.bioPages.reorderLinks(request.user!.id, linkOrders);
	return reply.send({
		success: true,
		message: "Enlaces reordenados exitosamente",
	});
}

// Public: Get bio page by slug
export async function getPublicBioPage(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { slug } = request.params as { slug: string };
	const bioPage = await Services.bioPages.getPublicBioPage(slug);
	return reply.send({
		success: true,
		data: bioPage,
	});
}
