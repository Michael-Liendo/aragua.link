import type { ISResponse } from "@aragualink/shared";
import fetch from "../utils/fetch";

export interface IClickEvent {
	id: string;
	link_id: string;
	user_id: string;
	ip_address: string | null;
	user_agent: string | null;
	country: string | null;
	country_code: string | null;
	region: string | null;
	city: string | null;
	latitude: number | null;
	longitude: number | null;
	timezone: string | null;
	device_type: string | null;
	browser: string | null;
	browser_version: string | null;
	os: string | null;
	os_version: string | null;
	referrer: string | null;
	referrer_domain: string | null;
	utm_source: string | null;
	utm_medium: string | null;
	utm_campaign: string | null;
	utm_term: string | null;
	utm_content: string | null;
	language: string | null;
	is_unique: boolean;
	created_at: string;
}

export interface ILinkAnalytics {
	link_id: string;
	total_clicks: number;
	unique_clicks: number;
	last_clicked_at: string | null;
	top_countries: Array<{ country: string; clicks: number }>;
	top_cities: Array<{ city: string; clicks: number }>;
	top_devices: Array<{ device_type: string; clicks: number }>;
	top_browsers: Array<{ browser: string; clicks: number }>;
	top_referrers: Array<{ referrer_domain: string; clicks: number }>;
	clicks_by_day: Array<{ date: string; clicks: number }>;
}

export interface IUserAnalytics {
	user_id: string;
	total_links: number;
	total_clicks: number;
	unique_clicks: number;
	clicks_today: number;
	clicks_this_week: number;
	clicks_this_month: number;
	top_links: Array<{
		link_id: string;
		title: string;
		short_code: string;
		clicks: number;
	}>;
}

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
