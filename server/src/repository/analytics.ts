import type { IClickEvent, IClickEventForCreate } from "@aragualink/shared";

// biome-ignore lint: any types needed for database queries
type AnyRecord = any;

import { InternalServerError } from "../utils/errorHandler";
import database from "./database";

export class Analytics {
	/**
	 * Create a click event
	 */
	static async createClickEvent(
		clickData: IClickEventForCreate,
	): Promise<IClickEvent> {
		const [clickEvent] = await database<IClickEvent>("click_events")
			.insert(clickData)
			.returning("*");

		if (!clickEvent)
			throw new InternalServerError("Error creating click event");
		return clickEvent;
	}

	/**
	 * Get click events for a link
	 */
	static async getClickEventsByLinkId(
		linkId: string,
		limit = 100,
		offset = 0,
	): Promise<IClickEvent[]> {
		const events = await database<IClickEvent>("click_events")
			.where({ link_id: linkId })
			.orderBy("created_at", "desc")
			.limit(limit)
			.offset(offset);

		return events;
	}

	/**
	 * Get click events for a user (all their links)
	 */
	static async getClickEventsByUserId(
		userId: string,
		limit = 100,
		offset = 0,
	): Promise<IClickEvent[]> {
		const events = await database<IClickEvent>("click_events")
			.where({ user_id: userId })
			.orderBy("created_at", "desc")
			.limit(limit)
			.offset(offset);

		return events;
	}

	/**
	 * Get total clicks for a link
	 */
	static async getTotalClicksByLinkId(linkId: string): Promise<number> {
		const [result] = await database("click_events")
			.where({ link_id: linkId })
			.count("* as count");

		return Number(result?.count) || 0;
	}

	/**
	 * Get unique clicks for a link (based on IP + User Agent)
	 */
	static async getUniqueClicksByLinkId(linkId: string): Promise<number> {
		const [result] = await database("click_events")
			.where({ link_id: linkId, is_unique: true })
			.count("* as count");

		return Number(result?.count) || 0;
	}

	/**
	 * Check if IP + User Agent combination has clicked this link before
	 */
	static async hasClickedBefore(
		linkId: string,
		ipAddress: string,
		userAgent: string,
	): Promise<boolean> {
		const [result] = await database("click_events")
			.where({
				link_id: linkId,
				ip_address: ipAddress,
				user_agent: userAgent,
			})
			.count("* as count");

		return Number(result?.count) > 0;
	}

	/**
	 * Get top countries for a link
	 */
	static async getTopCountriesByLinkId(
		linkId: string,
		limit = 10,
	): Promise<Array<{ country: string; country_code: string; clicks: number }>> {
		const results = await database("click_events")
			.where({ link_id: linkId })
			.whereNotNull("country")
			.select("country", "country_code")
			.count("* as clicks")
			.groupBy("country", "country_code")
			.orderBy("clicks", "desc")
			.limit(limit);

		return results.map((r: any) => ({
			country: String(r.country),
			country_code: String(r.country_code),
			clicks: Number(r.clicks),
		}));
	}

	/**
	 * Get top cities for a link
	 */
	static async getTopCitiesByLinkId(
		linkId: string,
		limit = 10,
	): Promise<Array<{ city: string; country: string; clicks: number }>> {
		const results = await database("click_events")
			.where({ link_id: linkId })
			.whereNotNull("city")
			.select("city", "country")
			.count("* as clicks")
			.groupBy("city", "country")
			.orderBy("clicks", "desc")
			.limit(limit);

		return results.map((r: AnyRecord) => ({
			city: String(r.city),
			country: String(r.country),
			clicks: Number(r.clicks),
		}));
	}

	/**
	 * Get top devices for a link
	 */
	static async getTopDevicesByLinkId(
		linkId: string,
	): Promise<Array<{ device_type: string; clicks: number }>> {
		const results = await database("click_events")
			.where({ link_id: linkId })
			.whereNotNull("device_type")
			.select("device_type")
			.count("* as clicks")
			.groupBy("device_type")
			.orderBy("clicks", "desc");

		return results.map((r: AnyRecord) => ({
			device_type: String(r.device_type),
			clicks: Number(r.clicks),
		}));
	}

	/**
	 * Get top browsers for a link
	 */
	static async getTopBrowsersByLinkId(
		linkId: string,
		limit = 10,
	): Promise<Array<{ browser: string; clicks: number }>> {
		const results = await database("click_events")
			.where({ link_id: linkId })
			.whereNotNull("browser")
			.select("browser")
			.count("* as clicks")
			.groupBy("browser")
			.orderBy("clicks", "desc")
			.limit(limit);

		return results.map((r: AnyRecord) => ({
			browser: String(r.browser),
			clicks: Number(r.clicks),
		}));
	}

