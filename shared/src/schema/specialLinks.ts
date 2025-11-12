import { z } from "zod";

/**
 * Tipos de links especiales soportados
 */
export const SpecialLinkTypeEnum = z.enum([
	"whatsapp_group",
	"whatsapp_chat",
	"telegram_group",
	"telegram_channel",
	"discord_invite",
	"external_app", // Para apps externas (solo móviles)
	"external_browser", // Para abrir en navegador externo (solo móviles)
	"custom", // Para links normales
]);

export type SpecialLinkType = z.infer<typeof SpecialLinkTypeEnum>;

/**
 * Configuración de cada tipo de link especial
 */
export interface SpecialLinkTemplate {
	type: SpecialLinkType;
	name: string;
	description: string;
	icon: string; // Emoji o nombre de icono
	placeholder: string;
	urlPattern: (code: string) => string;
	extractCode?: (url: string) => string | null;
	displayFormat: (code: string) => string;
}

/**
 * Plantillas de links especiales
 */
export const SPECIAL_LINK_TEMPLATES: Record<
	SpecialLinkType,
	SpecialLinkTemplate
> = {
	whatsapp_group: {
		type: "whatsapp_group",
		name: "Grupo de WhatsApp",
		description: "Invitación a grupo de WhatsApp",
		icon: "💬",
		placeholder: "ENaEbiP6vQq6OyMuXre8lG",
		urlPattern: (code: string) => `whatsapp://chat?code=${code}`,
		extractCode: (url: string) => {
			// Soporta ambos formatos
			const whatsappMatch = url.match(
				/whatsapp:\/\/chat\?code=([A-Za-z0-9_-]+)/,
			);
			if (whatsappMatch) return whatsappMatch[1];

			const httpsMatch = url.match(/chat\.whatsapp\.com\/([A-Za-z0-9_-]+)/);
			return httpsMatch ? httpsMatch[1] : null;
		},
		displayFormat: (code: string) => `Grupo de WhatsApp: ${code}`,
	},
	whatsapp_chat: {
		type: "whatsapp_chat",
		name: "Chat de WhatsApp",
		description: "Link directo a chat de WhatsApp",
		icon: "📱",
		placeholder: "+584121234567",
		urlPattern: (code: string) => {
			const cleanPhone = code.replace(/\D/g, "");
			return `https://wa.me/${cleanPhone}`;
		},
		extractCode: (url: string) => {
			const match = url.match(/wa\.me\/(\d+)/);
			return match ? match[1] : null;
		},
		displayFormat: (code: string) => `WhatsApp: ${code}`,
	},
	telegram_group: {
		type: "telegram_group",
		name: "Grupo de Telegram",
		description: "Invitación a grupo de Telegram",
		icon: "✈️",
		placeholder: "joinchat/ABC123xyz",
		urlPattern: (code: string) => `https://t.me/${code}`,
		extractCode: (url: string) => {
			const match = url.match(/t\.me\/([A-Za-z0-9_-]+)/);
			return match ? match[1] : null;
		},
		displayFormat: (code: string) => `Grupo de Telegram: ${code}`,
	},
	telegram_channel: {
		type: "telegram_channel",
		name: "Canal de Telegram",
		description: "Link a canal de Telegram",
		icon: "📢",
		placeholder: "mi_canal",
		urlPattern: (code: string) => `https://t.me/${code}`,
		extractCode: (url: string) => {
			const match = url.match(/t\.me\/([A-Za-z0-9_-]+)/);
			return match ? match[1] : null;
		},
		displayFormat: (code: string) => `Canal de Telegram: ${code}`,
	},
	discord_invite: {
		type: "discord_invite",
		name: "Servidor de Discord",
		description: "Invitación a servidor de Discord",
		icon: "🎮",
		placeholder: "abc123XYZ",
		urlPattern: (code: string) => `https://discord.gg/${code}`,
		extractCode: (url: string) => {
			const match = url.match(/discord\.gg\/([A-Za-z0-9]+)/);
			return match ? match[1] : null;
		},
		displayFormat: (code: string) => `Discord: ${code}`,
	},
	external_app: {
		type: "external_app",
		name: "App Externa (Solo Móviles)",
		description:
			"Link con esquema personalizado para abrir apps externas. Ejemplos: whatsapp://, spotify://, etc. ⚠️ Solo funciona en dispositivos móviles",
		icon: "📲",
		placeholder: "whatsapp://send?phone=584121234567",
		urlPattern: (code: string) => code,
		extractCode: (url: string) => {
			// Verifica que tenga un esquema personalizado (no http/https)
			const match = url.match(/^([a-z][a-z0-9+.-]*):/);
			if (match && match[1] !== "http" && match[1] !== "https") {
				return url;
			}
			return null;
		},
		displayFormat: (code: string) => {
			const schemeMatch = code.match(/^([a-z][a-z0-9+.-]*):/);
			const scheme = schemeMatch ? schemeMatch[1] : "App";
			return `${scheme.charAt(0).toUpperCase() + scheme.slice(1)} (Móvil)`;
		},
	},
	external_browser: {
		type: "external_browser",
		name: "Navegador Externo (Solo Móviles)",
		description:
			"Abre el link en el navegador externo del dispositivo (Chrome, Safari, etc.) en lugar del navegador in-app de Instagram. ⚠️ Solo funciona en dispositivos móviles",
		icon: "🌐",
		placeholder: "https://michaelliendo.com",
		urlPattern: (code: string) => {
			// Usa el esquema 'googlechrome://' o 'googlechromes://' para forzar apertura externa
			// En iOS, esto abrirá Safari si Chrome no está instalado
			const url =
				code.startsWith("http://") || code.startsWith("https://")
					? code
					: `https://${code}`;
			// Usar intent:// para Android y googlechromes:// para iOS
			// Formato que funciona en ambos: usar el URL directo pero marcado para apertura externa
			return url
				.replace("https://", "googlechromes://")
				.replace("http://", "googlechrome://");
		},
		extractCode: (url: string) => {
			// Extrae la URL original desde el esquema de Chrome
			if (url.startsWith("googlechromes://")) {
				return url.replace("googlechromes://", "https://");
			}
			if (url.startsWith("googlechrome://")) {
				return url.replace("googlechrome://", "http://");
			}
			// Si ya es http/https, lo devuelve tal cual
			if (url.startsWith("http://") || url.startsWith("https://")) {
				return url;
			}
			return null;
		},
		displayFormat: (code: string) => {
			const cleanUrl = code
				.replace("googlechromes://", "https://")
				.replace("googlechrome://", "http://");
			try {
				const urlObj = new URL(cleanUrl);
				return `🌐 ${urlObj.hostname}`;
			} catch {
				return `🌐 ${cleanUrl}`;
			}
		},
	},
	custom: {
		type: "custom",
		name: "Link Personalizado",
		description: "URL personalizada",
		icon: "🔗",
		placeholder: "https://ejemplo.com",
		urlPattern: (code: string) => code,
		displayFormat: (code: string) => code,
	},
};

