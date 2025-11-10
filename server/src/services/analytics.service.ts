import type {
	IClickEvent,
	ILinkAnalytics,
	IUserAnalytics,
} from "@aragualink/shared";
import Repository from "../repository";
import { NotFoundError } from "../utils/errorHandler";
import { getGeolocationFromIP } from "../utils/geolocation";
import { parseUserAgent } from "../utils/userAgentParser";

export default class AnalyticsService {
	/**
	 * Track a click event with full analytics
	 */
	static async trackClick(
		linkId: string,
		userId: string,
		ipAddress: string | null,
		userAgent: string | null,
		referrer: string | null,
		utmParams: {
			utm_source?: string;
			utm_medium?: string;
			utm_campaign?: string;
			utm_term?: string;
			utm_content?: string;
		},
		language: string | null,
	): Promise<IClickEvent> {
		// Parse user agent
		const deviceInfo = parseUserAgent(userAgent);

		// Get geolocation from IP
		const geoData = await getGeolocationFromIP(ipAddress);

		// Check if this is a unique click
		const hasClicked =
			ipAddress && userAgent
				? await Repository.analytics.hasClickedBefore(
						linkId,
						ipAddress,
						userAgent,
					)
				: false;

		// Extract referrer domain
		let referrer_domain: string | null = null;
		if (referrer) {
			try {
				const url = new URL(referrer);
				referrer_domain = url.hostname;
			} catch {
				// Invalid URL, keep null
			}
		}

		// Create click event
		const clickEvent = await Repository.analytics.createClickEvent({
			link_id: linkId,
			user_id: userId,
			ip_address: ipAddress,
			user_agent: userAgent,
			country: geoData.country,
			country_code: geoData.country_code,
			region: geoData.region,
			city: geoData.city,
			latitude: geoData.latitude,
			longitude: geoData.longitude,
			timezone: geoData.timezone,
			device_type: deviceInfo.device_type,
			browser: deviceInfo.browser,
			browser_version: deviceInfo.browser_version,
			os: deviceInfo.os,
			os_version: deviceInfo.os_version,
			referrer,
			referrer_domain,
			utm_source: utmParams.utm_source || null,
			utm_medium: utmParams.utm_medium || null,
			utm_campaign: utmParams.utm_campaign || null,
			utm_term: utmParams.utm_term || null,
			utm_content: utmParams.utm_content || null,
			language,
			is_unique: !hasClicked,
		});

		return clickEvent;
	}

	/**
	 * Get comprehensive analytics for a link
	 */
	static async getLinkAnalytics(
		linkId: string,
		userId: string,
	): Promise<ILinkAnalytics> {
		// Verify link belongs to user
		const link = await Repository.links.getLinkById(linkId);
		if (!link) {
			throw new NotFoundError("Link not found");
		}
		if (link.user_id !== userId) {
			throw new NotFoundError("Link not found or you don't have permission");
		}

		// Get all analytics data in parallel
		const [
			totalClicks,
			uniqueClicks,
			topCountries,
			topCities,
			topDevices,
			topBrowsers,
			topReferrers,
			clicksByDay,
			lastClickedAt,
		] = await Promise.all([
			Repository.analytics.getTotalClicksByLinkId(linkId),
			Repository.analytics.getUniqueClicksByLinkId(linkId),
			Repository.analytics.getTopCountriesByLinkId(linkId, 10),
			Repository.analytics.getTopCitiesByLinkId(linkId, 10),
			Repository.analytics.getTopDevicesByLinkId(linkId),
			Repository.analytics.getTopBrowsersByLinkId(linkId, 10),
			Repository.analytics.getTopReferrersByLinkId(linkId, 10),
			Repository.analytics.getClicksByDay(linkId, 30),
			Repository.analytics.getLastClickDate(linkId),
		]);

		return {
			link_id: linkId,
			total_clicks: totalClicks,
			unique_clicks: uniqueClicks,
			last_clicked_at: lastClickedAt,
			top_countries: topCountries,
			top_cities: topCities,
			top_devices: topDevices,
			top_browsers: topBrowsers,
			top_referrers: topReferrers,
			clicks_by_day: clicksByDay,
		};
	}

	/**
	 * Get user-level analytics (all links)
	 */
	static async getUserAnalytics(userId: string): Promise<IUserAnalytics> {
		// Get all user's links
		const links = await Repository.links.getLinksByUserId(userId);

		// Calculate date ranges
		const now = new Date();
		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		const weekAgo = new Date(today);
		weekAgo.setDate(weekAgo.getDate() - 7);
		const monthAgo = new Date(today);
		monthAgo.setDate(monthAgo.getDate() - 30);

		// Get clicks for different periods and detailed analytics
		const [
			clicksToday,
			clicksThisWeek,
			clicksThisMonth,
			topLinks,
			topCountries,
			topCities,
			topDevices,
			topBrowsers,
			topReferrers,
			clicksByDay,
		] = await Promise.all([
			Repository.analytics.getClicksInPeriod(userId, today, now),
			Repository.analytics.getClicksInPeriod(userId, weekAgo, now),
			Repository.analytics.getClicksInPeriod(userId, monthAgo, now),
			Repository.analytics.getTopLinksByUserId(userId, 10),
			Repository.analytics.getTopCountriesByUserId(userId, 10),
			Repository.analytics.getTopCitiesByUserId(userId, 10),
			Repository.analytics.getTopDevicesByUserId(userId),
			Repository.analytics.getTopBrowsersByUserId(userId, 10),
			Repository.analytics.getTopReferrersByUserId(userId, 10),
			Repository.analytics.getClicksByDayForUser(userId, 30),
		]);

		// Calculate total clicks across all links
		const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);

		// Get unique clicks (sum of unique clicks for all links)
		const uniqueClicksPromises = links.map((link) =>
			Repository.analytics.getUniqueClicksByLinkId(link.id),
		);
		const uniqueClicksArray = await Promise.all(uniqueClicksPromises);
		const uniqueClicks = uniqueClicksArray.reduce(
			(sum, count) => sum + count,
			0,
		);

		return {
			user_id: userId,
			total_links: links.length,
			total_clicks: totalClicks,
			unique_clicks: uniqueClicks,
			clicks_today: clicksToday,
			clicks_this_week: clicksThisWeek,
			clicks_this_month: clicksThisMonth,
			top_links: topLinks,
			top_countries: topCountries,
			top_cities: topCities,
			top_devices: topDevices,
			top_browsers: topBrowsers,
			top_referrers: topReferrers,
			clicks_by_day: clicksByDay,
		};
	}

	/**
	 * Get click events for a link (paginated)
	 */
	static async getClickEvents(
		linkId: string,
		userId: string,
		limit = 100,
		offset = 0,
	): Promise<IClickEvent[]> {
		// Verify link belongs to user
		const link = await Repository.links.getLinkById(linkId);
		if (!link) {
			throw new NotFoundError("Link not found");
		}
		if (link.user_id !== userId) {
			throw new NotFoundError("Link not found or you don't have permission");
		}

		return Repository.analytics.getClickEventsByLinkId(linkId, limit, offset);
	}
}
