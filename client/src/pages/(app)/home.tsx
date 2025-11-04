import { AlertCircle, BarChart3, Link2, QrCode } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
				<Alert className="mb-6 border-amber-500 bg-amber-50 dark:bg-amber-950/20">
					<AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500" />
					<AlertTitle className="text-amber-900 dark:text-amber-400 font-semibold">
						Plan Gratuito
					</AlertTitle>
					<AlertDescription className="text-amber-800 dark:text-amber-300">
						Actualmente tienes el plan gratuito. Para acceder a todas las
						funcionalidades premium, por favor contacta a un administrador para
						actualizar tu suscripción.
					</AlertDescription>
				</Alert>
			)}

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
				<div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
					<Link2 className="w-12 h-12 mb-4 text-primary" />
					<h3 className="text-xl font-semibold mb-2">Acorta URLs</h3>
					<p className="text-muted-foreground">
						Crea enlaces cortos y personalizados para compartir fácilmente
					</p>
				</div>

				<div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
					<QrCode className="w-12 h-12 mb-4 text-primary" />
					<h3 className="text-xl font-semibold mb-2">Códigos QR</h3>
					<p className="text-muted-foreground">
						Genera códigos QR automáticamente para tus enlaces
					</p>
				</div>

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
