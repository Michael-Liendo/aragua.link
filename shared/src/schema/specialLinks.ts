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