	/**
	 * Get top referrers for a link
	 */
	static async getTopReferrersByLinkId(
		linkId: string,
		limit = 10,
	): Promise<Array<{ referrer_domain: string; clicks: number }>> {
		const results = await database("click_events")
			.where({ link_id: linkId })
			.whereNotNull("referrer_domain")
			.select("referrer_domain")
			.count("* as clicks")
			.groupBy("referrer_domain")
			.orderBy("clicks", "desc")
			.limit(limit);

		return results.map((r: AnyRecord) => ({
			referrer_domain: String(r.referrer_domain),
			clicks: Number(r.clicks),
		}));
	}

	/**
	 * Get clicks by day for a link (last N days)
	 */
	static async getClicksByDay(
		linkId: string,
		days = 30,
	): Promise<Array<{ date: string; clicks: number }>> {
		const results = await database("click_events")
			.where({ link_id: linkId })
			.where(
				"created_at",
				">=",
				database.raw(`NOW() - INTERVAL '${days} days'`),
			)
			.select(database.raw("DATE(created_at) as date"))
			.count("* as clicks")
			.groupBy(database.raw("DATE(created_at)"))
			.orderBy("date", "asc");

		return results.map((r: AnyRecord) => ({
			date: String(r.date),
			clicks: Number(r.clicks),
		}));
	}

	/**
	 * Get clicks for user in a time period
	 */
	static async getClicksInPeriod(
		userId: string,
		startDate: Date,
		endDate: Date,
	): Promise<number> {
		const [result] = await database("click_events")
			.where({ user_id: userId })
			.whereBetween("created_at", [startDate, endDate])
			.count("* as count");

		return Number(result?.count) || 0;
	}

	/**
	 * Get top links for a user by clicks
	 */
	static async getTopLinksByUserId(
		userId: string,
		limit = 10,
	): Promise<
		Array<{
			link_id: string;
			title: string;
			short_code: string;
			clicks: number;
		}>
	> {
		const results = await database("click_events")
			.join("links", "click_events.link_id", "links.id")
			.where({ "click_events.user_id": userId })
			.select("links.id as link_id", "links.title", "links.short_code")
			.count("* as clicks")
			.groupBy("links.id", "links.title", "links.short_code")
			.orderBy("clicks", "desc")
			.limit(limit);

		return results.map((r: AnyRecord) => ({
			link_id: String(r.link_id),
			title: String(r.title),
			short_code: String(r.short_code),
			clicks: Number(r.clicks),
		}));
	}

	/**
	 * Get last click date for a link
	 */
	static async getLastClickDate(linkId: string): Promise<Date | null> {
		const result = await database("click_events")
			.where({ link_id: linkId })
			.max("created_at as last_click")
			.first();

		return result?.last_click ? new Date(result.last_click) : null;
	}

	/**
	 * Get top countries for a user (all their links)
	 */
	static async getTopCountriesByUserId(
		userId: string,
		limit = 10,
	): Promise<Array<{ country: string; country_code: string; clicks: number }>> {
		const results = await database("click_events")
			.where({ user_id: userId })
			.whereNotNull("country")
			.select("country", "country_code")
			.count("* as clicks")
			.groupBy("country", "country_code")
			.orderBy("clicks", "desc")
			.limit(limit);

		return results.map((r: AnyRecord) => ({
			country: String(r.country),
			country_code: String(r.country_code),
			clicks: Number(r.clicks),
		}));
	}

	/**
	 * Get top cities for a user (all their links)
	 */
	static async getTopCitiesByUserId(
		userId: string,
		limit = 10,
	): Promise<Array<{ city: string; country: string; clicks: number }>> {
		const results = await database("click_events")
			.where({ user_id: userId })
			.whereNotNull("city")
			.select("city", "country")
			.count("* as clicks")
			.groupBy("city", "country")
			.orderBy("clicks", "desc")
			.limit(limit);

		return results.map((r: AnyRecord) => ({
			city: String(r.city),
			country: String(r.country),
			clicks: Number(r.clicks),
		}));
	}

	/**
	 * Get top devices for a user (all their links)
	 */
	static async getTopDevicesByUserId(
		userId: string,
	): Promise<Array<{ device_type: string; clicks: number }>> {
		const results = await database("click_events")
			.where({ user_id: userId })
			.whereNotNull("device_type")
			.select("device_type")
			.count("* as clicks")
			.groupBy("device_type")
			.orderBy("clicks", "desc");

		return results.map((r: AnyRecord) => ({
			device_type: String(r.device_type),
			clicks: Number(r.clicks),
		}));
	}

	/**
	 * Get top browsers for a user (all their links)
	 */
	static async getTopBrowsersByUserId(
		userId: string,
		limit = 10,
	): Promise<Array<{ browser: string; clicks: number }>> {
		const results = await database("click_events")
			.where({ user_id: userId })
			.whereNotNull("browser")
			.select("browser")
			.count("* as clicks")
			.groupBy("browser")
			.orderBy("clicks", "desc")
			.limit(limit);

		return results.map((r: AnyRecord) => ({
			browser: String(r.browser),
			clicks: Number(r.clicks),
		}));
	}

