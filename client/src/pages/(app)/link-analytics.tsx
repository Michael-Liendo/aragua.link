import { useQuery } from "@tanstack/react-query";
import {
	ArrowLeft,
	BarChart3,
	Globe,
	Lock,
	MapPin,
	Monitor,
	MousePointerClick,
	TrendingUp,
	Users,
} from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrivateRoutesEnum } from "@/data/routesEnums";
import { useAuth } from "@/features/auth";
import { useSEO } from "@/features/seo";
import Services from "@/services";

export default function LinkAnalyticsPage() {
	const { linkId } = useParams<{ linkId: string }>();
	const { user } = useAuth();
	useSEO({ title: "Analytics del Enlace" });

	// Check if user has FREE plan
	const isFree = user?.plan === "FREE";

	// Fetch link details
	const { data: link } = useQuery({
		queryKey: ["link", linkId],
		queryFn: () => Services.links.getOne(linkId!),
		enabled: !!linkId && !isFree,
	});

	// Fetch analytics
	const { data: analytics, isLoading } = useQuery({
		queryKey: ["analytics", linkId],
		queryFn: () => Services.analytics.getLinkAnalytics(linkId!),
		enabled: !!linkId && !isFree,
	});

	// Redirect FREE users
	if (isFree) {
		return <Navigate to={PrivateRoutesEnum.Links} replace />;
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
			</div>
		);
	}

	if (!analytics || !link) {
		return (
			<div className="container mx-auto p-6 max-w-7xl">
				<div className="text-center py-12">
					<h2 className="text-2xl font-bold mb-4">No se encontraron datos</h2>
					<Link to={PrivateRoutesEnum.Links}>
						<Button>Volver a Enlaces</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-6 max-w-7xl">
			{/* Header */}
			<div className="mb-8">
				<Link to={PrivateRoutesEnum.Links}>
					<Button variant="ghost" className="mb-4">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Volver a Enlaces
					</Button>
				</Link>
				<div className="flex items-start justify-between">
					<div>
						<h1 className="text-3xl font-bold flex items-center gap-2">
							<BarChart3 className="h-8 w-8" />
							Analytics: {link.title}
						</h1>
						<p className="text-muted-foreground mt-2">
							{window.location.origin}/{link.short_code}
						</p>
					</div>
					<Badge variant={link.is_active ? "default" : "secondary"}>
						{link.is_active ? "Activo" : "Inactivo"}
					</Badge>
				</div>
			</div>

			{/* Stats Overview */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
						<MousePointerClick className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{analytics.total_clicks}</div>
						<p className="text-xs text-muted-foreground">
							Todos los clicks registrados
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Clicks Únicos</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{analytics.unique_clicks}</div>
						<p className="text-xs text-muted-foreground">Visitantes únicos</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Tasa de Conversión
						</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{analytics.total_clicks > 0
								? Math.round(
										(analytics.unique_clicks / analytics.total_clicks) * 100,
									)
								: 0}
							%
						</div>
						<p className="text-xs text-muted-foreground">Únicos vs totales</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Último Click</CardTitle>
						<BarChart3 className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-sm font-bold">
							{analytics.last_clicked_at
								? new Date(analytics.last_clicked_at).toLocaleDateString(
										"es-ES",
										{
											year: "numeric",
											month: "short",
											day: "numeric",
											hour: "2-digit",
											minute: "2-digit",
										},
									)
								: "Nunca"}
						</div>
						<p className="text-xs text-muted-foreground">
							Actividad más reciente
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Charts Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
				{/* Top Countries */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Globe className="h-5 w-5" />
							Top Países
						</CardTitle>
					</CardHeader>
					<CardContent>
						{analytics.top_countries.length > 0 ? (
							<div className="space-y-4">
								{analytics.top_countries.map((item, idx) => (
									<div key={idx} className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<span className="font-medium">{idx + 1}.</span>
											<span>{item.country || "Desconocido"}</span>
										</div>
										<div className="flex items-center gap-2">
											<div className="w-32 bg-muted rounded-full h-2">
												<div
													className="bg-primary h-2 rounded-full"
													style={{
														width: `${(item.clicks / analytics.total_clicks) * 100}%`,
													}}
												/>
											</div>
											<span className="font-semibold w-12 text-right">
												{item.clicks}
											</span>
										</div>
									</div>
								))}
							</div>
						) : (
							<p className="text-muted-foreground text-center py-8">
								No hay datos disponibles
							</p>
						)}
					</CardContent>
				</Card>

				{/* Top Cities */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<MapPin className="h-5 w-5" />
							Top Ciudades
						</CardTitle>
					</CardHeader>
					<CardContent>
						{analytics.top_cities.length > 0 ? (
							<div className="space-y-4">
								{analytics.top_cities.map((item, idx) => (
									<div key={idx} className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<span className="font-medium">{idx + 1}.</span>
											<span>{item.city || "Desconocido"}</span>
										</div>
										<div className="flex items-center gap-2">
											<div className="w-32 bg-muted rounded-full h-2">
												<div
													className="bg-primary h-2 rounded-full"
													style={{
														width: `${(item.clicks / analytics.total_clicks) * 100}%`,
													}}
												/>
											</div>
											<span className="font-semibold w-12 text-right">
												{item.clicks}
											</span>
										</div>
									</div>
								))}
							</div>
						) : (
							<p className="text-muted-foreground text-center py-8">
								No hay datos disponibles
							</p>
						)}
					</CardContent>
				</Card>

				{/* Top Devices */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Monitor className="h-5 w-5" />
							Dispositivos
						</CardTitle>
					</CardHeader>
					<CardContent>
						{analytics.top_devices.length > 0 ? (
							<div className="space-y-4">
								{analytics.top_devices.map((item, idx) => (
									<div key={idx} className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<span className="font-medium">{idx + 1}.</span>
											<span className="capitalize">
												{item.device_type || "Desconocido"}
											</span>
										</div>
										<div className="flex items-center gap-2">
											<div className="w-32 bg-muted rounded-full h-2">
												<div
													className="bg-primary h-2 rounded-full"
													style={{
														width: `${(item.clicks / analytics.total_clicks) * 100}%`,
													}}
												/>
											</div>
											<span className="font-semibold w-12 text-right">
												{item.clicks}
											</span>
										</div>
									</div>
								))}
							</div>
						) : (
							<p className="text-muted-foreground text-center py-8">
								No hay datos disponibles
							</p>
						)}
					</CardContent>
				</Card>

				{/* Top Browsers */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Monitor className="h-5 w-5" />
							Navegadores
						</CardTitle>
					</CardHeader>
					<CardContent>
						{analytics.top_browsers.length > 0 ? (
							<div className="space-y-4">
								{analytics.top_browsers.map((item, idx) => (
									<div key={idx} className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<span className="font-medium">{idx + 1}.</span>
											<span>{item.browser || "Desconocido"}</span>
										</div>
										<div className="flex items-center gap-2">
											<div className="w-32 bg-muted rounded-full h-2">
												<div
													className="bg-primary h-2 rounded-full"
													style={{
														width: `${(item.clicks / analytics.total_clicks) * 100}%`,
													}}
												/>
											</div>
											<span className="font-semibold w-12 text-right">
												{item.clicks}
											</span>
										</div>
									</div>
								))}
							</div>
						) : (
							<p className="text-muted-foreground text-center py-8">
								No hay datos disponibles
							</p>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Clicks by Day Chart */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<TrendingUp className="h-5 w-5" />
						Clicks por Día (Últimos 30 días)
					</CardTitle>
				</CardHeader>
				<CardContent>
					{analytics.clicks_by_day.length > 0 ? (
						<div className="h-64 flex items-end justify-between gap-1">
							{analytics.clicks_by_day.map((item, idx) => {
								const maxClicks = Math.max(
									...analytics.clicks_by_day.map((d) => d.clicks),
								);
								const height =
									maxClicks > 0 ? (item.clicks / maxClicks) * 100 : 0;

								return (
									<div
										key={idx}
										className="flex-1 flex flex-col items-center gap-2"
									>
										<div className="relative w-full group">
											<div
												className="bg-primary rounded-t hover:bg-primary/80 transition-all cursor-pointer"
												style={{ height: `${height}%`, minHeight: "4px" }}
											/>
											<div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
												{item.clicks} clicks
												<br />
												{new Date(item.date).toLocaleDateString("es-ES", {
													month: "short",
													day: "numeric",
												})}
											</div>
										</div>
										{idx % 5 === 0 && (
											<span className="text-xs text-muted-foreground">
												{new Date(item.date).toLocaleDateString("es-ES", {
													month: "short",
													day: "numeric",
												})}
											</span>
										)}
									</div>
								);
							})}
						</div>
					) : (
						<p className="text-muted-foreground text-center py-8">
							No hay datos disponibles
						</p>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
