import type { IBioPageLink, ILink } from "@aragualink/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	Check,
	Eye,
	Loader2,
	Palette,
	Plus,
	Save,
	Trash2,
	X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/features/ui/useToast";
import Services from "@/services";

type BioPageLinkWithDetails = IBioPageLink & ILink;

export default function BioPageManager() {
	const queryClient = useQueryClient();
	const [isCreating, setIsCreating] = useState(false);

	// Form state for creating/editing bio page
	const [formData, setFormData] = useState({
		slug: "",
		display_name: "",
		bio: "",
		avatar_url: "",
		theme: "light" as "light" | "dark" | "gradient",
	});

	// Fetch bio page
	const { data: bioPage, isLoading } = useQuery({
		queryKey: ["bioPage"],
		queryFn: () => Services.bioPages.get(),
	});

	// Fetch links
	const { data: links } = useQuery({
		queryKey: ["links"],
		queryFn: () => Services.links.getAll(),
	});

	// Fetch bio page links
	const { data: bioPageLinks } = useQuery<BioPageLinkWithDetails[]>({
		queryKey: ["bioPageLinks"],
		queryFn: () =>
			Services.bioPages.getLinks() as Promise<BioPageLinkWithDetails[]>,
		enabled: !!bioPage,
	});

	// Create bio page mutation
	const createMutation = useMutation({
		mutationFn: Services.bioPages.create,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["bioPage"] });
			setIsCreating(false);
			toast({
				description: (
					<div className="flex items-center justify-between w-full space-x-4">
						<Check className="text-green-600 ml-auto" />
						<span>Página bio creada exitosamente</span>
					</div>
				),
			});
		},
		onError: (error: Error) => {
			toast({
				description: (
					<div className="flex items-center justify-between w-full space-x-4">
						<X className="text-red-600 ml-auto" />
						<span>{error.message || "Error al crear la página bio"}</span>
					</div>
				),
			});
		},
	});

	// Update bio page mutation
	const updateMutation = useMutation({
		mutationFn: Services.bioPages.update,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["bioPage"] });
			toast({
				description: (
					<div className="flex items-center justify-between w-full space-x-4">
						<Check className="text-green-600 ml-auto" />
						<span>Página bio actualizada exitosamente</span>
					</div>
				),
			});
		},
		onError: (error: Error) => {
			toast({
				description: (
					<div className="flex items-center justify-between w-full space-x-4">
						<X className="text-red-600 ml-auto" />
						<span>{error.message || "Error al actualizar la página bio"}</span>
					</div>
				),
			});
		},
	});

	// Delete bio page mutation
	const deleteMutation = useMutation({
		mutationFn: Services.bioPages.delete,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["bioPage"] });
			queryClient.invalidateQueries({ queryKey: ["bioPageLinks"] });
			toast({
				description: (
					<div className="flex items-center justify-between w-full space-x-4">
						<Check className="text-green-600 ml-auto" />
						<span>Página bio eliminada exitosamente</span>
					</div>
				),
			});
		},
	});

	// Add link to bio page mutation
	const addLinkMutation = useMutation({
		mutationFn: (linkId: string) =>
			Services.bioPages.addLink({ link_id: linkId }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["bioPageLinks"] });
			toast({
				description: (
					<div className="flex items-center justify-between w-full space-x-4">
						<Check className="text-green-600 ml-auto" />
						<span>Enlace agregado a la página bio</span>
					</div>
				),
			});
		},
		onError: (error: Error) => {
			toast({
				description: (
					<div className="flex items-center justify-between w-full space-x-4">
						<X className="text-red-600 ml-auto" />
						<span>{error.message || "Error al agregar el enlace"}</span>
					</div>
				),
			});
		},
	});

	// Remove link from bio page mutation
	const removeLinkMutation = useMutation({
		mutationFn: (linkId: string) => Services.bioPages.removeLink(linkId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["bioPageLinks"] });
			toast({
				description: (
					<div className="flex items-center justify-between w-full space-x-4">
						<Check className="text-green-600 ml-auto" />
						<span>Enlace removido de la página bio</span>
					</div>
				),
			});
		},
	});

	const handleCreate = () => {
		createMutation.mutate(formData);
	};

	const handleUpdate = () => {
		updateMutation.mutate({
			display_name: formData.display_name,
			bio: formData.bio,
			avatar_url: formData.avatar_url,
			theme: formData.theme,
		});
	};

	const handleDelete = () => {
		if (
			confirm(
				"¿Estás seguro de que quieres eliminar tu página bio? Esta acción no se puede deshacer.",
			)
		) {
			deleteMutation.mutate();
		}
	};

	// Initialize form when bio page loads
	if (bioPage && !isCreating && formData.slug === "") {
		setFormData({
			slug: bioPage.slug,
			display_name: bioPage.display_name,
			bio: bioPage.bio || "",
			avatar_url: bioPage.avatar_url || "",
			theme: bioPage.theme as "light" | "dark" | "gradient",
		});
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<Loader2 className="w-8 h-8 animate-spin text-purple-600" />
			</div>
		);
	}

	// Get links that are already in bio page
	const bioPageLinkIds = new Set(bioPageLinks?.map((l) => l.link_id) || []);
	const availableLinks = links?.filter((l) => !bioPageLinkIds.has(l.id)) || [];

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Página Bio</h1>
					<p className="text-muted-foreground mt-1">
						Crea tu página de enlaces estilo Linktree
					</p>
				</div>
				{bioPage && (
					<Button
						variant="outline"
						onClick={() => window.open(`/${bioPage.slug}`, "_blank")}
					>
						<Eye className="w-4 h-4 mr-2" />
						Ver Página
					</Button>
				)}
			</div>

			{!bioPage && !isCreating ? (
				<div className="border-2 border-dashed rounded-lg p-12 text-center">
					<Palette className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
					<h2 className="text-xl font-semibold mb-2">
						No tienes una página bio
					</h2>
					<p className="text-muted-foreground mb-6">
						Crea tu página de enlaces personalizada para compartir todos tus
						links en un solo lugar
					</p>
					<Button onClick={() => setIsCreating(true)}>
						<Plus className="w-4 h-4 mr-2" />
						Crear Página Bio
					</Button>
				</div>
			) : (
				<div className="grid gap-6 md:grid-cols-2">
					{/* Form Section */}
					<div className="space-y-4">
						<div className="bg-card border rounded-lg p-6 space-y-4">
							<h2 className="text-xl font-semibold">Configuración</h2>

							{!bioPage && (
								<div className="space-y-2">
									<Label htmlFor="slug">Slug (URL) *</Label>
									<Input
										id="slug"
										placeholder="mi-nombre"
										value={formData.slug}
										onChange={(e) =>
											setFormData({
												...formData,
												slug: e.target.value
													.toLowerCase()
													.replace(/[^a-z0-9-]/g, ""),
											})
										}
									/>
									<p className="text-sm text-muted-foreground">
										Tu página estará en: /{formData.slug || "tu-slug"}
									</p>
								</div>
							)}

							<div className="space-y-2">
								<Label htmlFor="display_name">Nombre *</Label>
								<Input
									id="display_name"
									placeholder="Tu Nombre"
									value={formData.display_name}
									onChange={(e) =>
										setFormData({ ...formData, display_name: e.target.value })
									}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="bio">Bio</Label>
								<Textarea
									id="bio"
									placeholder="Cuéntanos sobre ti..."
									value={formData.bio}
									onChange={(e) =>
										setFormData({ ...formData, bio: e.target.value })
									}
									rows={3}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="avatar_url">URL del Avatar</Label>
								<Input
									id="avatar_url"
									type="url"
									placeholder="https://ejemplo.com/avatar.jpg"
									value={formData.avatar_url}
									onChange={(e) =>
										setFormData({ ...formData, avatar_url: e.target.value })
									}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="theme">Tema</Label>
								<Select
									value={formData.theme}
									onValueChange={(value: "light" | "dark" | "gradient") =>
										setFormData({ ...formData, theme: value })
									}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="light">Claro</SelectItem>
										<SelectItem value="dark">Oscuro</SelectItem>
										<SelectItem value="gradient">Gradiente</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="flex gap-2">
								{!bioPage ? (
									<>
										<Button
											onClick={handleCreate}
											disabled={
												!formData.slug ||
												!formData.display_name ||
												createMutation.isPending
											}
											className="flex-1"
										>
											<Save className="w-4 h-4 mr-2" />
											{createMutation.isPending ? "Creando..." : "Crear"}
										</Button>
										<Button
											variant="outline"
											onClick={() => setIsCreating(false)}
										>
											Cancelar
										</Button>
									</>
								) : (
									<>
										<Button
											onClick={handleUpdate}
											disabled={
												!formData.display_name || updateMutation.isPending
											}
											className="flex-1"
										>
											<Save className="w-4 h-4 mr-2" />
											{updateMutation.isPending ? "Guardando..." : "Guardar"}
										</Button>
										<Button
											variant="destructive"
											onClick={handleDelete}
											disabled={deleteMutation.isPending}
										>
											<Trash2 className="w-4 h-4" />
										</Button>
									</>
								)}
							</div>
						</div>
					</div>

					{/* Links Section */}
					{bioPage && (
						<div className="space-y-4">
							<div className="bg-card border rounded-lg p-6 space-y-4">
								<h2 className="text-xl font-semibold">Enlaces en tu Bio</h2>

								{bioPageLinks && bioPageLinks.length > 0 ? (
									<div className="space-y-2">
										{bioPageLinks.map((link) => (
											<div
												key={link.id}
												className="flex items-center justify-between p-3 border rounded-lg"
											>
												<div className="flex-1">
													<p className="font-medium">{link.title}</p>
													<p className="text-sm text-muted-foreground">
														{link.url}
													</p>
												</div>
												<Button
													variant="ghost"
													size="sm"
													onClick={() => removeLinkMutation.mutate(link.id)}
													disabled={removeLinkMutation.isPending}
												>
													<Trash2 className="w-4 h-4 text-red-600" />
												</Button>
											</div>
										))}
									</div>
								) : (
									<p className="text-muted-foreground text-center py-4">
										No hay enlaces en tu página bio
									</p>
								)}

								{availableLinks.length > 0 && (
									<div className="pt-4 border-t">
										<Label className="mb-2 block">Agregar Enlace</Label>
										<div className="space-y-2">
											{availableLinks.map((link) => (
												<div
													key={link.id}
													className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent"
												>
													<div className="flex-1">
														<p className="font-medium">{link.title}</p>
														<p className="text-sm text-muted-foreground truncate">
															{link.url}
														</p>
													</div>
													<Button
														variant="ghost"
														size="sm"
														onClick={() => addLinkMutation.mutate(link.id)}
														disabled={addLinkMutation.isPending}
													>
														<Plus className="w-4 h-4" />
													</Button>
												</div>
											))}
										</div>
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
