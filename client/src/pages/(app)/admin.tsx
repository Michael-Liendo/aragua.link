import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	BarChart3,
	Check,
	Key,
	Link2,
	Loader2,
	MousePointerClick,
	Palette,
	Shield,
	Users,
	X,
} from "lucide-react";
import { useState } from "react";
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
	const [selectedUser, setSelectedUser] = useState<any>(null);
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
		queryFn: () => Services.admin.getAll("users", 0, 50),
		enabled: isAdmin && activeTab === "users",
	});

	// Fetch links
	const { data: linksData, isLoading: linksLoading } = useQuery({
		queryKey: ["adminLinks"],
		queryFn: () => Services.admin.getAll("links", 0, 50),
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
			<div>
				<h1 className="text-3xl font-bold">Panel de Administración</h1>
				<p className="text-muted-foreground mt-1">
					Vista general del sistema y gestión de datos
				</p>
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
							{/* Users Stats */}
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
											Hoy: {metrics?.clicks.today || 0}
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
											Total creadas
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
									<div className="grid gap-4 md:grid-cols-3">
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
											{usersData?.data.map((user: any) => (
												<tr
													key={user.id}
													className="border-b hover:bg-muted/50"
												>
													<td className="p-2 text-sm">{user.email}</td>
													<td className="p-2 text-sm">{user.name}</td>
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
											{linksData?.data.map((link: any) => (
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
