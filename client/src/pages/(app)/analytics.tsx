import { useQuery } from "@tanstack/react-query";
import {
	BarChart3,
	Check,
	Download,
	Link2,
	Loader2,
	MousePointerClick,
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
				["Posición", "Título", "Código Corto", "Clics"],
				...analytics.top_links.map((link, index) => [
					index + 1,
					link.title,
					link.short_code,
					link.clicks,
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
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Mis Métricas</h1>
					<p className="text-muted-foreground mt-1">
						Vista general de tus enlaces y estadísticas
					</p>
				</div>
				<Button
					onClick={handleExportToExcel}
					className="flex items-center gap-2"
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
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<BarChart3 className="h-5 w-5" />
						Estadísticas de Clics
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-4">
						<div className="space-y-1">
							<p className="text-sm font-medium text-muted-foreground">Hoy</p>
							<p className="text-2xl font-bold">{analytics.clicks_today}</p>
						</div>
						<div className="space-y-1">
							<p className="text-sm font-medium text-muted-foreground">
								Última Semana
							</p>
							<p className="text-2xl font-bold">{analytics.clicks_this_week}</p>
						</div>
						<div className="space-y-1">
							<p className="text-sm font-medium text-muted-foreground">
								Último Mes
							</p>
							<p className="text-2xl font-bold">
								{analytics.clicks_this_month}
							</p>
						</div>
						<div className="space-y-1">
							<p className="text-sm font-medium text-muted-foreground">
								Total Histórico
							</p>
							<p className="text-2xl font-bold">{analytics.total_clicks}</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Charts Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Clicks Distribution */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<MousePointerClick className="h-5 w-5" />
							Distribución de Clics
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="h-80">
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
										outerRadius={100}
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
										}}
									/>
								</PieChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>

				{/* Top Links */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<TrendingUp className="h-5 w-5" />
							Top Enlaces
						</CardTitle>
					</CardHeader>
					<CardContent>
						{analytics.top_links.length > 0 ? (
							<div className="space-y-4">
								{analytics.top_links.map((link, idx) => (
									<div
										key={link.link_id}
										className="flex items-center justify-between"
									>
										<div className="flex items-center gap-2 flex-1 min-w-0">
											<span className="font-medium">{idx + 1}.</span>
											<div className="flex flex-col min-w-0">
												<span className="font-medium truncate">
													{link.title}
												</span>
												<span className="text-xs text-muted-foreground">
													/{link.short_code}
												</span>
											</div>
										</div>
										<div className="flex items-center gap-2">
											<div className="w-32 bg-muted rounded-full h-2">
												<div
													className="bg-primary h-2 rounded-full"
													style={{
														width: `${analytics.total_clicks > 0 ? (link.clicks / analytics.total_clicks) * 100 : 0}%`,
													}}
												/>
											</div>
											<span className="font-semibold w-12 text-right">
												{link.clicks}
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

			{/* Period Comparison Chart */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<BarChart3 className="h-5 w-5" />
						Comparación por Período
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="h-80">
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
								margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
							>
								<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
								<XAxis dataKey="periodo" tick={{ fontSize: 12 }} />
								<YAxis tick={{ fontSize: 12 }} />
								<Tooltip
									contentStyle={{
										backgroundColor: "hsl(var(--background))",
										border: "1px solid hsl(var(--border))",
										borderRadius: "6px",
									}}
									labelStyle={{ color: "hsl(var(--foreground))" }}
								/>
								<Bar
									dataKey="clicks"
									radius={[8, 8, 0, 0]}
									label={{ position: "top" }}
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
