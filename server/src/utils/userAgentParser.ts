/**
 * Parse User-Agent string to extract device, browser, and OS information
 * This is a simplified parser. For production, consider using a library like 'ua-parser-js'
 */

interface ParsedUserAgent {
	device_type: "mobile" | "tablet" | "desktop" | "bot" | "unknown";
	browser: string | null;
	browser_version: string | null;
	os: string | null;
	os_version: string | null;
}

export function parseUserAgent(userAgent: string | null): ParsedUserAgent {
	if (!userAgent) {
		return {
			device_type: "unknown",
			browser: null,
			browser_version: null,
			os: null,
			os_version: null,
		};
	}

	const ua = userAgent.toLowerCase();

	// Detect bots
	const botPatterns = [
		"bot",
		"crawler",
		"spider",
		"scraper",
		"curl",
		"wget",
		"python",
	];
	if (botPatterns.some((pattern) => ua.includes(pattern))) {
		return {
			device_type: "bot",
			browser: "Bot",
			browser_version: null,
			os: null,
			os_version: null,
		};
	}

	// Detect device type
	let device_type: ParsedUserAgent["device_type"] = "desktop";
	if (ua.includes("mobile") || ua.includes("android")) {
		device_type = "mobile";
	} else if (ua.includes("tablet") || ua.includes("ipad")) {
		device_type = "tablet";
	}

	// Detect browser
	let browser: string | null = null;
	let browser_version: string | null = null;

	if (ua.includes("edg/")) {
		browser = "Edge";
		const match = ua.match(/edg\/([\d.]+)/);
		browser_version = match ? match[1] : null;
	} else if (ua.includes("chrome/")) {
		browser = "Chrome";
		const match = ua.match(/chrome\/([\d.]+)/);
		browser_version = match ? match[1] : null;
	} else if (ua.includes("firefox/")) {
		browser = "Firefox";
		const match = ua.match(/firefox\/([\d.]+)/);
		browser_version = match ? match[1] : null;
	} else if (ua.includes("safari/") && !ua.includes("chrome")) {
		browser = "Safari";
		const match = ua.match(/version\/([\d.]+)/);
		browser_version = match ? match[1] : null;
	} else if (ua.includes("opera/") || ua.includes("opr/")) {
		browser = "Opera";
		const match = ua.match(/(?:opera|opr)\/([\d.]+)/);
		browser_version = match ? match[1] : null;
	}

	// Detect OS
	let os: string | null = null;
	let os_version: string | null = null;

	if (ua.includes("windows")) {
		os = "Windows";
		if (ua.includes("windows nt 10.0")) os_version = "10";
		else if (ua.includes("windows nt 6.3")) os_version = "8.1";
		else if (ua.includes("windows nt 6.2")) os_version = "8";
		else if (ua.includes("windows nt 6.1")) os_version = "7";
	} else if (ua.includes("mac os x")) {
		os = "macOS";
		const match = ua.match(/mac os x ([\d_]+)/);
		os_version = match ? match[1].replace(/_/g, ".") : null;
	} else if (ua.includes("android")) {
		os = "Android";
		const match = ua.match(/android ([\d.]+)/);
		os_version = match ? match[1] : null;
	} else if (ua.includes("iphone") || ua.includes("ipad")) {
		os = "iOS";
		const match = ua.match(/os ([\d_]+)/);
		os_version = match ? match[1].replace(/_/g, ".") : null;
	} else if (ua.includes("linux")) {
		os = "Linux";
	}

	return {
		device_type,
		browser,
		browser_version,
		os,
		os_version,
	};
}
