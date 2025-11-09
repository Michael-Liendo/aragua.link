import { BarChart3, Link2, Mail, Phone, QrCode, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { PrivateRoutesEnum } from "@/data/routesEnums";
import { useAuth } from "@/features/auth";

function Home() {
	const { user } = useAuth();

	return (
		<div className="p-6">
			<h1 className="text-3xl font-bold mb-2">
				Bienvenido a AraguaLink{user?.first_name ? `, ${user.first_name}` : ""}
			</h1>
			<p className="text-muted-foreground mb-8">
				Acorta URLs y crea tu página de enlaces personalizada
			</p>

			{user?.plan === "FREE" && (
				<Card className="mb-6 border-2 border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
					<CardHeader>
						<div className="flex items-center gap-2">
							<Sparkles className="h-6 w-6 text-amber-600 dark:text-amber-400" />
							<CardTitle className="text-amber-900 dark:text-amber-400">
								¿Quieres ser Usuario Premium?
							</CardTitle>
						</div>
						<CardDescription className="text-amber-800 dark:text-amber-300">
							Desbloquea todas las funcionalidades premium y lleva tus enlaces
							al siguiente nivel
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-3">
							<p className="text-sm text-amber-900 dark:text-amber-200 font-medium">
								Contáctanos para actualizar tu plan:
							</p>
							<div className="flex flex-col sm:flex-row gap-3">
								<Button
									variant="outline"
									className="flex items-center gap-2 border-amber-600 text-amber-900 hover:bg-amber-100 dark:border-amber-500 dark:text-amber-400 dark:hover:bg-amber-950/40"
									asChild
								>
									<a href="mailto:contacto@aragua.link">
										<Mail className="h-4 w-4" />
										contacto@aragua.link
									</a>
								</Button>
								<Button
									variant="outline"
									className="flex items-center gap-2 border-amber-600 text-amber-900 hover:bg-amber-100 dark:border-amber-500 dark:text-amber-400 dark:hover:bg-amber-950/40"
									asChild
								>
									<a
										href="https://wa.me/584149409930"
										target="_blank"
										rel="noopener noreferrer"
									>
										<Phone className="h-4 w-4" />
										+58 414-9409930
									</a>
								</Button>
							</div>
						</div>
						<div className="pt-3 border-t border-amber-200 dark:border-amber-800">
							<p className="text-xs text-amber-700 dark:text-amber-400">
								💎 Plan Premium incluye: Analytics avanzados, enlaces
								ilimitados, personalización completa y soporte prioritario
							</p>
						</div>
					</CardContent>
				</Card>
			)}

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
				<a
					href={PrivateRoutesEnum.Links}
					className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
				>
					<Link2 className="w-12 h-12 mb-4 text-primary" />
					<h3 className="text-xl font-semibold mb-2">Acorta URLs</h3>
					<p className="text-muted-foreground">
						Crea enlaces cortos y personalizados para compartir fácilmente
					</p>
				</a>

				<a
					href={PrivateRoutesEnum.Links}
					className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
				>
					<QrCode className="w-12 h-12 mb-4 text-primary" />
					<h3 className="text-xl font-semibold mb-2">Códigos QR</h3>
					<p className="text-muted-foreground">
						Genera códigos QR automáticamente para tus enlaces
					</p>
				</a>

				<div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
					<BarChart3 className="w-12 h-12 mb-4 text-primary" />
					<h3 className="text-xl font-semibold mb-2">Analytics</h3>
					<p className="text-muted-foreground">
						Rastrea clicks y analiza el rendimiento de tus enlaces
					</p>
				</div>
			</div>
		</div>
	);
}

export default Home;