	/**
	 * Get top referrers for a user (all their links)
	 */
	static async getTopReferrersByUserId(
		userId: string,
		limit = 10,
	): Promise<Array<{ referrer_domain: string; clicks: number }>> {
		const results = await database("click_events")
			.where({ user_id: userId })
			.whereNotNull("referrer_domain")
			.select("referrer_domain")
			.count("* as clicks")
			.groupBy("referrer_domain")
			.orderBy("clicks", "desc")
			.limit(limit);

		return results.map((r: AnyRecord) => ({
			referrer_domain: String(r.referrer_domain),
			clicks: Number(r.clicks),
		}));
	}

	/**
	 * Get clicks by day for a user (last N days, all links)
	 */
	static async getClicksByDayForUser(
		userId: string,
		days = 30,
	): Promise<Array<{ date: string; clicks: number }>> {
		const results = await database("click_events")
			.where({ user_id: userId })
			.where(
				"created_at",
				">=",
				database.raw(`NOW() - INTERVAL '${days} days'`),
			)
			.select(database.raw("DATE(created_at) as date"))
			.count("* as clicks")
			.groupBy(database.raw("DATE(created_at)"))
			.orderBy("date", "asc");

		return results.map((r: AnyRecord) => ({
			date: String(r.date),
			clicks: Number(r.clicks),
		}));
	}

	/**
	 * Get top UTM sources for a link
	 */
	static async getTopUtmSourcesByLinkId(
		linkId: string,
		limit = 10,
	): Promise<Array<{ utm_source: string; clicks: number }>> {
		const results = await database("click_events")
			.where({ link_id: linkId })
			.whereNotNull("utm_source")
			.select("utm_source")
			.count("* as clicks")
			.groupBy("utm_source")
			.orderBy("clicks", "desc")
			.limit(limit);

		return results.map((r: AnyRecord) => ({
			utm_source: String(r.utm_source),
			clicks: Number(r.clicks),
		}));
	}

	/**
	 * Get top UTM mediums for a link
	 */
	static async getTopUtmMediumsByLinkId(
		linkId: string,
		limit = 10,
	): Promise<Array<{ utm_medium: string; clicks: number }>> {
		const results = await database("click_events")
			.where({ link_id: linkId })
			.whereNotNull("utm_medium")
			.select("utm_medium")
			.count("* as clicks")
			.groupBy("utm_medium")
			.orderBy("clicks", "desc")
			.limit(limit);

		return results.map((r: AnyRecord) => ({
			utm_medium: String(r.utm_medium),
			clicks: Number(r.clicks),
		}));
	}

	/**
	 * Get top UTM campaigns for a link
	 */
	static async getTopUtmCampaignsByLinkId(
		linkId: string,
		limit = 10,
	): Promise<Array<{ utm_campaign: string; clicks: number }>> {
		const results = await database("click_events")
			.where({ link_id: linkId })
			.whereNotNull("utm_campaign")
			.select("utm_campaign")
			.count("* as clicks")
			.groupBy("utm_campaign")
			.orderBy("clicks", "desc")
			.limit(limit);

		return results.map((r: AnyRecord) => ({
			utm_campaign: String(r.utm_campaign),
			clicks: Number(r.clicks),
		}));
	}

	/**
	 * Get top UTM sources for a user (all their links)
	 */
	static async getTopUtmSourcesByUserId(
		userId: string,
		limit = 10,
	): Promise<Array<{ utm_source: string; clicks: number }>> {
		const results = await database("click_events")
			.where({ user_id: userId })
			.whereNotNull("utm_source")
			.select("utm_source")
			.count("* as clicks")
			.groupBy("utm_source")
			.orderBy("clicks", "desc")
			.limit(limit);

		return results.map((r: AnyRecord) => ({
			utm_source: String(r.utm_source),
			clicks: Number(r.clicks),
		}));
	}

	/**
	 * Get top UTM mediums for a user (all their links)
	 */
	static async getTopUtmMediumsByUserId(
		userId: string,
		limit = 10,
	): Promise<Array<{ utm_medium: string; clicks: number }>> {
		const results = await database("click_events")
			.where({ user_id: userId })
			.whereNotNull("utm_medium")
			.select("utm_medium")
			.count("* as clicks")
			.groupBy("utm_medium")
			.orderBy("clicks", "desc")
			.limit(limit);

		return results.map((r: AnyRecord) => ({
			utm_medium: String(r.utm_medium),
			clicks: Number(r.clicks),
		}));
	}

	/**
	 * Get top UTM campaigns for a user (all their links)
	 */
	static async getTopUtmCampaignsByUserId(
		userId: string,
		limit = 10,
	): Promise<Array<{ utm_campaign: string; clicks: number }>> {
		const results = await database("click_events")
			.where({ user_id: userId })
			.whereNotNull("utm_campaign")
			.select("utm_campaign")
			.count("* as clicks")
			.groupBy("utm_campaign")
			.orderBy("clicks", "desc")
			.limit(limit);

		return results.map((r: AnyRecord) => ({
			utm_campaign: String(r.utm_campaign),
			clicks: Number(r.clicks),
		}));
	}
}
