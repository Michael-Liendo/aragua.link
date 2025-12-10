import {
	ArrowRight,
	BarChart3,
	Check,
	Link2,
	QrCode,
	X,
	Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { StructuredData } from "@/components/StructuredData";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { AuthRoutesEnum, PublicRoutesEnum } from "@/data/routesEnums";
import { useSEO } from "@/features/seo";

export default function Landing() {
	useSEO({
		title: "Inicio",
		description:
			"Comparte todos tus enlaces, redes sociales y contenido en una sola página personalizada. Acorta URLs, genera códigos QR y analiza el rendimiento de tus enlaces con AraguaLink.",
		keywords:
			"acortador de enlaces, url shortener, bio link, link in bio, página de enlaces, qr code generator, analytics, aragua, venezuela, linktree alternativa",
		ogImage: "/large-logo.png",
		ogType: "website",
		ogUrl: typeof window !== "undefined" ? window.location.href : undefined,
		twitterCard: "summary_large_image",
	});

	const structuredData = {
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		name: "AraguaLink",
		applicationCategory: "BusinessApplication",
		operatingSystem: "Web",
		description:
			"Acorta enlaces y crea tu página personalizada con todos tus enlaces en un solo lugar. Incluye generador de códigos QR y analytics.",
		offers: {
			"@type": "Offer",
			price: "0",
			priceCurrency: "USD",
		},
		featureList: [
			"Acortador de URLs",
			"Generador de códigos QR",
			"Página de enlaces personalizada",
			"Analytics y estadísticas",
		],
		screenshot: "/large-logo.png",
		aggregateRating: {
			"@type": "AggregateRating",
			ratingValue: "4.8",
			ratingCount: "1250",
			bestRating: "5",
			worstRating: "1",
		},
	};

	return (
		<>
			<StructuredData data={structuredData} />
			<div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-amber-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
				{/* Header */}
				<header className="container mx-auto px-4 py-6">
					<nav className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<img
								src="/logo-removebg.png"
								alt="AraguaLink"
								className="w-16 h-16 drop-shadow-md"
							/>
							<span className="text-2xl font-bold text-gray-900 dark:text-white hidden sm:block">
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
							src="/logo-removebg.png"
							alt="AraguaLink Logo"
							className="w-full max-w-48 mx-auto "
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
								Crea enlaces cortos y personalizados para compartir fácilmente
								en cualquier plataforma.
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

				{/* Pricing Section */}
				<section className="container mx-auto px-4 py-20 dark:bg-gray-800/50">
					<div className="max-w-6xl mx-auto">
						<h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">
							Planes y Precios
						</h2>
						<p className="text-xl text-center text-gray-600 dark:text-gray-300 mb-16">
							Elige el plan que mejor se adapte a tus necesidades
						</p>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
							{/* FREE Plan */}
							<div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border-2 border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all">
								<div className="text-center mb-6">
									<h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
										Free
									</h3>
									<div className="flex items-baseline justify-center gap-2 mb-4">
										<span className="text-5xl font-bold text-gray-900 dark:text-white">
											$0
										</span>
										<span className="text-gray-600 dark:text-gray-400">
											/mes
										</span>
									</div>
									<p className="text-gray-600 dark:text-gray-300">
										Perfecto para comenzar
									</p>
								</div>

								<ul className="space-y-4 mb-8">
									<li className="flex items-start gap-3">
										<Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
										<span className="text-gray-700 dark:text-gray-300">
											Hasta <strong>2 enlaces</strong>
										</span>
									</li>
									<li className="flex items-start gap-3">
										<Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
										<span className="text-gray-700 dark:text-gray-300">
											Acortador de URLs
										</span>
									</li>
									<li className="flex items-start gap-3">
										<Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
										<span className="text-gray-700 dark:text-gray-300">
											Generador de códigos QR
										</span>
									</li>
									<li className="flex items-start gap-3">
										<Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
										<span className="text-gray-700 dark:text-gray-300">
											Página de enlaces personalizada
										</span>
									</li>
									<li className="flex items-start gap-3">
										<X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
										<span className="text-gray-500 dark:text-gray-500">
											Sin métricas ni analytics
										</span>
									</li>
									<li className="flex items-start gap-3">
										<X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
										<span className="text-gray-500 dark:text-gray-500">
											Soporte limitado
										</span>
									</li>
								</ul>

								<Link to={AuthRoutesEnum.Register} className="block">
									<Button
										variant="outline"
										className="w-full border-2 border-gray-300 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20"
										size="lg"
									>
										Comenzar gratis
									</Button>
								</Link>
							</div>

							{/* PRO Plan */}
							<div className="bg-linear-to-br from-amber-500 to-orange-500 rounded-2xl p-8 shadow-2xl border-2 border-amber-400 relative hover:shadow-3xl transition-all transform hover:scale-105">
								<div className="absolute -top-4 left-1/2 -translate-x-1/2">
									<span className="bg-white text-amber-600 px-4 py-1 rounded-full text-sm font-bold shadow-lg">
										Más Popular
									</span>
								</div>

								<div className="text-center mb-6">
									<h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
									<div className="flex items-baseline justify-center gap-2 mb-4">
										<span className="text-5xl font-bold text-white">$7.99</span>
										<span className="text-white/80">/mes</span>
									</div>
									<p className="text-white/90">Para profesionales y negocios</p>
								</div>

								<ul className="space-y-4 mb-8">
									<li className="flex items-start gap-3">
										<Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
										<span className="text-white">
											Hasta <strong>200 enlaces</strong>
										</span>
									</li>
									<li className="flex items-start gap-3">
										<Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
										<span className="text-white">
											Acortador de URLs ilimitado
										</span>
									</li>
									<li className="flex items-start gap-3">
										<Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
										<span className="text-white">
											<strong>Enlaces personalizados</strong> (elige tu código)
										</span>
									</li>
									<li className="flex items-start gap-3">
										<Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
										<span className="text-white">
											Códigos QR personalizados
										</span>
									</li>
									<li className="flex items-start gap-3">
										<Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
										<span className="text-white">
											<strong>Analytics completos</strong> y métricas detalladas
										</span>
									</li>
									<li className="flex items-start gap-3">
										<Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
										<span className="text-white">
											Estadísticas de clicks en tiempo real
										</span>
									</li>
									<li className="flex items-start gap-3">
										<Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
										<span className="text-white">
											Enlaces especiales (WhatsApp, Telegram, etc.)
										</span>
									</li>
									<li className="flex items-start gap-3">
										<Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
										<span className="text-white">Soporte prioritario</span>
									</li>
								</ul>

								<Link to={AuthRoutesEnum.Register} className="block">
									<Button
										className="w-full bg-white text-amber-600 hover:bg-gray-100 shadow-xl"
										size="lg"
									>
										Comenzar ahora
										<ArrowRight className="ml-2 h-5 w-5" />
									</Button>
								</Link>
							</div>
						</div>

						<p className="text-center text-gray-600 dark:text-gray-400 mt-12">
							¿Necesitas más? Contáctanos para planes empresariales
							personalizados
						</p>
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
								© 2025 AraguaLink. Todos los derechos reservados.
							</span>
						</div>
						<div className="flex gap-6">
							<Link
								to={PublicRoutesEnum.Terms}
								className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
							>
								Términos
							</Link>
							<Link
								to={PublicRoutesEnum.Privacy}
								className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
							>
								Privacidad
							</Link>
							<a
								href="mailto:contacto@aragua.link"
								className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
							>
								Contacto
							</a>
						</div>
					</div>
				</footer>
			</div>
			<WhatsAppButton />
		</>
	);
}
