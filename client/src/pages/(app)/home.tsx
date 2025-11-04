import { BarChart3, Link2, QrCode } from "lucide-react";
import { useAuth } from "@/features/auth";

function Home() {
	const { user } = useAuth();

	return (
		<div className="p-6">
			<h1 className="text-3xl font-bold mb-2">
				Bienvenido a AragualLink{user?.first_name ? `, ${user.first_name}` : ""}
			</h1>
			<p className="text-muted-foreground mb-8">
				Acorta URLs y crea tu página de enlaces personalizada
			</p>

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
