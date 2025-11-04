import type { IUser } from "@aragualink/shared";
import Services from "../services";
import type { Reply, Request } from "../types";

/**
 * Get analytics for a specific link
 */
export async function getLinkAnalytics(request: Request, reply: Reply) {
	const { id: userId } = request.user as Required<IUser>;
	const { linkId } = request.params as { linkId: string };

	const analytics = await Services.analytics.getLinkAnalytics(linkId, userId);

	return reply.code(200).send({
		success: true,
		message: "Analytics retrieved",
		data: analytics,
	});
}

/**
 * Get user-level analytics (all links)
 */
export async function getUserAnalytics(request: Request, reply: Reply) {
	const { id: userId } = request.user as Required<IUser>;

	const analytics = await Services.analytics.getUserAnalytics(userId);

	return reply.code(200).send({
		success: true,
		message: "User analytics retrieved",
		data: analytics,
	});
}

/**
 * Get click events for a link (paginated)
 */
export async function getClickEvents(request: Request, reply: Reply) {
	const { id: userId } = request.user as Required<IUser>;
	const { linkId } = request.params as { linkId: string };
	const { limit = 100, offset = 0 } = request.query as {
		limit?: number;
		offset?: number;
	};

	const events = await Services.analytics.getClickEvents(
		linkId,
		userId,
		Number(limit),
		Number(offset),
	);

	return reply.code(200).send({
		success: true,
		message: "Click events retrieved",
		data: events,
	});
}
