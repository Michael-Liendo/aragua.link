import type { ZodError } from "zod";
import { toast } from "@/features/ui/useToast";

interface HttpError {
	statusCode?: number;
	error?: string;
	status?: number;
	message?: string;
	response?: {
		data?: {
			message?: string;
			statusCode?: number;
		};
		status?: number;
	};
	data?: {
		message?: string;
		statusCode?: number;
	};
}

function isZodError(error: unknown): error is ZodError {
	return (
		typeof error === "object" &&
		error !== null &&
		"issues" in error &&
		Array.isArray((error as ZodError).issues)
	);
}

export function handleApiError(error: unknown, fallback = "Ocurrió un error") {
	if (isZodError(error)) {
		const formatted = error.issues
			.map((e) => {
				const path = Array.isArray(e.path) ? e.path.join(".") : "Campo";
				return `• ${path}: ${e.message}`;
			})
			.join("\n");

		toast.error(formatted, "Error de validación");
		return;
	}

	let message = fallback;

	const err = error as HttpError;
	const status = err?.statusCode || err?.status;
	const backendMessage =
		err?.error || err?.data?.message || err?.response?.data?.message;

	if (status) {
		switch (status) {
			case 400:
				message = backendMessage || "Petición inválida.";
				break;
			case 401:
				message = "No estás autorizado.";
				break;
			case 403:
				message = "Acceso denegado.";
				break;
			case 404:
				message = "Recurso no encontrado.";
				break;
			case 409:
				message = "Conflicto de datos.";
				break;
			case 500:
				message = "Error interno del servidor.";
				break;
			default:
				message = `Error ${status}`;
		}
	} else if (backendMessage) {
		message = backendMessage;
	}

	toast.error(message, "Error");
}
