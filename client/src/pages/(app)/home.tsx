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
		<div className="p-3 sm:p-6">
			<h1 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2">
				Bienvenido a AraguaLink{user?.first_name ? `, ${user.first_name}` : ""}
			</h1>
			<p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">
				Acorta URLs y crea tu página de enlaces personalizada
			</p>

			{user?.plan === "FREE" && (
				<Card className="mb-6 border-2 border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
					<CardHeader className="px-4 sm:px-6 pb-2 sm:pb-6">
						<div className="flex items-start sm:items-center gap-2">
							<Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
							<CardTitle className="text-amber-900 dark:text-amber-400 text-base sm:text-lg">
								¿Quieres ser Usuario Premium?
							</CardTitle>
						</div>
						<CardDescription className="text-amber-800 dark:text-amber-300 text-sm">
							Desbloquea todas las funcionalidades premium y lleva tus enlaces
							al siguiente nivel
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4 px-4 sm:px-6">
						<div className="grid gap-3">
							<p className="text-sm text-amber-900 dark:text-amber-200 font-medium">
								Contáctanos para actualizar tu plan:
							</p>
							<div className="flex flex-col gap-2 sm:gap-3">
								<Button
									variant="outline"
									className="flex items-center justify-center gap-2 border-amber-600 text-amber-900 hover:bg-amber-100 dark:border-amber-500 dark:text-amber-400 dark:hover:bg-amber-950/40 text-sm h-9 sm:h-10"
									asChild
								>
									<a href="mailto:contacto@aragua.link">
										<Mail className="h-4 w-4 shrink-0" />
										<span className="truncate">contacto@aragua.link</span>
									</a>
								</Button>
								<Button
									variant="outline"
									className="flex items-center justify-center gap-2 border-amber-600 text-amber-900 hover:bg-amber-100 dark:border-amber-500 dark:text-amber-400 dark:hover:bg-amber-950/40 text-sm h-9 sm:h-10"
									asChild
								>
									<a
										href="https://wa.me/584149409930"
										target="_blank"
										rel="noopener noreferrer"
									>
										<Phone className="h-4 w-4 shrink-0" />
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

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
				<a
					href={PrivateRoutesEnum.Links}
					className="border rounded-lg p-4 sm:p-6 hover:shadow-lg transition-shadow"
				>
					<Link2 className="w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 text-primary" />
					<h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
						Acorta URLs
					</h3>
					<p className="text-muted-foreground text-sm sm:text-base">
						Crea enlaces cortos y personalizados para compartir fácilmente
					</p>
				</a>

				<a
					href={PrivateRoutesEnum.Links}
					className="border rounded-lg p-4 sm:p-6 hover:shadow-lg transition-shadow"
				>
					<QrCode className="w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 text-primary" />
					<h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
						Códigos QR
					</h3>
					<p className="text-muted-foreground text-sm sm:text-base">
						Genera códigos QR automáticamente para tus enlaces
					</p>
				</a>

				<div className="border rounded-lg p-4 sm:p-6 hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
					<BarChart3 className="w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 text-primary" />
					<h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
						Analytics
					</h3>
					<p className="text-muted-foreground text-sm sm:text-base">
						Rastrea clicks y analiza el rendimiento de tus enlaces
					</p>
				</div>
			</div>
		</div>
	);
}

export default Home;
