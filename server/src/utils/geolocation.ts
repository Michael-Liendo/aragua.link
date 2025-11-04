/**
 * Get geolocation data from IP address
 * Uses ip-api.com free service (15 requests/minute limit)
 * For production, consider using a paid service or caching results
 */

interface GeolocationData {
	country: string | null;
	country_code: string | null;
	region: string | null;
	city: string | null;
	latitude: number | null;
	longitude: number | null;
	timezone: string | null;
}

export async function getGeolocationFromIP(
	ipAddress: string | null,
): Promise<GeolocationData> {
	if (!ipAddress || ipAddress === "127.0.0.1" || ipAddress === "::1") {
		return {
			country: null,
			country_code: null,
			region: null,
			city: null,
			latitude: null,
			longitude: null,
			timezone: null,
		};
	}

	try {
		// Using ip-api.com free service
		const response = await fetch(
			`http://ip-api.com/json/${ipAddress}?fields=status,country,countryCode,regionName,city,lat,lon,timezone`,
		);

		if (!response.ok) {
			throw new Error("Failed to fetch geolocation data");
		}

		const data = await response.json();

		if (data.status === "fail") {
			return {
				country: null,
				country_code: null,
				region: null,
				city: null,
				latitude: null,
				longitude: null,
				timezone: null,
			};
		}

		return {
			country: data.country || null,
			country_code: data.countryCode || null,
			region: data.regionName || null,
			city: data.city || null,
			latitude: data.lat || null,
			longitude: data.lon || null,
			timezone: data.timezone || null,
		};
	} catch (error) {
		console.error("Error fetching geolocation:", error);
		return {
			country: null,
			country_code: null,
			region: null,
			city: null,
			latitude: null,
			longitude: null,
			timezone: null,
		};
	}
}

/**
 * Extract IP address from Fastify request
 * Handles Cloudflare, proxies, and load balancers
 */

// biome-ignore lint/suspicious/noExplicitAny: false positive
export function getClientIP(request: any): string | null {
	// 1. Check CF-Connecting-IP (Cloudflare's real IP header)
	const cfIP = request.headers["cf-connecting-ip"];
	if (cfIP && typeof cfIP === "string") {
		return cfIP.trim();
	}

	// 2. Check True-Client-IP (Cloudflare Enterprise)
	const trueClientIP = request.headers["true-client-ip"];
	if (trueClientIP && typeof trueClientIP === "string") {
		return trueClientIP.trim();
	}

	// 3. Check X-Real-IP (Nginx, other proxies)
	const realIP = request.headers["x-real-ip"];
	if (realIP && typeof realIP === "string") {
		return realIP.trim();
	}

	// 4. Check X-Forwarded-For (standard proxy header)
	// Takes the FIRST IP (client), not the last (proxy)
	const forwardedFor = request.headers["x-forwarded-for"];
	if (forwardedFor) {
		const ips = (
			typeof forwardedFor === "string" ? forwardedFor : forwardedFor[0]
		).split(",");
		const clientIP = ips[0].trim();
		// Validate it's not a private IP
		if (clientIP && !isPrivateIP(clientIP)) {
			return clientIP;
		}
	}

	// 5. Fallback to socket IP (direct connection)
	return request.ip || request.socket?.remoteAddress || null;
}

/**
 * Check if an IP is private/local
 */
function isPrivateIP(ip: string): boolean {
	// Remove IPv6 prefix if present
	const cleanIP = ip.replace(/^::ffff:/, "");

	// Private IP ranges
	const privateRanges = [
		/^10\./, // 10.0.0.0/8
		/^172\.(1[6-9]|2[0-9]|3[0-1])\./, // 172.16.0.0/12
		/^192\.168\./, // 192.168.0.0/16
		/^127\./, // 127.0.0.0/8 (localhost)
		/^169\.254\./, // 169.254.0.0/16 (link-local)
		/^fc00:/, // IPv6 private
		/^fe80:/, // IPv6 link-local
		/^::1$/, // IPv6 localhost
	];

	return privateRanges.some((range) => range.test(cleanIP));
}
