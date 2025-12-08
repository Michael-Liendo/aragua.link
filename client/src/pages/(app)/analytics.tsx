import { useQuery } from "@tanstack/react-query";
import {
	BarChart3,
	Check,
	Download,
	Link2,
	Loader2,
	MousePointerClick,
	Tag,
	TrendingUp,
} from "lucide-react";
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
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSEO } from "@/features/seo";
import { toast } from "@/features/ui/useToast";
import Services from "@/services";

export default function AnalyticsPage() {
	useSEO({ title: "Mis Métricas" });

	// Fetch user analytics
	const { data: analytics, isLoading } = useQuery({
		queryKey: ["userAnalytics"],
		queryFn: () => Services.analytics.getUserAnalytics(),
	});

	const handleExportToExcel = () => {
		if (!analytics) return;

		// Crear un nuevo libro de trabajo
		const wb = XLSX.utils.book_new();

		// Hoja 1: Resumen General
		const summaryData = [
			["AraguaLink - Mis Métricas"],
			["Fecha de generación:", new Date().toLocaleDateString("es-ES")],
			[""],
			["RESUMEN GENERAL"],
			["Total de enlaces:", analytics.total_links],
			["Total de clics:", analytics.total_clicks],
			["Clics únicos:", analytics.unique_clicks],
			["Clics hoy:", analytics.clicks_today],
			["Clics esta semana:", analytics.clicks_this_week],
			["Clics este mes:", analytics.clicks_this_month],
			[""],
			["ESTADÍSTICAS"],
			[
				"Promedio de clics por enlace:",
				analytics.total_links > 0
					? (analytics.total_clicks / analytics.total_links).toFixed(2)
					: 0,
			],
			[
				"Tasa de clics únicos:",
				analytics.total_clicks > 0
					? `${((analytics.unique_clicks / analytics.total_clicks) * 100).toFixed(1)}%`
					: "0%",
			],
		];
		const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
		XLSX.utils.book_append_sheet(wb, ws1, "Resumen General");

		// Hoja 2: Top Enlaces
		if (analytics.top_links.length > 0) {
			const topLinksData = [
				["Posición", "Título", "Código Corto", "Clics", "Porcentaje"],
				...analytics.top_links.map((link, index) => [
					index + 1,
					link.title,
					link.short_code,
					link.clicks,
					analytics.total_clicks > 0
						? `${((link.clicks / analytics.total_clicks) * 100).toFixed(1)}%`
						: "0%",
				]),
			];
			const ws2 = XLSX.utils.aoa_to_sheet(topLinksData);
			XLSX.utils.book_append_sheet(wb, ws2, "Top Enlaces");
		}

		// Hoja 3: Estadísticas por Período
		const periodStats = [
			["Período", "Cantidad de Clics"],
			["Hoy", analytics.clicks_today],
			["Esta Semana", analytics.clicks_this_week],
			["Este Mes", analytics.clicks_this_month],
			["Total Histórico", analytics.total_clicks],
		];
		const ws3 = XLSX.utils.aoa_to_sheet(periodStats);
		XLSX.utils.book_append_sheet(wb, ws3, "Estadísticas por Período");

		// Hoja 4: Top Países
		if (analytics.top_countries.length > 0) {
			const topCountriesData = [
				["Posición", "País", "Código", "Clics", "Porcentaje"],
				...analytics.top_countries.map((country, index) => [
					index + 1,
					country.country,
					country.country_code,
					country.clicks,
					analytics.total_clicks > 0
						? `${((country.clicks / analytics.total_clicks) * 100).toFixed(1)}%`
						: "0%",
				]),
			];
			const ws4 = XLSX.utils.aoa_to_sheet(topCountriesData);
			XLSX.utils.book_append_sheet(wb, ws4, "Top Países");
		}

		// Hoja 5: Top Ciudades
		if (analytics.top_cities.length > 0) {
			const topCitiesData = [
				["Posición", "Ciudad", "País", "Clics", "Porcentaje"],
				...analytics.top_cities.map((city, index) => [
					index + 1,
					city.city,
					city.country,
					city.clicks,
					analytics.total_clicks > 0
						? `${((city.clicks / analytics.total_clicks) * 100).toFixed(1)}%`
						: "0%",
				]),
			];
			const ws5 = XLSX.utils.aoa_to_sheet(topCitiesData);
			XLSX.utils.book_append_sheet(wb, ws5, "Top Ciudades");
		}

		// Hoja 6: Dispositivos
		if (analytics.top_devices.length > 0) {
			const topDevicesData = [
				["Tipo de Dispositivo", "Clics", "Porcentaje"],
				...analytics.top_devices.map((device) => [
					device.device_type,
					device.clicks,
					analytics.total_clicks > 0
						? `${((device.clicks / analytics.total_clicks) * 100).toFixed(1)}%`
						: "0%",
				]),
			];
			const ws6 = XLSX.utils.aoa_to_sheet(topDevicesData);
			XLSX.utils.book_append_sheet(wb, ws6, "Dispositivos");
		}

		// Hoja 7: Navegadores
		if (analytics.top_browsers.length > 0) {
			const topBrowsersData = [
				["Posición", "Navegador", "Clics", "Porcentaje"],
				...analytics.top_browsers.map((browser, index) => [
					index + 1,
					browser.browser,
					browser.clicks,
					analytics.total_clicks > 0
						? `${((browser.clicks / analytics.total_clicks) * 100).toFixed(1)}%`
						: "0%",
				]),
			];
			const ws7 = XLSX.utils.aoa_to_sheet(topBrowsersData);
			XLSX.utils.book_append_sheet(wb, ws7, "Navegadores");
		}

		// Hoja 8: Referrers
		if (analytics.top_referrers.length > 0) {
			const topReferrersData = [
				["Posición", "Dominio Referrer", "Clics", "Porcentaje"],
				...analytics.top_referrers.map((referrer, index) => [
					index + 1,
					referrer.referrer_domain,
					referrer.clicks,
					analytics.total_clicks > 0
						? `${((referrer.clicks / analytics.total_clicks) * 100).toFixed(1)}%`
						: "0%",
				]),
			];
			const ws8 = XLSX.utils.aoa_to_sheet(topReferrersData);
			XLSX.utils.book_append_sheet(wb, ws8, "Referrers");
		}

		// Hoja 9: UTM Sources
		if (analytics.top_utm_sources.length > 0) {
			const topUtmSourcesData = [
				["Posición", "UTM Source", "Clics", "Porcentaje"],
				...analytics.top_utm_sources.map((source, index) => [
					index + 1,
					source.utm_source,
					source.clicks,
					analytics.total_clicks > 0
						? `${((source.clicks / analytics.total_clicks) * 100).toFixed(1)}%`
						: "0%",
				]),
			];
			const ws9 = XLSX.utils.aoa_to_sheet(topUtmSourcesData);
			XLSX.utils.book_append_sheet(wb, ws9, "UTM Sources");
		}

		// Hoja 10: UTM Mediums
		if (analytics.top_utm_mediums.length > 0) {
			const topUtmMediumsData = [
				["Posición", "UTM Medium", "Clics", "Porcentaje"],
				...analytics.top_utm_mediums.map((medium, index) => [
					index + 1,
					medium.utm_medium,
					medium.clicks,
					analytics.total_clicks > 0
						? `${((medium.clicks / analytics.total_clicks) * 100).toFixed(1)}%`
						: "0%",
				]),
			];
			const ws10 = XLSX.utils.aoa_to_sheet(topUtmMediumsData);
			XLSX.utils.book_append_sheet(wb, ws10, "UTM Mediums");
		}

		// Hoja 11: UTM Campaigns
		if (analytics.top_utm_campaigns.length > 0) {
			const topUtmCampaignsData = [
				["Posición", "UTM Campaign", "Clics", "Porcentaje"],
				...analytics.top_utm_campaigns.map((campaign, index) => [
					index + 1,
					campaign.utm_campaign,
					campaign.clicks,
					analytics.total_clicks > 0
						? `${((campaign.clicks / analytics.total_clicks) * 100).toFixed(1)}%`
						: "0%",
				]),
			];
			const ws11 = XLSX.utils.aoa_to_sheet(topUtmCampaignsData);
			XLSX.utils.book_append_sheet(wb, ws11, "UTM Campaigns");
		}

		// Hoja 12: Clicks por Día (Últimos 30 días)
		if (analytics.clicks_by_day.length > 0) {
			const clicksByDayData = [
				["Fecha", "Clics"],
				...analytics.clicks_by_day.map((day) => [
					new Date(day.date).toLocaleDateString("es-ES"),
					day.clicks,
				]),
			];
			const ws9 = XLSX.utils.aoa_to_sheet(clicksByDayData);
			XLSX.utils.book_append_sheet(wb, ws9, "Clicks por Día");
		}

		// Generar el archivo
		const fileName = `Mis_Metricas_${new Date().toISOString().split("T")[0]}.xlsx`;
		XLSX.writeFile(wb, fileName);

		toast({
			description: (
				<div className="flex items-center justify-between w-full space-x-4">
					<Check className="text-green-600 ml-auto" />
					<span>Métricas exportadas exitosamente</span>
				</div>
			),
		});
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<Loader2 className="w-8 h-8 animate-spin text-purple-600" />
			</div>
		);
	}

	if (!analytics) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-red-600 mb-2">
						Error al cargar métricas
					</h1>
					<p className="text-muted-foreground">
						No se pudieron cargar tus métricas
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4 sm:space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl sm:text-3xl font-bold">Mis Métricas</h1>
					<p className="text-muted-foreground mt-1 text-sm sm:text-base">
						Vista general de tus enlaces y estadísticas
					</p>
				</div>
				<Button
					onClick={handleExportToExcel}
					className="flex items-center gap-2 w-full sm:w-auto"
				>
					<Download className="w-4 h-4" />
					Exportar a Excel
				</Button>
			</div>

			{/* Main Stats */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Enlaces</CardTitle>
						<Link2 className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{analytics.total_links}</div>
						<p className="text-xs text-muted-foreground mt-1">
							Enlaces creados
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Clics</CardTitle>
						<MousePointerClick className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{analytics.total_clicks}</div>
						<p className="text-xs text-muted-foreground mt-1">
							Todos los clics
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Clics Únicos</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{analytics.unique_clicks}</div>
						<p className="text-xs text-muted-foreground mt-1">
							Visitantes únicos
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Promedio por Enlace
						</CardTitle>
						<BarChart3 className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{analytics.total_links > 0
								? (analytics.total_clicks / analytics.total_links).toFixed(1)
								: 0}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							Clics por enlace
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Clicks Stats */}
			<Card>
				<CardHeader className="pb-2 sm:pb-6">
					<CardTitle className="flex items-center gap-2 text-base sm:text-lg">
						<BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
						Estadísticas de Clics
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
						<div className="space-y-1">
							<p className="text-xs sm:text-sm font-medium text-muted-foreground">
								Hoy
							</p>
							<p className="text-xl sm:text-2xl font-bold">
								{analytics.clicks_today}
							</p>
						</div>
						<div className="space-y-1">
							<p className="text-xs sm:text-sm font-medium text-muted-foreground">
								Última Semana
							</p>
							<p className="text-xl sm:text-2xl font-bold">
								{analytics.clicks_this_week}
							</p>
						</div>
						<div className="space-y-1">
							<p className="text-xs sm:text-sm font-medium text-muted-foreground">
								Último Mes
							</p>
							<p className="text-xl sm:text-2xl font-bold">
								{analytics.clicks_this_month}
							</p>
						</div>
						<div className="space-y-1">
							<p className="text-xs sm:text-sm font-medium text-muted-foreground">
								Total Histórico
							</p>
							<p className="text-xl sm:text-2xl font-bold">
								{analytics.total_clicks}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Charts Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
				{/* Clicks Distribution */}
				<Card>
					<CardHeader className="pb-2 sm:pb-6">
						<CardTitle className="flex items-center gap-2 text-base sm:text-lg">
							<MousePointerClick className="h-4 w-4 sm:h-5 sm:w-5" />
							Distribución de Clics
						</CardTitle>
					</CardHeader>
					<CardContent className="px-2 sm:px-6">
						<div className="h-64 sm:h-80">
							<ResponsiveContainer width="100%" height="100%">
								<PieChart>
									<Pie
										data={[
											{
												name: "Hoy",
												value: analytics.clicks_today,
											},
											{
												name: "Esta Semana",
												value:
													analytics.clicks_this_week - analytics.clicks_today,
											},
											{
												name: "Este Mes",
												value:
													analytics.clicks_this_month -
													analytics.clicks_this_week,
											},
											{
												name: "Anteriores",
												value:
													analytics.total_clicks - analytics.clicks_this_month,
											},
										].filter((item) => item.value > 0)}
										cx="50%"
										cy="50%"
										labelLine={false}
										label={({ name, percent }) =>
											`${name}: ${(percent * 100).toFixed(0)}%`
										}
										outerRadius={
											typeof window !== "undefined" && window.innerWidth < 640
												? 70
												: 100
										}
										fill="#8884d8"
										dataKey="value"
									>
										{[0, 1, 2, 3].map((index) => (
											<Cell
												key={`cell-${index}`}
												fill={
													[
														"#10b981", // Green for Today
														"#3b82f6", // Blue for This Week
														"#f59e0b", // Amber for This Month
														"#a855f7", // Purple for Previous
													][index]
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
					</CardContent>
				</Card>

				{/* Top Links */}
				<Card>
					<CardHeader className="pb-2 sm:pb-6">
						<CardTitle className="flex items-center gap-2 text-base sm:text-lg">
							<TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
							Top Enlaces
						</CardTitle>
					</CardHeader>
					<CardContent className="px-3 sm:px-6">
						{analytics.top_links.length > 0 ? (
							<div className="space-y-3 sm:space-y-4">
								{analytics.top_links.map((link, idx) => (
									<div
										key={link.link_id}
										className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2"
									>
										<div className="flex items-center gap-2 flex-1 min-w-0">
											<span className="font-medium text-sm shrink-0">
												{idx + 1}.
											</span>
											<div className="flex flex-col min-w-0 overflow-hidden">
												<span className="font-medium truncate text-sm">
													{link.title}
												</span>
												<span className="text-xs text-muted-foreground">
													/{link.short_code}
												</span>
											</div>
										</div>
										<div className="flex items-center gap-2 pl-5 sm:pl-0">
											<div className="flex-1 sm:w-24 bg-muted rounded-full h-2">
												<div
													className="bg-primary h-2 rounded-full"
													style={{
														width: `${analytics.total_clicks > 0 ? (link.clicks / analytics.total_clicks) * 100 : 0}%`,
													}}
												/>
											</div>
											<span className="font-semibold w-10 text-right text-sm">
												{link.clicks}
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

			{/* UTM Parameters Grid */}
			<div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
								{analytics.top_utm_sources.slice(0, 5).map((item, idx) => (
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
											<div className="flex-1 sm:w-16 bg-muted rounded-full h-2">
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
								{analytics.top_utm_mediums.slice(0, 5).map((item, idx) => (
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
											<div className="flex-1 sm:w-16 bg-muted rounded-full h-2">
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
								{analytics.top_utm_campaigns.slice(0, 5).map((item, idx) => (
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
											<div className="flex-1 sm:w-16 bg-muted rounded-full h-2">
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

			{/* Period Comparison Chart */}
			<Card>
				<CardHeader className="pb-2 sm:pb-6">
					<CardTitle className="flex items-center gap-2 text-base sm:text-lg">
						<BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
						Comparación por Período
					</CardTitle>
				</CardHeader>
				<CardContent className="px-2 sm:px-6">
					<div className="h-64 sm:h-80">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart
								data={[
									{
										periodo: "Hoy",
										clicks: analytics.clicks_today,
									},
									{
										periodo: "Semana",
										clicks: analytics.clicks_this_week,
									},
									{
										periodo: "Mes",
										clicks: analytics.clicks_this_month,
									},
									{
										periodo: "Total",
										clicks: analytics.total_clicks,
									},
								]}
								margin={{ top: 20, right: 10, left: -10, bottom: 5 }}
							>
								<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
								<XAxis dataKey="periodo" tick={{ fontSize: 11 }} />
								<YAxis tick={{ fontSize: 11 }} width={40} />
								<Tooltip
									contentStyle={{
										backgroundColor: "hsl(var(--background))",
										border: "1px solid hsl(var(--border))",
										borderRadius: "6px",
										fontSize: "12px",
									}}
									labelStyle={{ color: "hsl(var(--foreground))" }}
								/>
								<Bar
									dataKey="clicks"
									radius={[8, 8, 0, 0]}
									label={{ position: "top", fontSize: 10 }}
								>
									{[0, 1, 2, 3].map((index) => (
										<Cell
											key={`cell-${index}`}
											fill={
												[
													"#10b981", // Green
													"#3b82f6", // Blue
													"#f59e0b", // Amber
													"#a855f7", // Purple
												][index]
											}
										/>
									))}
								</Bar>
							</BarChart>
						</ResponsiveContainer>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
