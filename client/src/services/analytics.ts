import type {
	IClickEvent,
	ILinkAnalytics,
	ISResponse,
	IUserAnalytics,
} from "@aragualink/shared";
import fetch from "../utils/fetch";

export class AnalyticsService {
	/**
	 * Get analytics for a specific link
	 */
	static async getLinkAnalytics(linkId: string): Promise<ILinkAnalytics> {
		const request = await fetch(`/analytics/link/${linkId}`);
		const response: ISResponse<ILinkAnalytics> = await request.json();

		if (!response.success) {
			throw new Error("Error fetching link analytics");
		}

		return response.data;
	}

	/**
	 * Get user-level analytics (all links)
	 */
	static async getUserAnalytics(): Promise<IUserAnalytics> {
		const request = await fetch("/analytics/user");
		const response: ISResponse<IUserAnalytics> = await request.json();

		if (!response.success) {
			throw new Error("Error fetching user analytics");
		}

		return response.data;
	}

	/**
	 * Get click events for a link (paginated)
	 */
	static async getClickEvents(
		linkId: string,
		limit = 100,
		offset = 0,
	): Promise<IClickEvent[]> {
		const request = await fetch(
			`/analytics/link/${linkId}/events?limit=${limit}&offset=${offset}`,
		);
		const response: ISResponse<IClickEvent[]> = await request.json();

		if (!response.success) {
			throw new Error("Error fetching click events");
		}

		return response.data;
	}
}
