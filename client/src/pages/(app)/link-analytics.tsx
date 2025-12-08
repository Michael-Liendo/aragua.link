import { useQuery } from "@tanstack/react-query";
import {
	ArrowLeft,
	BarChart3,
	Globe,
	MapPin,
	Monitor,
	MousePointerClick,
	Tag,
	TrendingUp,
	Users,
} from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
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
		<div className="container mx-auto p-4 sm:p-6 max-w-7xl">
			{/* Header */}
			<div className="mb-6 sm:mb-8">
				<Link to={PrivateRoutesEnum.Links}>
					<Button variant="ghost" className="mb-3 sm:mb-4 -ml-2 sm:ml-0">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Volver a Enlaces
					</Button>
				</Link>
				<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
					<div className="min-w-0 overflow-hidden">
						<h1 className="text-xl sm:text-3xl font-bold flex items-center gap-2">
							<BarChart3 className="h-5 w-5 sm:h-8 sm:w-8 shrink-0" />
							<span className="truncate">Analytics: {link.title}</span>
						</h1>
						<p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base truncate">
							{window.location.origin}/{link.short_code}
						</p>
					</div>
					<Badge
						variant={link.is_active ? "default" : "secondary"}
						className="self-start shrink-0"
					>
						{link.is_active ? "Activo" : "Inactivo"}
					</Badge>
				</div>
			</div>

			{/* Stats Overview */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6">
						<CardTitle className="text-xs sm:text-sm font-medium">
							Total Clicks
						</CardTitle>
						<MousePointerClick className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent className="px-3 sm:px-6">
						<div className="text-xl sm:text-2xl font-bold">
							{analytics.total_clicks}
						</div>
						<p className="text-[10px] sm:text-xs text-muted-foreground">
							Todos los clicks
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6">
						<CardTitle className="text-xs sm:text-sm font-medium">
							Clicks Únicos
						</CardTitle>
						<Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent className="px-3 sm:px-6">
						<div className="text-xl sm:text-2xl font-bold">
							{analytics.unique_clicks}
						</div>
						<p className="text-[10px] sm:text-xs text-muted-foreground">
							Visitantes únicos
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6">
						<CardTitle className="text-xs sm:text-sm font-medium">
							Conversión
						</CardTitle>
						<TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent className="px-3 sm:px-6">
						<div className="text-xl sm:text-2xl font-bold">
							{analytics.total_clicks > 0
								? Math.round(
										(analytics.unique_clicks / analytics.total_clicks) * 100,
									)
								: 0}
							%
						</div>
						<p className="text-[10px] sm:text-xs text-muted-foreground">
							Únicos vs totales
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6">
						<CardTitle className="text-xs sm:text-sm font-medium">
							Último Click
						</CardTitle>
						<BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent className="px-3 sm:px-6">
						<div className="text-xs sm:text-sm font-bold">
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
						<p className="text-[10px] sm:text-xs text-muted-foreground">
							Actividad reciente
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Charts Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
				{/* Top Countries */}
				<Card>
					<CardHeader className="pb-2 sm:pb-6">
						<CardTitle className="flex items-center gap-2 text-base sm:text-lg">
							<Globe className="h-4 w-4 sm:h-5 sm:w-5" />
							Top Países
						</CardTitle>
					</CardHeader>
					<CardContent className="px-3 sm:px-6">
						{analytics.top_countries.length > 0 ? (
							<div className="space-y-3 sm:space-y-4">
								{analytics.top_countries.map((item, idx) => (
									<div
										key={idx}
										className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2"
									>
										<div className="flex items-center gap-2 min-w-0 flex-1">
											<span className="font-medium text-sm shrink-0">
												{idx + 1}.
											</span>
											<span className="truncate text-sm">
												{item.country || "Desconocido"}
											</span>
										</div>
										<div className="flex items-center gap-2 pl-5 sm:pl-0">
											<div className="flex-1 sm:w-20 bg-muted rounded-full h-2">
												<div
													className="bg-primary h-2 rounded-full"
													style={{
														width: `${(item.clicks / analytics.total_clicks) * 100}%`,
													}}
												/>
											</div>
											<span className="font-semibold w-10 text-right text-sm">
												{item.clicks}
											</span>
										</div>
									</div>
								))}
							</div>
						) : (
							<p className="text-muted-foreground text-center py-8 text-sm">
								No hay datos disponibles
							</p>
						)}
					</CardContent>
				</Card>

				{/* Top Cities */}
				<Card>
					<CardHeader className="pb-2 sm:pb-6">
						<CardTitle className="flex items-center gap-2 text-base sm:text-lg">
							<MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
							Top Ciudades
						</CardTitle>
					</CardHeader>
					<CardContent className="px-3 sm:px-6">
						{analytics.top_cities.length > 0 ? (
							<div className="space-y-3 sm:space-y-4">
								{analytics.top_cities.map((item, idx) => (
									<div
										key={idx}
										className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2"
									>
										<div className="flex items-center gap-2 min-w-0 flex-1">
											<span className="font-medium text-sm shrink-0">
												{idx + 1}.
											</span>
											<span className="truncate text-sm">
												{item.city || "Desconocido"}
											</span>
										</div>
										<div className="flex items-center gap-2 pl-5 sm:pl-0">
											<div className="flex-1 sm:w-20 bg-muted rounded-full h-2">
												<div
													className="bg-primary h-2 rounded-full"
													style={{
														width: `${(item.clicks / analytics.total_clicks) * 100}%`,
													}}
												/>
											</div>
											<span className="font-semibold w-10 text-right text-sm">
												{item.clicks}
											</span>
										</div>
									</div>
								))}
							</div>
						) : (
							<p className="text-muted-foreground text-center py-8 text-sm">
								No hay datos disponibles
							</p>
						)}
					</CardContent>
				</Card>

				{/* Top Devices */}
				<Card>
					<CardHeader className="pb-2 sm:pb-6">
						<CardTitle className="flex items-center gap-2 text-base sm:text-lg">
							<Monitor className="h-4 w-4 sm:h-5 sm:w-5" />
							Dispositivos
						</CardTitle>
					</CardHeader>
					<CardContent className="px-2 sm:px-6">
						{analytics.top_devices.length > 0 ? (
							<div className="h-52 sm:h-64">
								<ResponsiveContainer width="100%" height="100%">
									<PieChart>
										<Pie
											data={analytics.top_devices.map((item) => ({
												name: item.device_type || "Desconocido",
												value: item.clicks,
											}))}
											cx="50%"
											cy="50%"
											labelLine={false}
											label={({ name, percent }) =>
												`${name}: ${(percent * 100).toFixed(0)}%`
											}
											outerRadius={
												typeof window !== "undefined" && window.innerWidth < 640
													? 60
													: 80
											}
											fill="#8884d8"
											dataKey="value"
										>
											{analytics.top_devices.map((_entry, index) => (
												<Cell
													key={`cell-${index}`}
													fill={
														[
															"#f59e0b", // Amber
															"#f97316", // Orange
															"#10b981", // Green
															"#3b82f6", // Blue
															"#a855f7", // Purple
															"#ef4444", // Red
															"#06b6d4", // Cyan
															"#8b5cf6", // Violet
														][index % 8]
													}
												/>
											))}
										</Pie>
										<Tooltip
											contentStyle={{
												backgroundColor: "hsl(var(--background))",
												border: "1px solid hsl(var(--border))",
												borderRadius: "6px",
												fontSize: "12px",
											}}
										/>
									</PieChart>
								</ResponsiveContainer>
							</div>
						) : (
							<p className="text-muted-foreground text-center py-8 text-sm">
								No hay datos disponibles
							</p>
						)}
					</CardContent>
				</Card>

				{/* Top Browsers */}
				<Card>
					<CardHeader className="pb-2 sm:pb-6">
						<CardTitle className="flex items-center gap-2 text-base sm:text-lg">
							<Monitor className="h-4 w-4 sm:h-5 sm:w-5" />
							Navegadores
						</CardTitle>
					</CardHeader>
					<CardContent className="px-2 sm:px-6">
						{analytics.top_browsers.length > 0 ? (
							<div className="h-52 sm:h-64">
								<ResponsiveContainer width="100%" height="100%">
									<PieChart>
										<Pie
											data={analytics.top_browsers.map((item) => ({
												name: item.browser || "Desconocido",
												value: item.clicks,
											}))}
											cx="50%"
											cy="50%"
											labelLine={false}
											label={({ name, percent }) =>
												`${name}: ${(percent * 100).toFixed(0)}%`
											}
											outerRadius={
												typeof window !== "undefined" && window.innerWidth < 640
													? 60
													: 80
											}
											fill="#8884d8"
											dataKey="value"
										>
											{analytics.top_browsers.map((_entry, index) => (
												<Cell
													key={`cell-${index}`}
													fill={
														[
															"#3b82f6", // Blue
															"#f97316", // Orange
															"#ef4444", // Red
															"#10b981", // Green
															"#a855f7", // Purple
															"#06b6d4", // Cyan
															"#f59e0b", // Amber
															"#8b5cf6", // Violet
														][index % 8]
													}
												/>
											))}
										</Pie>
										<Tooltip
											contentStyle={{
												backgroundColor: "hsl(var(--background))",
												border: "1px solid hsl(var(--border))",
												borderRadius: "6px",
												fontSize: "12px",
											}}
										/>
									</PieChart>
								</ResponsiveContainer>
							</div>
						) : (
							<p className="text-muted-foreground text-center py-8 text-sm">
								No hay datos disponibles
							</p>
						)}
					</CardContent>
				</Card>

				{/* Top Referrers */}
				<Card>
					<CardHeader className="pb-2 sm:pb-6">
						<CardTitle className="flex items-center gap-2 text-base sm:text-lg">
							<Globe className="h-4 w-4 sm:h-5 sm:w-5" />
							Top Referrers
						</CardTitle>
					</CardHeader>
					<CardContent className="px-3 sm:px-6">
						{analytics.top_referrers.length > 0 ? (
							<div className="space-y-3 sm:space-y-4">
								{analytics.top_referrers.map((item, idx) => (
									<div
										key={idx}
										className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2"
									>
										<div className="flex items-center gap-2 min-w-0 flex-1">
											<span className="font-medium text-sm shrink-0">
												{idx + 1}.
											</span>
											<span className="truncate text-sm">
												{item.referrer_domain || "Directo"}
											</span>
										</div>
										<div className="flex items-center gap-2 pl-5 sm:pl-0">
											<div className="flex-1 sm:w-20 bg-muted rounded-full h-2">
												<div
													className="bg-primary h-2 rounded-full"
													style={{
														width: `${(item.clicks / analytics.total_clicks) * 100}%`,
													}}
												/>
											</div>
											<span className="font-semibold w-10 text-right text-sm">
												{item.clicks}
											</span>
										</div>
									</div>
								))}
							</div>
						) : (
							<p className="text-muted-foreground text-center py-8 text-sm">
								No hay datos disponibles
							</p>
						)}
					</CardContent>
				</Card>

				{/* UTM Sources */}
				<Card>
					<CardHeader className="pb-2 sm:pb-6">
						<CardTitle className="flex items-center gap-2 text-base sm:text-lg">
							<Tag className="h-4 w-4 sm:h-5 sm:w-5" />
							UTM Sources
						</CardTitle>
					</CardHeader>
					<CardContent className="px-3 sm:px-6">
						{analytics.top_utm_sources.length > 0 ? (
							<div className="space-y-3 sm:space-y-4">
								{analytics.top_utm_sources.map((item, idx) => (
									<div
										key={idx}
										className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2"
									>
										<div className="flex items-center gap-2 min-w-0 flex-1">
											<span className="font-medium text-sm shrink-0">
												{idx + 1}.
											</span>
											<span className="truncate text-sm">
												{item.utm_source}
											</span>
										</div>
										<div className="flex items-center gap-2 pl-5 sm:pl-0">
											<div className="flex-1 sm:w-20 bg-muted rounded-full h-2">
												<div
													className="bg-amber-500 h-2 rounded-full"
													style={{
														width: `${(item.clicks / analytics.total_clicks) * 100}%`,
													}}
												/>
											</div>
											<span className="font-semibold w-10 text-right text-sm">
												{item.clicks}
											</span>
										</div>
									</div>
								))}
							</div>
						) : (
							<p className="text-muted-foreground text-center py-8 text-sm">
								No hay datos disponibles
							</p>
						)}
					</CardContent>
				</Card>

				{/* UTM Mediums */}
				<Card>
					<CardHeader className="pb-2 sm:pb-6">
						<CardTitle className="flex items-center gap-2 text-base sm:text-lg">
							<Tag className="h-4 w-4 sm:h-5 sm:w-5" />
							UTM Mediums
						</CardTitle>
					</CardHeader>
					<CardContent className="px-3 sm:px-6">
						{analytics.top_utm_mediums.length > 0 ? (
							<div className="space-y-3 sm:space-y-4">
								{analytics.top_utm_mediums.map((item, idx) => (
									<div
										key={idx}
										className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2"
									>
										<div className="flex items-center gap-2 min-w-0 flex-1">
											<span className="font-medium text-sm shrink-0">
												{idx + 1}.
											</span>
											<span className="truncate text-sm">
												{item.utm_medium}
											</span>
										</div>
										<div className="flex items-center gap-2 pl-5 sm:pl-0">
											<div className="flex-1 sm:w-20 bg-muted rounded-full h-2">
												<div
													className="bg-green-500 h-2 rounded-full"
													style={{
														width: `${(item.clicks / analytics.total_clicks) * 100}%`,
													}}
												/>
											</div>
											<span className="font-semibold w-10 text-right text-sm">
												{item.clicks}
											</span>
										</div>
									</div>
								))}
							</div>
						) : (
							<p className="text-muted-foreground text-center py-8 text-sm">
								No hay datos disponibles
							</p>
						)}
					</CardContent>
				</Card>

				{/* UTM Campaigns */}
				<Card>
					<CardHeader className="pb-2 sm:pb-6">
						<CardTitle className="flex items-center gap-2 text-base sm:text-lg">
							<Tag className="h-4 w-4 sm:h-5 sm:w-5" />
							UTM Campaigns
						</CardTitle>
					</CardHeader>
					<CardContent className="px-3 sm:px-6">
						{analytics.top_utm_campaigns.length > 0 ? (
							<div className="space-y-3 sm:space-y-4">
								{analytics.top_utm_campaigns.map((item, idx) => (
									<div
										key={idx}
										className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2"
									>
										<div className="flex items-center gap-2 min-w-0 flex-1">
											<span className="font-medium text-sm shrink-0">
												{idx + 1}.
											</span>
											<span className="truncate text-sm">
												{item.utm_campaign}
											</span>
										</div>
										<div className="flex items-center gap-2 pl-5 sm:pl-0">
											<div className="flex-1 sm:w-20 bg-muted rounded-full h-2">
												<div
													className="bg-purple-500 h-2 rounded-full"
													style={{
														width: `${(item.clicks / analytics.total_clicks) * 100}%`,
													}}
												/>
											</div>
											<span className="font-semibold w-10 text-right text-sm">
												{item.clicks}
											</span>
										</div>
									</div>
								))}
							</div>
						) : (
							<p className="text-muted-foreground text-center py-8 text-sm">
								No hay datos disponibles
							</p>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Clicks by Day Chart */}
			<Card>
				<CardHeader className="pb-2 sm:pb-6">
					<CardTitle className="flex items-center gap-2 text-base sm:text-lg">
						<TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
						Clicks por Día (Últimos 30 días)
					</CardTitle>
				</CardHeader>
				<CardContent className="px-2 sm:px-6">
					{analytics.clicks_by_day.length > 0 ? (
						<div className="h-64 sm:h-80">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart
									data={analytics.clicks_by_day.map((item) => ({
										date: new Date(item.date).toLocaleDateString("es-ES", {
											month: "short",
											day: "numeric",
										}),
										clicks: item.clicks,
										fullDate: new Date(item.date).toLocaleDateString("es-ES"),
									}))}
									margin={{ top: 20, right: 10, left: -10, bottom: 5 }}
								>
									<CartesianGrid
										strokeDasharray="3 3"
										className="stroke-muted"
									/>
									<XAxis
										dataKey="date"
										tick={{ fontSize: 10 }}
										interval="preserveStartEnd"
									/>
									<YAxis tick={{ fontSize: 10 }} width={35} />
									<Tooltip
										contentStyle={{
											backgroundColor: "hsl(var(--background))",
											border: "1px solid hsl(var(--border))",
											borderRadius: "6px",
											fontSize: "12px",
										}}
										labelStyle={{ color: "hsl(var(--foreground))" }}
									/>
									<Bar dataKey="clicks" fill="#f97316" radius={[4, 4, 0, 0]} />
								</BarChart>
							</ResponsiveContainer>
						</div>
					) : (
						<p className="text-muted-foreground text-center py-8 text-sm">
							No hay datos disponibles
						</p>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
