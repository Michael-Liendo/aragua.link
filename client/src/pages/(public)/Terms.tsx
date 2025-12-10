import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PublicRoutesEnum } from "@/data/routesEnums";
import { useSEO } from "@/features/seo";

export default function TermsPage() {
	useSEO({
		title: "Términos y Condiciones - AraguaLink",
		description:
			"Términos y condiciones de uso de AraguaLink. Lee nuestros términos de servicio antes de usar nuestra plataforma.",
	});

	return (
		<div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
			{/* Header */}
			<header className="container mx-auto px-4 py-6 border-b border-amber-200 dark:border-gray-700">
				<Link to={PublicRoutesEnum.Landing}>
					<Button variant="ghost" className="mb-4">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Volver al inicio
					</Button>
				</Link>
				<div className="flex items-center gap-3">
					<img
						src="/logo-removebg.png"
						alt="AraguaLink"
						className="w-12 h-12 drop-shadow-md"
					/>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
						Términos y Condiciones
					</h1>
				</div>
			</header>

			{/* Content */}
			<div className="container mx-auto px-4 py-8 max-w-4xl">
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 md:p-8 space-y-6">
					<p className="text-sm text-gray-600 dark:text-gray-400">
						Última actualización:{" "}
						{new Date().toLocaleDateString("es-ES", {
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</p>

					<section className="space-y-4">
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
							1. Aceptación de los Términos
						</h2>
						<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
							Al acceder y utilizar AraguaLink, aceptas estar sujeto a estos
							Términos y Condiciones de Uso. Si no estás de acuerdo con alguna
							parte de estos términos, no debes utilizar nuestro servicio.
						</p>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
							2. Descripción del Servicio
						</h2>
						<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
							AraguaLink es una plataforma web que permite a los usuarios
							acortar URLs, crear páginas de enlaces personalizadas, generar
							códigos QR y analizar el rendimiento de sus enlaces. Ofrecemos
							planes gratuitos y de pago con diferentes niveles de
							funcionalidad.
						</p>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
							3. Cuentas de Usuario
						</h2>
						<div className="space-y-2 text-gray-700 dark:text-gray-300 leading-relaxed">
							<p>
								3.1. Para utilizar ciertas funciones de AraguaLink, debes crear
								una cuenta proporcionando información precisa y completa.
							</p>
							<p>
								3.2. Eres responsable de mantener la confidencialidad de tu
								contraseña y de todas las actividades que ocurran bajo tu
								cuenta.
							</p>
							<p>
								3.3. Debes notificarnos inmediatamente sobre cualquier uso no
								autorizado de tu cuenta.
							</p>
						</div>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
							4. Uso Aceptable
						</h2>
						<div className="space-y-2 text-gray-700 dark:text-gray-300 leading-relaxed">
							<p>4.1. No debes utilizar AraguaLink para:</p>
							<ul className="list-disc list-inside ml-4 space-y-1">
								<li>
									Publicar, transmitir o compartir contenido ilegal,
									difamatorio, ofensivo, obsceno o que viole los derechos de
									terceros
								</li>
								<li>Distribuir malware, virus o código malicioso</li>
								<li>Realizar actividades de phishing, spam o fraude</li>
								<li>Violar cualquier ley o regulación aplicable</li>
								<li>
									Interferir con el funcionamiento del servicio o acceder a él
									de manera no autorizada
								</li>
							</ul>
							<p>
								4.2. Nos reservamos el derecho de suspender o terminar tu cuenta
								si violas estos términos.
							</p>
						</div>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
							5. Contenido del Usuario
						</h2>
						<div className="space-y-2 text-gray-700 dark:text-gray-300 leading-relaxed">
							<p>
								5.1. Conservas todos los derechos sobre el contenido que
								proporcionas a través de AraguaLink.
							</p>
							<p>
								5.2. Al utilizar nuestro servicio, nos otorgas una licencia
								limitada para usar, almacenar y procesar tu contenido solo para
								proporcionar y mejorar nuestros servicios.
							</p>
							<p>
								5.3. Eres responsable del contenido que publiques y garantizas
								que tienes todos los derechos necesarios para hacerlo.
							</p>
						</div>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
							6. Planes y Pagos
						</h2>
						<div className="space-y-2 text-gray-700 dark:text-gray-300 leading-relaxed">
							<p>
								6.1. Ofrecemos planes gratuitos y de pago. Los planes de pago se
								facturan mensualmente.
							</p>
							<p>
								6.2. Puedes cancelar tu suscripción en cualquier momento, pero
								no se realizarán reembolsos por períodos ya pagados.
							</p>
							<p>
								6.3. Nos reservamos el derecho de modificar nuestros precios con
								un aviso previo de 30 días.
							</p>
						</div>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
							7. Propiedad Intelectual
						</h2>
						<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
							Todos los derechos de propiedad intelectual relacionados con
							AraguaLink, incluyendo pero no limitado a marcas, logos, diseño y
							software, son propiedad nuestra o de nuestros licenciantes. No
							puedes copiar, modificar o distribuir nuestro contenido sin
							autorización previa por escrito.
						</p>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
							8. Limitación de Responsabilidad
						</h2>
						<div className="space-y-2 text-gray-700 dark:text-gray-300 leading-relaxed">
							<p>
								8.1. AraguaLink se proporciona "tal cual" sin garantías de
								ningún tipo, expresas o implícitas.
							</p>
							<p>
								8.2. No seremos responsables de ningún daño indirecto,
								incidental, especial o consecuente que resulte del uso o la
								imposibilidad de usar nuestro servicio.
							</p>
							<p>
								8.3. Nuestra responsabilidad total no excederá el monto que
								hayas pagado por nuestros servicios en los últimos 12 meses.
							</p>
						</div>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
							9. Modificaciones del Servicio
						</h2>
						<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
							Nos reservamos el derecho de modificar, suspender o discontinuar
							cualquier aspecto de AraguaLink en cualquier momento, con o sin
							aviso previo. No seremos responsables contigo ni con ningún
							tercero por cualquier modificación, suspensión o discontinuación
							del servicio.
						</p>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
							10. Terminación
						</h2>
						<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
							Puedes terminar tu cuenta en cualquier momento. Nos reservamos el
							derecho de suspender o terminar tu acceso al servicio
							inmediatamente, sin previo aviso, si violas estos términos o por
							cualquier otra razón a nuestra sola discreción.
						</p>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
							11. Ley Aplicable
						</h2>
						<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
							Estos términos se regirán e interpretarán de acuerdo con las leyes
							de Venezuela. Cualquier disputa que surja de estos términos será
							sometida a la jurisdicción exclusiva de los tribunales competentes
							de Venezuela.
						</p>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
							12. Contacto
						</h2>
						<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
							Si tienes preguntas sobre estos Términos y Condiciones, puedes
							contactarnos a través de:
						</p>
						<ul className="list-disc list-inside ml-4 space-y-1 text-gray-700 dark:text-gray-300">
							<li>Email: contacto@aragua.link</li>
							<li>WhatsApp: +58 414-9409930</li>
						</ul>
					</section>
				</div>
			</div>
		</div>
	);
}
