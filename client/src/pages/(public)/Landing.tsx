import { ArrowRight, BarChart3, Link2, QrCode, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthRoutesEnum } from "@/data/routesEnums";
import { useSEO } from "@/features/seo";

export default function Landing() {
	useSEO({
		title: "Acorta tus enlaces y crea tu página personalizada",
	});

	return (
		<div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-amber-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
			{/* Header */}
			<header className="container mx-auto px-4 py-6">
				<nav className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<img
							src="/logo.png"
							alt="AraguaLink"
							className="w-10 h-10 drop-shadow-md"
						/>
						<span className="text-2xl font-bold text-gray-900 dark:text-white">
							AraguaLink
						</span>
					</div>
					<div className="flex items-center gap-4">
						<Link to={AuthRoutesEnum.Login}>
							<Button
								variant="ghost"
								className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400"
							>
								Iniciar sesión
							</Button>
						</Link>
						<Link to={AuthRoutesEnum.Register}>
							<Button className="bg-amber-500 hover:bg-amber-600 text-white shadow-lg">
								Comenzar gratis
							</Button>
						</Link>
					</div>
				</nav>
			</header>

			{/* Hero Section */}
			<section className="container mx-auto px-4 py-20 text-center">
				<div className="max-w-4xl mx-auto">
					<img
						src="/large-logo.png"
						alt="AraguaLink Logo"
						className="w-full max-w-2xl mx-auto mb-8 drop-shadow-2xl"
					/>
					<h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
						Todo lo que necesitas en un solo enlace
					</h1>
					<p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
						Comparte todos tus enlaces, redes sociales y contenido en una sola
						página personalizada. Simple, rápido y profesional.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
						<Link to={AuthRoutesEnum.Register}>
							<Button
								size="lg"
								className="bg-amber-500 hover:bg-amber-600 text-white text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all duration-200"
							>
								Crear mi página gratis
								<ArrowRight className="ml-2 h-5 w-5" />
							</Button>
						</Link>
						<Link to={AuthRoutesEnum.Login}>
							<Button
								size="lg"
								variant="outline"
								className="border-2 border-amber-500 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20 text-lg px-8 py-6"
							>
								Ver demo
							</Button>
						</Link>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="container mx-auto px-4 py-20">
				<h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
					Características principales
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
					<div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
						<div className="bg-amber-100 dark:bg-amber-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-6">
							<Link2 className="w-8 h-8 text-amber-600 dark:text-amber-400" />
						</div>
						<h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
							Acorta URLs
						</h3>
						<p className="text-gray-600 dark:text-gray-300">
							Crea enlaces cortos y personalizados para compartir fácilmente en
							cualquier plataforma.
						</p>
					</div>

					<div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
						<div className="bg-amber-100 dark:bg-amber-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-6">
							<QrCode className="w-8 h-8 text-amber-600 dark:text-amber-400" />
						</div>
						<h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
							Códigos QR
						</h3>
						<p className="text-gray-600 dark:text-gray-300">
							Genera códigos QR automáticamente para cada enlace y facilita el
							acceso desde dispositivos móviles.
						</p>
					</div>

					<div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
						<div className="bg-amber-100 dark:bg-amber-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-6">
							<BarChart3 className="w-8 h-8 text-amber-600 dark:text-amber-400" />
						</div>
						<h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
							Analytics
						</h3>
						<p className="text-gray-600 dark:text-gray-300">
							Rastrea clicks, analiza el rendimiento y conoce mejor a tu
							audiencia con estadísticas detalladas.
						</p>
					</div>

					<div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
						<div className="bg-amber-100 dark:bg-amber-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-6">
							<Zap className="w-8 h-8 text-amber-600 dark:text-amber-400" />
						</div>
						<h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
							Rápido y fácil
						</h3>
						<p className="text-gray-600 dark:text-gray-300">
							Configura tu página en minutos. Sin complicaciones, sin código,
							solo resultados profesionales.
						</p>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="container mx-auto px-4 py-20">
				<div className="bg-linear-to-r from-amber-500 to-orange-500 rounded-3xl p-12 md:p-16 text-center shadow-2xl max-w-4xl mx-auto">
					<h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
						¿Listo para comenzar?
					</h2>
					<p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
						Únete a miles de usuarios que ya están compartiendo sus enlaces de
						manera profesional con AraguaLink.
					</p>
					<Link to={AuthRoutesEnum.Register}>
						<Button
							size="lg"
							className="bg-white text-amber-600 hover:bg-gray-100 text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all duration-200"
						>
							Crear cuenta gratuita
							<ArrowRight className="ml-2 h-5 w-5" />
						</Button>
					</Link>
				</div>
			</section>

			{/* Footer */}
			<footer className="container mx-auto px-4 py-8 border-t border-gray-200 dark:border-gray-700">
				<div className="flex flex-col md:flex-row justify-between items-center gap-4">
					<div className="flex items-center gap-3">
						<img
							src="/logo.png"
							alt="AraguaLink"
							className="w-8 h-8 drop-shadow-md"
						/>
						<span className="text-gray-600 dark:text-gray-400">
							© 2024 AraguaLink. Todos los derechos reservados.
						</span>
					</div>
					<div className="flex gap-6">
						<button
							type="button"
							className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
						>
							Términos
						</button>
						<button
							type="button"
							className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
						>
							Privacidad
						</button>
						<button
							type="button"
							className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
						>
							Contacto
						</button>
					</div>
				</div>
			</footer>
		</div>
	);
}
