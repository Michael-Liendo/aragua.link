import type { ILinkForCreate, ILinkForUpdate, IUser } from "@aragualink/shared";
import Repository from "../repository";
import Services from "../services";
import type { Reply, Request } from "../types";
import { getClientIP } from "../utils/geolocation";

/**
 * Get all links for the authenticated user
 */
export async function getAllLinks(request: Request, reply: Reply) {
	const { id: userId } = request.user as Required<IUser>;
	const links = await Services.links.getAllByUserId(userId);
	return reply
		.code(200)
		.send({ success: true, message: "Links retrieved", data: links });
}

/**
 * Get a single link by ID
 */
export async function getLink(request: Request, reply: Reply) {
	const { id: userId } = request.user as Required<IUser>;
	const { id: linkId } = request.params as { id: string };
	const link = await Services.links.getById(linkId, userId);
	return reply
		.code(200)
		.send({ success: true, message: "Link retrieved", data: link });
}

/**
 * Create a new link
 */
export async function createLink(request: Request, reply: Reply) {
	const { id: userId } = request.user as Required<IUser>;
	const linkDTO = request.body as ILinkForCreate;
	const link = await Services.links.create(userId, linkDTO);
	return reply
		.code(201)
		.send({ success: true, message: "Link created", data: link });
}

/**
 * Update a link
 */
export async function updateLink(request: Request, reply: Reply) {
	const { id: userId } = request.user as Required<IUser>;
	const { id: linkId } = request.params as { id: string };
	const linkUpdates = request.body as ILinkForUpdate;
	const link = await Services.links.update(linkId, userId, linkUpdates);
	return reply
		.code(200)
		.send({ success: true, message: "Link updated", data: link });
}

/**
 * Delete a link
 */
export async function deleteLink(request: Request, reply: Reply) {
	const { id: userId } = request.user as Required<IUser>;
	const { id: linkId } = request.params as { id: string };
	await Services.links.delete(linkId, userId);
	return reply.code(204).send();
}

/**
 * Reorder links
 */
export async function reorderLinks(request: Request, reply: Reply) {
	const { id: userId } = request.user as Required<IUser>;
	const { links } = request.body as {
		links: Array<{ id: string; position: number }>;
	};
	await Services.links.reorder(userId, links);
	return reply
		.code(200)
		.send({ success: true, message: "Links reordered", data: true });
}

/**
 * Get link by short code (public endpoint)
 */
export async function getLinkByShortCode(request: Request, reply: Reply) {
	const { shortCode } = request.params as { shortCode: string };
	const link = await Services.links.getByShortCode(shortCode);
	return reply
		.code(200)
		.send({ success: true, message: "Link retrieved", data: link });
}

/**
 * Track click and redirect (public endpoint)
 * Redirects to links, bio pages are handled by the frontend
 */
export async function trackAndRedirect(request: Request, reply: Reply) {
	const { shortCode } = request.params as { shortCode: string };

	// Get link
	const link = await Services.links.getByShortCode(shortCode);

	// Extract tracking data from request
	const ipAddress = getClientIP(request);
	const userAgent = request.headers["user-agent"] || null;
	const referrerHeader = request.headers.referer || request.headers.referrer;
	const referrer = Array.isArray(referrerHeader)
		? referrerHeader[0]
		: referrerHeader || null;
	const acceptLang = request.headers["accept-language"];
	const language =
		(Array.isArray(acceptLang) ? acceptLang[0] : acceptLang)?.split(",")[0] ||
		null;

	// Extract UTM parameters from query string
	const query = request.query as Record<string, string>;
	const utmParams = {
		utm_source: query.utm_source,
		utm_medium: query.utm_medium,
		utm_campaign: query.utm_campaign,
		utm_term: query.utm_term,
		utm_content: query.utm_content,
	};

	// Track the click with full analytics (async, don't wait)
	Services.analytics
		.trackClick(
			link.id,
			link.user_id,
			ipAddress,
			userAgent,
			referrer,
			utmParams,
			language,
		)
		.catch((error) => {
			console.error("Error tracking click:", error);
		});

	// Increment simple counter in repository
	await Repository.links.incrementClicks(link.id);

	// Redirect immediately
	return reply.redirect(link.url);
}

/**
 * Get active links for a user (public profile)
 */
export async function getPublicProfile(request: Request, reply: Reply) {
	const { userId } = request.params as { userId: string };
	const links = await Services.links.getActiveByUserId(userId);
	const user = await Services.users.getByID(userId);

	// Remove sensitive data
	// biome-ignore lint/correctness/noUnusedVariables: remove the password from the response
	const { password, email, phone, ...safeUser } = user as Required<IUser>;

	return reply.code(200).send({
		success: true,
		message: "Profile retrieved",
		data: {
			user: safeUser,
			links,
		},
	});
}
