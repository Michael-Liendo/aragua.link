import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import customFetch from "@/utils/fetch";

export default function RedirectPage() {
	const { shortCode } = useParams<{ shortCode: string }>();
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const redirect = async () => {
			if (!shortCode) {
				setError("Código de enlace no válido");
				return;
			}

			try {
				// Obtener información del link desde el backend usando fetch personalizado
				const response = await customFetch(`/links/s/${shortCode}`);
				const data = await response.json();

				if (!data.success || !data.data?.url) {
					setError("Enlace no disponible");
					return;
				}

				// Extraer UTM parameters de la URL actual
				const urlParams = new URLSearchParams(window.location.search);

				// Enviar tracking al backend (sin esperar respuesta)
				customFetch(`/links/r/${shortCode}?${urlParams.toString()}`, {
					method: "GET",
				}).catch(() => {
					// Ignorar errores de tracking, no debe bloquear la redirección
				});

				// Redirigir inmediatamente al destino
				window.location.href = data.data.url;
			} catch (err) {
				console.error("Error redirecting:", err);
				setError("Enlace no encontrado");
			}
		};

		redirect();
	}, [shortCode]);

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
				<div className="text-center p-8">
					<div className="mb-6">
						<img
							src="/logo.png"
							alt="AraguaLink Logo"
							className="w-24 h-24 mx-auto drop-shadow-lg"
						/>
					</div>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
						{error}
					</h1>
					<p className="text-gray-600 dark:text-gray-400 mb-6">
						El enlace que buscas no existe o ha sido desactivado
					</p>
					<a
						href="/"
						className="inline-block px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors"
					>
						Ir al inicio
					</a>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
			<div className="text-center">
				<div className="mb-6">
					<img
						src="/logo.png"
						alt="AraguaLink Logo"
						className="w-24 h-24 mx-auto drop-shadow-lg animate-pulse"
					/>
				</div>
				<h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
					Redirigiendo...
				</h2>
				<p className="text-gray-600 dark:text-gray-400">
					Serás redirigido en un momento
				</p>
				<div className="mt-6">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto" />
				</div>
			</div>
		</div>
	);
}
