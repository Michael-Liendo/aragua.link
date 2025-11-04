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
 */
export function getClientIP(request: any): string | null {
	// Check X-Forwarded-For header (for proxies/load balancers)
	const forwardedFor = request.headers["x-forwarded-for"];
	if (forwardedFor) {
		const ips = forwardedFor.split(",");
		return ips[0].trim();
	}

	// Check X-Real-IP header
	const realIP = request.headers["x-real-ip"];
	if (realIP) {
		return realIP;
	}

	// Fallback to socket IP
	return request.ip || request.socket?.remoteAddress || null;
}