/**
 * Detectar el tipo de link especial desde una URL
 */
export function detectSpecialLinkType(url: string): SpecialLinkType {
	if (
		url.includes("whatsapp://chat?code=") ||
		url.includes("chat.whatsapp.com")
	)
		return "whatsapp_group";
	if (url.includes("wa.me")) return "whatsapp_chat";
	if (url.includes("t.me/joinchat")) return "telegram_group";
	if (url.includes("t.me/")) return "telegram_channel";
	if (url.includes("discord.gg")) return "discord_invite";

	// Detectar esquemas personalizados (external_app)
	const schemeMatch = url.match(/^([a-z][a-z0-9+.-]*):/);
	if (schemeMatch && schemeMatch[1] !== "http" && schemeMatch[1] !== "https") {
		return "external_app";
	}

	return "custom";
}

/**
 * Extraer código de un link especial
 */
export function extractSpecialLinkCode(url: string): {
	type: SpecialLinkType;
	code: string;
} | null {
	const type = detectSpecialLinkType(url);
	const template = SPECIAL_LINK_TEMPLATES[type];

	if (template.extractCode) {
		const code = template.extractCode(url);
		if (code) {
			return { type, code };
		}
	}

	return null;
}

/**
 * Generar URL desde tipo y código
 */
export function generateSpecialLinkUrl(
	type: SpecialLinkType,
	code: string,
): string {
	const template = SPECIAL_LINK_TEMPLATES[type];
	return template.urlPattern(code);
}

/**
 * Obtener formato de visualización
 */
export function getSpecialLinkDisplay(
	type: SpecialLinkType,
	code: string,
): string {
	const template = SPECIAL_LINK_TEMPLATES[type];
	return template.displayFormat(code);
}
