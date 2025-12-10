import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PublicRoutesEnum } from "@/data/routesEnums";
import { useSEO } from "@/features/seo";

export default function PrivacyPage() {
	useSEO({
		title: "Política de Privacidad - AraguaLink",
		description:
			"Política de privacidad de AraguaLink. Conoce cómo recopilamos, usamos y protegemos tu información personal.",
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
						Política de Privacidad
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
							1. Introducción
						</h2>
						<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
							En AraguaLink, nos comprometemos a proteger tu privacidad y
							manejar tu información personal de manera responsable. Esta
							Política de Privacidad explica cómo recopilamos, usamos,
							compartimos y protegemos tu información cuando utilizas nuestro
							servicio.
						</p>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
							2. Información que Recopilamos
						</h2>
						<div className="space-y-3">
							<div>
								<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
									2.1. Información que Proporcionas
								</h3>
								<ul className="list-disc list-inside ml-4 space-y-1 text-gray-700 dark:text-gray-300">
									<li>
										<strong>Información de cuenta:</strong> Nombre, dirección de
										correo electrónico, contraseña (encriptada)
									</li>
									<li>
										<strong>Información de perfil:</strong> Nombre de
										visualización, biografía, avatar (opcional)
									</li>
									<li>
										<strong>Enlaces:</strong> URLs que acortas, títulos,
										descripciones y códigos personalizados
									</li>
									<li>
										<strong>Información de pago:</strong> Datos de facturación
										(procesados de forma segura a través de terceros)
									</li>
								</ul>
							</div>
							<div>
								<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
									2.2. Información que Recopilamos Automáticamente
								</h3>
								<ul className="list-disc list-inside ml-4 space-y-1 text-gray-700 dark:text-gray-300">
									<li>
										<strong>Datos de uso:</strong> Cómo interactúas con nuestro
										servicio, páginas visitadas, tiempo de permanencia
									</li>
									<li>
										<strong>Información del dispositivo:</strong> Tipo de
										dispositivo, sistema operativo, navegador
									</li>
									<li>
										<strong>Dirección IP:</strong> Para seguridad y análisis
									</li>
									<li>
										<strong>Cookies y tecnologías similares:</strong> Para
										mejorar la experiencia del usuario
									</li>
									<li>
										<strong>Datos de analytics:</strong> Información sobre
										clicks en tus enlaces, ubicación geográfica, referrers
									</li>
								</ul>
							</div>
						</div>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
							3. Cómo Usamos tu Información
						</h2>
						<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
							Utilizamos la información recopilada para:
						</p>
						<ul className="list-disc list-inside ml-4 space-y-1 text-gray-700 dark:text-gray-300">
							<li>Proporcionar, mantener y mejorar nuestros servicios</li>
							<li>
								Procesar transacciones y enviar notificaciones relacionadas
							</li>
							<li>
								Generar y proporcionar analytics y estadísticas sobre tus
								enlaces
							</li>
							<li>Enviar comunicaciones importantes sobre el servicio</li>
							<li>
								Detectar y prevenir fraudes, abusos y actividades ilegales
							</li>
							<li>
								Cumplir con obligaciones legales y hacer cumplir nuestros
								términos
							</li>
							<li>
								Personalizar tu experiencia y proporcionar soporte al cliente
							</li>
						</ul>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
							4. Compartir Información
						</h2>
						<div className="space-y-2 text-gray-700 dark:text-gray-300 leading-relaxed">
							<p>
								4.1. <strong>No vendemos tu información personal</strong> a
								terceros.
							</p>
							<p>
								4.2. Podemos compartir tu información en las siguientes
								situaciones:
							</p>
							<ul className="list-disc list-inside ml-4 space-y-1">
								<li>
									Con proveedores de servicios que nos ayudan a operar (hosting,
									procesamiento de pagos, analytics) bajo estrictos acuerdos de
									confidencialidad
								</li>
								<li>
									Cuando sea requerido por ley o para proteger nuestros derechos
									legítimos
								</li>
								<li>
									En caso de una fusión, adquisición o venta de activos (con
									notificación previa)
								</li>
								<li>Con tu consentimiento explícito</li>
							</ul>
							<p>
								4.3. La información de analytics de tus enlaces es privada y
								solo visible para ti, a menos que elijas compartirla
								públicamente.
							</p>
						</div>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
							5. Cookies y Tecnologías de Seguimiento
						</h2>
						<div className="space-y-2 text-gray-700 dark:text-gray-300 leading-relaxed">
							<p>Utilizamos cookies y tecnologías similares para:</p>
							<ul className="list-disc list-inside ml-4 space-y-1">
								<li>Mantener tu sesión activa</li>
								<li>Recordar tus preferencias</li>
								<li>Analizar el uso del servicio</li>
								<li>Proporcionar funcionalidades de seguridad</li>
							</ul>
							<p>
								Puedes controlar las cookies a través de la configuración de tu
								navegador, pero esto puede afectar la funcionalidad del
								servicio.
							</p>
						</div>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
							6. Seguridad de los Datos
						</h2>
						<div className="space-y-2 text-gray-700 dark:text-gray-300 leading-relaxed">
							<p>
								Implementamos medidas de seguridad técnicas y organizativas
								apropiadas para proteger tu información:
							</p>
							<ul className="list-disc list-inside ml-4 space-y-1">
								<li>Encriptación de datos en tránsito (HTTPS/TLS)</li>
								<li>Encriptación de contraseñas y datos sensibles en reposo</li>
								<li>Accesos restringidos y autenticación de dos factores</li>
								<li>Monitoreo regular de seguridad</li>
								<li>Respaldos regulares de datos</li>
							</ul>
							<p>
								Sin embargo, ningún método de transmisión por Internet o
								almacenamiento electrónico es 100% seguro, y no podemos
								garantizar la seguridad absoluta.
							</p>
						</div>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
							7. Retención de Datos
						</h2>
						<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
							Conservamos tu información personal mientras tu cuenta esté activa
							o según sea necesario para proporcionar nuestros servicios. Si
							eliminas tu cuenta, eliminaremos o anonimizaremos tu información
							personal, excepto cuando debamos conservarla por razones legales o
							de cumplimiento.
						</p>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
							8. Tus Derechos
						</h2>
						<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
							Tienes derecho a:
						</p>
						<ul className="list-disc list-inside ml-4 space-y-1 text-gray-700 dark:text-gray-300">
							<li>
								<strong>Acceso:</strong> Solicitar una copia de tu información
								personal
							</li>
							<li>
								<strong>Rectificación:</strong> Corregir información inexacta o
								incompleta
							</li>
							<li>
								<strong>Eliminación:</strong> Solicitar la eliminación de tu
								información personal
							</li>
							<li>
								<strong>Portabilidad:</strong> Obtener tus datos en formato
								estructurado
							</li>
							<li>
								<strong>Oposición:</strong> Oponerte al procesamiento de tu
								información en ciertos casos
							</li>
							<li>
								<strong>Revocación de consentimiento:</strong> Retirar tu
								consentimiento cuando corresponda
							</li>
						</ul>
						<p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-2">
							Para ejercer estos derechos, contáctanos a través de los medios
							indicados en la sección de Contacto.
						</p>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
							9. Menores de Edad
						</h2>
						<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
							AraguaLink no está dirigido a menores de 18 años. No recopilamos
							intencionalmente información personal de menores. Si descubrimos
							que hemos recopilado información de un menor, la eliminaremos
							inmediatamente.
						</p>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
							10. Cambios a esta Política
						</h2>
						<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
							Podemos actualizar esta Política de Privacidad ocasionalmente. Te
							notificaremos sobre cambios significativos publicando la nueva
							política en esta página y actualizando la fecha de "Última
							actualización". Te recomendamos revisar esta política
							periódicamente.
						</p>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
							11. Enlaces a Terceros
						</h2>
						<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
							Nuestro servicio puede contener enlaces a sitios web de terceros.
							No somos responsables de las prácticas de privacidad de estos
							sitios. Te recomendamos leer las políticas de privacidad de
							cualquier sitio que visites.
						</p>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
							12. Contacto
						</h2>
						<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
							Si tienes preguntas, inquietudes o solicitudes relacionadas con
							esta Política de Privacidad o el manejo de tu información
							personal, puedes contactarnos a través de:
						</p>
						<ul className="list-disc list-inside ml-4 space-y-1 text-gray-700 dark:text-gray-300 mt-2">
							<li>Email: contacto@aragua.link</li>
							<li>WhatsApp: +58 414-9409930</li>
						</ul>
					</section>
				</div>
			</div>
		</div>
	);
}
