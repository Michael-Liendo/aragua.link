import type { ILink, IUser } from "@aragualink/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	BarChart3,
	Check,
	Download,
	Key,
	Link2,
	Loader2,
	MessageCircle,
	MousePointerClick,
	Palette,
	Shield,
	TrendingUp,
	Users,
	X,
} from "lucide-react";
import { useState } from "react";
import {
	Area,
	AreaChart,
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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/features/auth";
import { useSEO } from "@/features/seo";
import { toast } from "@/features/ui/useToast";
import Services from "@/services";

export default function AdminPage() {
	useSEO({ title: "Panel de Administración" });
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const [activeTab, setActiveTab] = useState("metrics");
	const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
	const [roleDialogOpen, setRoleDialogOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
	const [newPassword, setNewPassword] = useState("");
	const [newRole, setNewRole] = useState("");

	// Check if user is admin
	const isAdmin = user?.email === "michael.m.liendo.r@gmail.com";

	// Fetch dashboard metrics
	const { data: metrics, isLoading: metricsLoading } = useQuery({
		queryKey: ["adminMetrics"],
		queryFn: () => Services.admin.getDashboardMetrics(),
		enabled: isAdmin,
	});

	// Fetch users
	const { data: usersData, isLoading: usersLoading } = useQuery({
		queryKey: ["adminUsers"],
		queryFn: () => Services.admin.getAll<IUser>("users", 0, 50),
		enabled: isAdmin && activeTab === "users",
	});

	// Fetch links
	const { data: linksData, isLoading: linksLoading } = useQuery({
		queryKey: ["adminLinks"],
		queryFn: () => Services.admin.getAll<ILink>("links", 0, 50),
		enabled: isAdmin && activeTab === "links",
	});

	// Change password mutation
	const changePasswordMutation = useMutation({
		mutationFn: ({ userId, password }: { userId: string; password: string }) =>
			Services.admin.changeUserPassword(userId, password),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
			setPasswordDialogOpen(false);
			setNewPassword("");
			setSelectedUser(null);
			toast({
				description: (
					<div className="flex items-center justify-between w-full space-x-4">
						<Check className="text-green-600 ml-auto" />
						<span>Contraseña actualizada exitosamente</span>
					</div>
				),
			});
		},
		onError: (error: Error) => {
			toast({
				description: (
					<div className="flex items-center justify-between w-full space-x-4">
						<X className="text-red-600 ml-auto" />
						<span>{error.message || "Error al cambiar contraseña"}</span>
					</div>
				),
			});
		},
	});

	// Update role mutation
	const updateRoleMutation = useMutation({
		mutationFn: ({ userId, plan }: { userId: string; plan: string }) =>
			Services.admin.updateUserRole(userId, plan),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
			setRoleDialogOpen(false);
			setNewRole("");
			setSelectedUser(null);
			toast({
				description: (
					<div className="flex items-center justify-between w-full space-x-4">
						<Check className="text-green-600 ml-auto" />
						<span>Rol actualizado exitosamente</span>
					</div>
				),
			});
		},
		onError: (error: Error) => {
			toast({
				description: (
					<div className="flex items-center justify-between w-full space-x-4">
						<X className="text-red-600 ml-auto" />
						<span>{error.message || "Error al actualizar rol"}</span>
					</div>
				),
			});
		},
	});

	const handleChangePassword = () => {
		if (selectedUser && newPassword.length >= 6) {
			changePasswordMutation.mutate({
				userId: selectedUser.id,
				password: newPassword,
			});
		}
	};

	const handleUpdateRole = () => {
		if (selectedUser && newRole) {
			updateRoleMutation.mutate({
				userId: selectedUser.id,
				plan: newRole,
			});
		}
	};

	const handleExportToExcel = () => {
		if (!metrics) return;

		// Crear un nuevo libro de trabajo
		const wb = XLSX.utils.book_new();

		// Hoja 1: Resumen General
		const summaryData = [
			["AraguaLink - Reporte de Métricas"],
			["Fecha de generación:", new Date().toLocaleDateString("es-ES")],
			[""],
			["USUARIOS"],
			["Total de usuarios:", metrics.users.total],
			["Usuarios FREE:", metrics.users.free],
			["Usuarios PRO:", metrics.users.pro],
			["Usuarios ENTERPRISE:", metrics.users.enterprise],
			["Nuevos esta semana:", metrics.users.newThisWeek],
			["Nuevos este mes:", metrics.users.newThisMonth],
			[""],
			["ENLACES"],
			["Total de enlaces:", metrics.links.total],
			["Enlaces activos:", metrics.links.active],
			["Enlaces inactivos:", metrics.links.inactive],
			["WhatsApp Grupos:", metrics.links.whatsappGroups],
			["WhatsApp Chats:", metrics.links.whatsappChats],
			["Telegram Grupos:", metrics.links.telegramGroups],
			["Telegram Canales:", metrics.links.telegramChannels],
			["Discord Servers:", metrics.links.discordInvites],
			["Enlaces Custom:", metrics.links.customLinks],
			[""],
			["CLICS"],
			["Total de clics:", metrics.clicks.total],
			["Clics hoy:", metrics.clicks.today],
			["Clics esta semana:", metrics.clicks.thisWeek],
			["Clics este mes:", metrics.clicks.thisMonth],
			["Promedio por enlace:", metrics.clicks.averagePerLink],
			[""],
			["PÁGINAS BIO"],
			["Total de páginas bio:", metrics.bioPages.total],
			["Páginas bio activas:", metrics.bioPages.active],
		];
		const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
		XLSX.utils.book_append_sheet(wb, ws1, "Resumen General");

		// Hoja 2: Distribución de Usuarios
		const usersDistribution = [
			["Plan", "Cantidad", "Porcentaje"],
			[
				"FREE",
				metrics.users.free,
				`${((metrics.users.free / metrics.users.total) * 100).toFixed(1)}%`,
			],
			[
				"PRO",
				metrics.users.pro,
				`${((metrics.users.pro / metrics.users.total) * 100).toFixed(1)}%`,
			],
			[
				"ENTERPRISE",
				metrics.users.enterprise,
				`${((metrics.users.enterprise / metrics.users.total) * 100).toFixed(1)}%`,
			],
			["TOTAL", metrics.users.total, "100%"],
		];
		const ws2 = XLSX.utils.aoa_to_sheet(usersDistribution);
		XLSX.utils.book_append_sheet(wb, ws2, "Distribución Usuarios");

		// Hoja 3: Tipos de Enlaces
		const linksTypes = [
			["Tipo de Enlace", "Cantidad", "Porcentaje"],
			[
				"WhatsApp Grupos",
				metrics.links.whatsappGroups,
				`${((metrics.links.whatsappGroups / metrics.links.total) * 100).toFixed(1)}%`,
			],
			[
				"WhatsApp Chats",
				metrics.links.whatsappChats,
				`${((metrics.links.whatsappChats / metrics.links.total) * 100).toFixed(1)}%`,
			],
			[
				"Telegram Grupos",
				metrics.links.telegramGroups,
				`${((metrics.links.telegramGroups / metrics.links.total) * 100).toFixed(1)}%`,
			],
			[
				"Telegram Canales",
				metrics.links.telegramChannels,
				`${((metrics.links.telegramChannels / metrics.links.total) * 100).toFixed(1)}%`,
			],
			[
				"Discord Servers",
				metrics.links.discordInvites,
				`${((metrics.links.discordInvites / metrics.links.total) * 100).toFixed(1)}%`,
			],
			[
				"Enlaces Custom",
				metrics.links.customLinks,
				`${((metrics.links.customLinks / metrics.links.total) * 100).toFixed(1)}%`,
			],
			["TOTAL", metrics.links.total, "100%"],
		];
		const ws3 = XLSX.utils.aoa_to_sheet(linksTypes);
		XLSX.utils.book_append_sheet(wb, ws3, "Tipos de Enlaces");

		// Hoja 4: Estadísticas de Clics
		const clicksStats = [
			["Período", "Cantidad de Clics"],
			["Hoy", metrics.clicks.today],
			["Esta Semana", metrics.clicks.thisWeek],
			["Este Mes", metrics.clicks.thisMonth],
			["Total Histórico", metrics.clicks.total],
			["", ""],
			["Promedio por enlace", metrics.clicks.averagePerLink],
		];
		const ws4 = XLSX.utils.aoa_to_sheet(clicksStats);
		XLSX.utils.book_append_sheet(wb, ws4, "Estadísticas de Clics");

		// Generar el archivo
		const fileName = `AraguaLink_Metricas_${new Date().toISOString().split("T")[0]}.xlsx`;
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

	if (!isAdmin) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-red-600 mb-2">
						Acceso Denegado
					</h1>
					<p className="text-muted-foreground">
						No tienes permisos para acceder a esta página
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Panel de Administración</h1>
					<p className="text-muted-foreground mt-1">
						Vista general del sistema y gestión de datos
					</p>
				</div>
				{activeTab === "metrics" && metrics && (
					<Button
						onClick={handleExportToExcel}
						className="flex items-center gap-2"
					>
						<Download className="w-4 h-4" />
						Exportar a Excel
					</Button>
				)}
			</div>

			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="metrics">Métricas</TabsTrigger>
					<TabsTrigger value="users">Usuarios</TabsTrigger>
					<TabsTrigger value="links">Enlaces</TabsTrigger>
				</TabsList>

				{/* Metrics Tab */}
				<TabsContent value="metrics" className="space-y-4">
					{metricsLoading ? (
						<div className="flex items-center justify-center h-64">
							<Loader2 className="w-8 h-8 animate-spin text-purple-600" />
						</div>
					) : (
						<>
							{/* Main Stats */}
							<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
								<Card>
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<CardTitle className="text-sm font-medium">
											Total Usuarios
										</CardTitle>
										<Users className="h-4 w-4 text-muted-foreground" />
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">
											{metrics?.users.total || 0}
										</div>
										<div className="flex items-center gap-1 text-xs text-green-600 mt-1">
											<TrendingUp className="h-3 w-3" />
											<span>
												+{metrics?.users.newThisWeek || 0} esta semana
											</span>
										</div>
										<p className="text-xs text-muted-foreground mt-1">
											FREE: {metrics?.users.free || 0} | PRO:{" "}
											{metrics?.users.pro || 0} | ENT:{" "}
											{metrics?.users.enterprise || 0}
										</p>
									</CardContent>
								</Card>

								<Card>
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<CardTitle className="text-sm font-medium">
											Total Enlaces
										</CardTitle>
										<Link2 className="h-4 w-4 text-muted-foreground" />
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">
											{metrics?.links.total || 0}
										</div>
										<p className="text-xs text-muted-foreground mt-1">
											Activos: {metrics?.links.active || 0} | Inactivos:{" "}
											{metrics?.links.inactive || 0}
										</p>
									</CardContent>
								</Card>

								<Card>
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<CardTitle className="text-sm font-medium">
											Total Clics
										</CardTitle>
										<MousePointerClick className="h-4 w-4 text-muted-foreground" />
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">
											{metrics?.clicks.total || 0}
										</div>
										<p className="text-xs text-muted-foreground mt-1">
											Promedio: {metrics?.clicks.averagePerLink || 0} por enlace
										</p>
									</CardContent>
								</Card>

								<Card>
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<CardTitle className="text-sm font-medium">
											Páginas Bio
										</CardTitle>
										<Palette className="h-4 w-4 text-muted-foreground" />
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">
											{metrics?.bioPages.total || 0}
										</div>
										<p className="text-xs text-muted-foreground mt-1">
											Activas: {metrics?.bioPages.active || 0}
										</p>
									</CardContent>
								</Card>
							</div>

							{/* Chat Links Stats */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<MessageCircle className="h-5 w-5" />
										Enlaces de Chat y Comunidades
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
										<div className="space-y-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
											<div className="flex items-center justify-between">
												<p className="text-sm font-medium text-green-900 dark:text-green-100">
													💬 WhatsApp Grupos
												</p>
												<span className="text-2xl font-bold text-green-700 dark:text-green-300">
													{metrics?.links.whatsappGroups || 0}
												</span>
											</div>
										</div>
										<div className="space-y-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
											<div className="flex items-center justify-between">
												<p className="text-sm font-medium text-green-900 dark:text-green-100">
													📱 WhatsApp Chats
												</p>
												<span className="text-2xl font-bold text-green-700 dark:text-green-300">
													{metrics?.links.whatsappChats || 0}
												</span>
											</div>
										</div>
										<div className="space-y-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
											<div className="flex items-center justify-between">
												<p className="text-sm font-medium text-blue-900 dark:text-blue-100">
													✈️ Telegram Grupos
												</p>
												<span className="text-2xl font-bold text-blue-700 dark:text-blue-300">
													{metrics?.links.telegramGroups || 0}
												</span>
											</div>
										</div>
										<div className="space-y-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
											<div className="flex items-center justify-between">
												<p className="text-sm font-medium text-blue-900 dark:text-blue-100">
													📢 Telegram Canales
												</p>
												<span className="text-2xl font-bold text-blue-700 dark:text-blue-300">
													{metrics?.links.telegramChannels || 0}
												</span>
											</div>
										</div>
										<div className="space-y-2 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-900">
											<div className="flex items-center justify-between">
												<p className="text-sm font-medium text-purple-900 dark:text-purple-100">
													🎮 Discord Servers
												</p>
												<span className="text-2xl font-bold text-purple-700 dark:text-purple-300">
													{metrics?.links.discordInvites || 0}
												</span>
											</div>
										</div>
										<div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-950/20 rounded-lg border border-gray-200 dark:border-gray-900">
											<div className="flex items-center justify-between">
												<p className="text-sm font-medium text-gray-900 dark:text-gray-100">
													🔗 Enlaces Custom
												</p>
												<span className="text-2xl font-bold text-gray-700 dark:text-gray-300">
													{metrics?.links.customLinks || 0}
												</span>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>

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
											<p className="text-sm font-medium text-muted-foreground">
												Hoy
											</p>
											<p className="text-2xl font-bold">
												{metrics?.clicks.today || 0}
											</p>
										</div>
										<div className="space-y-1">
											<p className="text-sm font-medium text-muted-foreground">
												Última Semana
											</p>
											<p className="text-2xl font-bold">
												{metrics?.clicks.thisWeek || 0}
											</p>
										</div>
										<div className="space-y-1">
											<p className="text-sm font-medium text-muted-foreground">
												Último Mes
											</p>
											<p className="text-2xl font-bold">
												{metrics?.clicks.thisMonth || 0}
											</p>
										</div>
										<div className="space-y-1">
											<p className="text-sm font-medium text-muted-foreground">
												Total Histórico
											</p>
											<p className="text-2xl font-bold">
												{metrics?.clicks.total || 0}
											</p>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* User Growth Stats */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<TrendingUp className="h-5 w-5" />
										Crecimiento de Usuarios
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid gap-4 md:grid-cols-3">
										<div className="space-y-1">
											<p className="text-sm font-medium text-muted-foreground">
												Nuevos esta Semana
											</p>
											<p className="text-2xl font-bold text-green-600">
												+{metrics?.users.newThisWeek || 0}
											</p>
										</div>
										<div className="space-y-1">
											<p className="text-sm font-medium text-muted-foreground">
												Nuevos este Mes
											</p>
											<p className="text-2xl font-bold text-green-600">
												+{metrics?.users.newThisMonth || 0}
											</p>
										</div>
										<div className="space-y-1">
											<p className="text-sm font-medium text-muted-foreground">
												Total Usuarios
											</p>
											<p className="text-2xl font-bold">
												{metrics?.users.total || 0}
											</p>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Charts Grid */}
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{/* User Distribution by Plan */}
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<Users className="h-5 w-5" />
											Distribución de Usuarios por Plan
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="h-80">
											<ResponsiveContainer width="100%" height="100%">
												<BarChart
													data={[
														{
															plan: "FREE",
															usuarios: metrics?.users.free || 0,
															fill: "hsl(var(--chart-1))",
														},
														{
															plan: "PRO",
															usuarios: metrics?.users.pro || 0,
															fill: "hsl(var(--chart-2))",
														},
														{
															plan: "ENTERPRISE",
															usuarios: metrics?.users.enterprise || 0,
															fill: "hsl(var(--chart-3))",
														},
													]}
													margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
												>
													<CartesianGrid
														strokeDasharray="3 3"
														className="stroke-muted"
													/>
													<XAxis dataKey="plan" tick={{ fontSize: 12 }} />
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
														dataKey="usuarios"
														radius={[8, 8, 0, 0]}
														label={{ position: "top" }}
													>
														{[
															{ fill: "#3b82f6" }, // Blue for FREE
															{ fill: "#f59e0b" }, // Amber for PRO
															{ fill: "#a855f7" }, // Purple for ENTERPRISE
														].map((entry, index) => (
															<Cell key={`cell-${index}`} fill={entry.fill} />
														))}
													</Bar>
												</BarChart>
											</ResponsiveContainer>
										</div>
									</CardContent>
								</Card>

								{/* Link Types Distribution */}
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<Link2 className="h-5 w-5" />
											Distribución de Enlaces por Tipo
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="h-80">
											<ResponsiveContainer width="100%" height="100%">
												<PieChart>
													<Pie
														data={[
															{
																name: "WhatsApp Grupos",
																value: metrics?.links.whatsappGroups || 0,
															},
															{
																name: "WhatsApp Chats",
																value: metrics?.links.whatsappChats || 0,
															},
															{
																name: "Telegram Grupos",
																value: metrics?.links.telegramGroups || 0,
															},
															{
																name: "Telegram Canales",
																value: metrics?.links.telegramChannels || 0,
															},
															{
																name: "Discord",
																value: metrics?.links.discordInvites || 0,
															},
															{
																name: "Custom",
																value: metrics?.links.customLinks || 0,
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
														{[0, 1, 2, 3, 4, 5].map((index) => (
															<Cell
																key={`cell-${index}`}
																fill={
																	[
																		"#10b981", // Green for WhatsApp Groups
																		"#22c55e", // Light Green for WhatsApp Chats
																		"#3b82f6", // Blue for Telegram Groups
																		"#06b6d4", // Cyan for Telegram Channels
																		"#a855f7", // Purple for Discord
																		"#f97316", // Orange for Custom
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

								{/* Clicks Overview */}
								<Card className="lg:col-span-2">
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<MousePointerClick className="h-5 w-5" />
											Resumen de Clicks
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="h-80">
											<ResponsiveContainer width="100%" height="100%">
												<AreaChart
													data={[
														{
															periodo: "Hoy",
															clicks: metrics?.clicks.today || 0,
														},
														{
															periodo: "Semana",
															clicks: metrics?.clicks.thisWeek || 0,
														},
														{
															periodo: "Mes",
															clicks: metrics?.clicks.thisMonth || 0,
														},
														{
															periodo: "Total",
															clicks: metrics?.clicks.total || 0,
														},
													]}
													margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
												>
													<defs>
														<linearGradient
															id="colorClicks"
															x1="0"
															y1="0"
															x2="0"
															y2="1"
														>
															<stop
																offset="5%"
																stopColor="#f97316"
																stopOpacity={0.8}
															/>
															<stop
																offset="95%"
																stopColor="#f97316"
																stopOpacity={0.1}
															/>
														</linearGradient>
													</defs>
													<CartesianGrid
														strokeDasharray="3 3"
														className="stroke-muted"
													/>
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
													<Area
														type="monotone"
														dataKey="clicks"
														stroke="#f97316"
														strokeWidth={2}
														fillOpacity={1}
														fill="url(#colorClicks)"
													/>
												</AreaChart>
											</ResponsiveContainer>
										</div>
									</CardContent>
								</Card>
							</div>

							{/* New Analytics Sections */}
							<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
								{/* Top Countries */}
								<Card>
									<CardHeader>
										<CardTitle className="text-sm font-medium">
											Top Países
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-2">
											{metrics?.topCountries.slice(0, 5).map((country, idx) => (
												<div
													key={country.country_code}
													className="flex items-center justify-between"
												>
													<div className="flex items-center gap-2">
														<span className="text-xs font-medium text-muted-foreground">
															#{idx + 1}
														</span>
														<span className="text-sm font-medium">
															{country.country}
														</span>
													</div>
													<span className="text-sm font-bold">
														{country.clicks}
													</span>
												</div>
											))}
											{(!metrics?.topCountries ||
												metrics.topCountries.length === 0) && (
												<p className="text-sm text-muted-foreground text-center py-4">
													No hay datos disponibles
												</p>
											)}
										</div>
									</CardContent>
								</Card>

								{/* Top Cities */}
								<Card>
									<CardHeader>
										<CardTitle className="text-sm font-medium">
											Top Ciudades
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-2">
											{metrics?.topCities.slice(0, 5).map((city, idx) => (
												<div
													key={`${city.city}-${city.country}`}
													className="flex items-center justify-between"
												>
													<div className="flex items-center gap-2">
														<span className="text-xs font-medium text-muted-foreground">
															#{idx + 1}
														</span>
														<span className="text-sm font-medium">
															{city.city}, {city.country}
														</span>
													</div>
													<span className="text-sm font-bold">
														{city.clicks}
													</span>
												</div>
											))}
											{(!metrics?.topCities ||
												metrics.topCities.length === 0) && (
												<p className="text-sm text-muted-foreground text-center py-4">
													No hay datos disponibles
												</p>
											)}
										</div>
									</CardContent>
								</Card>

								{/* Top Devices */}
								<Card>
									<CardHeader>
										<CardTitle className="text-sm font-medium">
											Top Dispositivos
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-2">
											{metrics?.topDevices.map((device, idx) => (
												<div
													key={device.device_type}
													className="flex items-center justify-between"
												>
													<div className="flex items-center gap-2">
														<span className="text-xs font-medium text-muted-foreground">
															#{idx + 1}
														</span>
														<span className="text-sm font-medium capitalize">
															{device.device_type}
														</span>
													</div>
													<span className="text-sm font-bold">
														{device.clicks}
													</span>
												</div>
											))}
											{(!metrics?.topDevices ||
												metrics.topDevices.length === 0) && (
												<p className="text-sm text-muted-foreground text-center py-4">
													No hay datos disponibles
												</p>
											)}
										</div>
									</CardContent>
								</Card>

								{/* Top Browsers */}
								<Card>
									<CardHeader>
										<CardTitle className="text-sm font-medium">
											Top Navegadores
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-2">
											{metrics?.topBrowsers.slice(0, 5).map((browser, idx) => (
												<div
													key={browser.browser}
													className="flex items-center justify-between"
												>
													<div className="flex items-center gap-2">
														<span className="text-xs font-medium text-muted-foreground">
															#{idx + 1}
														</span>
														<span className="text-sm font-medium">
															{browser.browser}
														</span>
													</div>
													<span className="text-sm font-bold">
														{browser.clicks}
													</span>
												</div>
											))}
											{(!metrics?.topBrowsers ||
												metrics.topBrowsers.length === 0) && (
												<p className="text-sm text-muted-foreground text-center py-4">
													No hay datos disponibles
												</p>
											)}
										</div>
									</CardContent>
								</Card>

								{/* Top Referrers */}
								<Card className="md:col-span-2">
									<CardHeader>
										<CardTitle className="text-sm font-medium">
											Top Referrers
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-2">
											{metrics?.topReferrers
												.slice(0, 5)
												.map((referrer, idx) => (
													<div
														key={referrer.referrer_domain}
														className="flex items-center justify-between"
													>
														<div className="flex items-center gap-2">
															<span className="text-xs font-medium text-muted-foreground">
																#{idx + 1}
															</span>
															<span className="text-sm font-medium truncate max-w-xs">
																{referrer.referrer_domain}
															</span>
														</div>
														<span className="text-sm font-bold">
															{referrer.clicks}
														</span>
													</div>
												))}
											{(!metrics?.topReferrers ||
												metrics.topReferrers.length === 0) && (
												<p className="text-sm text-muted-foreground text-center py-4">
													No hay datos disponibles
												</p>
											)}
										</div>
									</CardContent>
								</Card>
							</div>
						</>
					)}
				</TabsContent>

				{/* Users Tab */}
				<TabsContent value="users" className="space-y-4">
					{usersLoading ? (
						<div className="flex items-center justify-center h-64">
							<Loader2 className="w-8 h-8 animate-spin text-purple-600" />
						</div>
					) : (
						<Card>
							<CardHeader>
								<CardTitle>Usuarios Registrados</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="overflow-x-auto">
									<table className="w-full">
										<thead>
											<tr className="border-b">
												<th className="text-left p-2 font-medium">Email</th>
												<th className="text-left p-2 font-medium">Nombre</th>
												<th className="text-left p-2 font-medium">Plan</th>
												<th className="text-left p-2 font-medium">Creado</th>
												<th className="text-left p-2 font-medium">Acciones</th>
											</tr>
										</thead>
										<tbody>
											{usersData?.data.map((user: IUser) => (
												<tr
													key={user.id}
													className="border-b hover:bg-muted/50"
												>
													<td className="p-2 text-sm">{user.email}</td>
													<td className="p-2 text-sm">
														{user.first_name} {user.last_name}
													</td>
													<td className="p-2">
														<span
															className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
																user.plan === "PRO"
																	? "bg-purple-100 text-purple-800"
																	: user.plan === "ENTERPRISE"
																		? "bg-blue-100 text-blue-800"
																		: "bg-gray-100 text-gray-800"
															}`}
														>
															{user.plan}
														</span>
													</td>
													<td className="p-2 text-sm text-muted-foreground">
														{new Date(user.created_at).toLocaleDateString()}
													</td>
													<td className="p-2">
														<div className="flex gap-2">
															<Button
																size="sm"
																variant="outline"
																onClick={() => {
																	setSelectedUser(user);
																	setNewPassword("");
																	setPasswordDialogOpen(true);
																}}
															>
																<Key className="w-3 h-3 mr-1" />
																Contraseña
															</Button>
															<Button
																size="sm"
																variant="outline"
																onClick={() => {
																	setSelectedUser(user);
																	setNewRole(user.plan);
																	setRoleDialogOpen(true);
																}}
															>
																<Shield className="w-3 h-3 mr-1" />
																Rol
															</Button>
														</div>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
								{usersData?.data.length === 0 && (
									<p className="text-center text-muted-foreground py-8">
										No hay usuarios registrados
									</p>
								)}
							</CardContent>
						</Card>
					)}
				</TabsContent>

				{/* Links Tab */}
				<TabsContent value="links" className="space-y-4">
					{linksLoading ? (
						<div className="flex items-center justify-center h-64">
							<Loader2 className="w-8 h-8 animate-spin text-purple-600" />
						</div>
					) : (
						<Card>
							<CardHeader>
								<CardTitle>Enlaces Creados</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="overflow-x-auto">
									<table className="w-full">
										<thead>
											<tr className="border-b">
												<th className="text-left p-2 font-medium">Título</th>
												<th className="text-left p-2 font-medium">
													Código Corto
												</th>
												<th className="text-left p-2 font-medium">URL</th>
												<th className="text-left p-2 font-medium">Estado</th>
												<th className="text-left p-2 font-medium">Clics</th>
											</tr>
										</thead>
										<tbody>
											{linksData?.data.map((link: ILink) => (
												<tr
													key={link.id}
													className="border-b hover:bg-muted/50"
												>
													<td className="p-2 text-sm font-medium">
														{link.title}
													</td>
													<td className="p-2 text-sm font-mono">
														{link.short_code}
													</td>
													<td className="p-2 text-sm text-muted-foreground truncate max-w-xs">
														{link.url}
													</td>
													<td className="p-2">
														<span
															className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
																link.is_active
																	? "bg-green-100 text-green-800"
																	: "bg-red-100 text-red-800"
															}`}
														>
															{link.is_active ? "Activo" : "Inactivo"}
														</span>
													</td>
													<td className="p-2 text-sm">{link.clicks || 0}</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
								{linksData?.data.length === 0 && (
									<p className="text-center text-muted-foreground py-8">
										No hay enlaces creados
									</p>
								)}
							</CardContent>
						</Card>
					)}
				</TabsContent>
			</Tabs>

			{/* Change Password Dialog */}
			<Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Cambiar Contraseña</DialogTitle>
						<DialogDescription>
							Cambiar la contraseña para {selectedUser?.email}
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="password">Nueva Contraseña</Label>
							<Input
								id="password"
								type="password"
								placeholder="Mínimo 6 caracteres"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setPasswordDialogOpen(false)}
						>
							Cancelar
						</Button>
						<Button
							onClick={handleChangePassword}
							disabled={
								newPassword.length < 6 || changePasswordMutation.isPending
							}
						>
							{changePasswordMutation.isPending
								? "Cambiando..."
								: "Cambiar Contraseña"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Update Role Dialog */}
			<Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Actualizar Rol</DialogTitle>
						<DialogDescription>
							Cambiar el plan para {selectedUser?.email}
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="role">Plan</Label>
							<Select value={newRole} onValueChange={setNewRole}>
								<SelectTrigger>
									<SelectValue placeholder="Selecciona un plan" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="FREE">FREE</SelectItem>
									<SelectItem value="PRO">PRO</SelectItem>
									<SelectItem value="ENTERPRISE">ENTERPRISE</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setRoleDialogOpen(false)}>
							Cancelar
						</Button>
						<Button
							onClick={handleUpdateRole}
							disabled={!newRole || updateRoleMutation.isPending}
						>
							{updateRoleMutation.isPending
								? "Actualizando..."
								: "Actualizar Rol"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
