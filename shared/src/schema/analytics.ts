import { z } from "zod";

// Schema para clicks individuales con toda la información de tracking
export const ClickEventSchema = z.object({
	id: z.uuid(),
	link_id: z.uuid(),
	user_id: z.uuid(),

	// Información de la petición
	ip_address: z.string().nullable(),
	user_agent: z.string().nullable(),

	// Información de ubicación (geolocalización por IP)
	country: z.string().nullable(),
	country_code: z.string().nullable(),
	region: z.string().nullable(),
	city: z.string().nullable(),
	latitude: z.number().nullable(),
	longitude: z.number().nullable(),
	timezone: z.string().nullable(),

	// Información del dispositivo
	device_type: z
		.enum(["mobile", "tablet", "desktop", "bot", "unknown"])
		.nullable(),
	browser: z.string().nullable(),
	browser_version: z.string().nullable(),
	os: z.string().nullable(),
	os_version: z.string().nullable(),

	// Información de referencia
	referrer: z.string().nullable(),
	referrer_domain: z.string().nullable(),

	// UTM Parameters (marketing tracking)
	utm_source: z.string().nullable(),
	utm_medium: z.string().nullable(),
	utm_campaign: z.string().nullable(),
	utm_term: z.string().nullable(),
	utm_content: z.string().nullable(),

	// Información adicional
	language: z.string().nullable(),
	is_unique: z.boolean().default(true), // Si es el primer click de este usuario/dispositivo

	created_at: z.coerce.date(),
});

export const ClickEventForCreateSchema = ClickEventSchema.omit({
	id: true,
	created_at: true,
}).partial({
	ip_address: true,
	user_agent: true,
	country: true,
	country_code: true,
	region: true,
	city: true,
	latitude: true,
	longitude: true,
	timezone: true,
	device_type: true,
	browser: true,
	browser_version: true,
	os: true,
	os_version: true,
	referrer: true,
	referrer_domain: true,
	utm_source: true,
	utm_medium: true,
	utm_campaign: true,
	utm_term: true,
	utm_content: true,
	language: true,
	is_unique: true,
});

// Schema para estadísticas agregadas por link
export const LinkAnalyticsSchema = z.object({
	link_id: z.uuid(),
	total_clicks: z.number().int().min(0),
	unique_clicks: z.number().int().min(0),
	last_clicked_at: z.coerce.date().nullable(),

	// Top países
	top_countries: z.array(
		z.object({
			country: z.string(),
			country_code: z.string(),
			clicks: z.number().int(),
		}),
	),

	// Top ciudades
	top_cities: z.array(
		z.object({
			city: z.string(),
			country: z.string(),
			clicks: z.number().int(),
		}),
	),

	// Top dispositivos
	top_devices: z.array(
		z.object({
			device_type: z.string(),
			clicks: z.number().int(),
		}),
	),

	// Top navegadores
	top_browsers: z.array(
		z.object({
			browser: z.string(),
			clicks: z.number().int(),
		}),
	),

	// Top referrers
	top_referrers: z.array(
		z.object({
			referrer_domain: z.string(),
			clicks: z.number().int(),
		}),
	),

	// Top UTM sources
	top_utm_sources: z.array(
		z.object({
			utm_source: z.string(),
			clicks: z.number().int(),
		}),
	),

	// Top UTM mediums
	top_utm_mediums: z.array(
		z.object({
			utm_medium: z.string(),
			clicks: z.number().int(),
		}),
	),

	// Top UTM campaigns
	top_utm_campaigns: z.array(
		z.object({
			utm_campaign: z.string(),
			clicks: z.number().int(),
		}),
	),

	// Clicks por día (últimos 30 días)
	clicks_by_day: z.array(
		z.object({
			date: z.string(), // YYYY-MM-DD
			clicks: z.number().int(),
		}),
	),
});

// Schema para estadísticas de usuario (todos sus links)
export const UserAnalyticsSchema = z.object({
	user_id: z.uuid(),
	total_links: z.number().int().min(0),
	total_clicks: z.number().int().min(0),
	unique_clicks: z.number().int().min(0),
	clicks_today: z.number().int().min(0),
	clicks_this_week: z.number().int().min(0),
	clicks_this_month: z.number().int().min(0),

	// Links más populares
	top_links: z.array(
		z.object({
			link_id: z.uuid(),
			title: z.string(),
			short_code: z.string(),
			clicks: z.number().int(),
		}),
	),

	// Top países
	top_countries: z.array(
		z.object({
			country: z.string(),
			country_code: z.string(),
			clicks: z.number().int(),
		}),
	),

	// Top ciudades
	top_cities: z.array(
		z.object({
			city: z.string(),
			country: z.string(),
			clicks: z.number().int(),
		}),
	),

	// Top dispositivos
	top_devices: z.array(
		z.object({
			device_type: z.string(),
			clicks: z.number().int(),
		}),
	),

	// Top navegadores
	top_browsers: z.array(
		z.object({
			browser: z.string(),
			clicks: z.number().int(),
		}),
	),

	// Top referrers
	top_referrers: z.array(
		z.object({
			referrer_domain: z.string(),
			clicks: z.number().int(),
		}),
	),

	// Top UTM sources
	top_utm_sources: z.array(
		z.object({
			utm_source: z.string(),
			clicks: z.number().int(),
		}),
	),

	// Top UTM mediums
	top_utm_mediums: z.array(
		z.object({
			utm_medium: z.string(),
			clicks: z.number().int(),
		}),
	),

	// Top UTM campaigns
	top_utm_campaigns: z.array(
		z.object({
			utm_campaign: z.string(),
			clicks: z.number().int(),
		}),
	),

	// Clicks por día (últimos 30 días)
	clicks_by_day: z.array(
		z.object({
			date: z.string(), // YYYY-MM-DD
			clicks: z.number().int(),
		}),
	),
});

export interface IClickEvent extends z.infer<typeof ClickEventSchema> {}
export interface IClickEventForCreate
	extends z.infer<typeof ClickEventForCreateSchema> {}
export interface ILinkAnalytics extends z.infer<typeof LinkAnalyticsSchema> {}
export interface IUserAnalytics extends z.infer<typeof UserAnalyticsSchema> {}
