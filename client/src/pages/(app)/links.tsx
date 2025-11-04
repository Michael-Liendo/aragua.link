import type { ILink } from "@aragualink/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Link2, Plus } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth";
import { useSEO } from "@/features/seo";
import { toast } from "@/features/ui/useToast";
import Services from "@/services";
import { CreateLinkDialog } from "./links/CreateLinkDialog";
import { EditLinkDialog } from "./links/EditLinkDialog";
import { LinksList } from "./links/LinksList";

export default function LinksPage() {
	useSEO({ title: "Mis Enlaces" });

	const { user } = useAuth();
	const queryClient = useQueryClient();
	const [createOpen, setCreateOpen] = useState(false);
	const [editLink, setEditLink] = useState<ILink | null>(null);

	// Check if user has PRO plan
	const hasPro = user?.plan === "PRO" || user?.plan === "ENTERPRISE";

	// Fetch links
	const { data: links = [], isLoading } = useQuery({
		queryKey: ["links"],
		queryFn: () => Services.links.getAll(),
	});

	// Delete mutation
	const deleteMutation = useMutation({
		mutationFn: (id: string) => Services.links.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["links"] });
			toast({
				title: "Enlace eliminado",
				description: "El enlace ha sido eliminado exitosamente",
			});
		},
		onError: () => {
			toast({
				title: "Error",
				description: "No se pudo eliminar el enlace",
			});
		},
	});

	// Reorder mutation
	const reorderMutation = useMutation({
		mutationFn: (links: Array<{ id: string; position: number }>) =>
			Services.links.reorder(links),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["links"] });
		},
	});

	const handleDelete = (id: string) => {
		if (confirm("¿Estás seguro de que deseas eliminar este enlace?")) {
			deleteMutation.mutate(id);
		}
	};

	const handleEdit = (link: ILink) => {
		setEditLink(link);
	};

	const handleReorder = (reorderedLinks: ILink[]) => {
		const updates = reorderedLinks.map((link, index) => ({
			id: link.id,
			position: index,
		}));
		reorderMutation.mutate(updates);
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
			</div>
		);
	}

	const handleCreateClick = () => {
		if (!hasPro) {
			toast({
				title: "Plan PRO requerido",
				description:
					"Necesitas un plan PRO para crear enlaces. Contacta a un administrador.",
			});
			return;
		}
		setCreateOpen(true);
	};

	return (
		<div className="container mx-auto p-6 max-w-5xl">
			<div className="flex items-center justify-between mb-8">
				<div>
					<h1 className="text-3xl font-bold flex items-center gap-2">
						<Link2 className="h-8 w-8" />
						Mis Enlaces
					</h1>
					<p className="text-muted-foreground mt-2">
						Gestiona todos tus enlaces en un solo lugar
					</p>
				</div>
				<Button onClick={handleCreateClick} size="lg" className="gap-2">
					<Plus className="h-5 w-5" />
					Crear Enlace
				</Button>
			</div>

			{/* Alert para usuarios sin plan PRO */}
			{!hasPro && (
				<Alert className="mb-6 border-amber-500 bg-amber-50 dark:bg-amber-950">
					<AlertCircle className="h-4 w-4 text-amber-600" />
					<AlertTitle className="text-amber-900 dark:text-amber-100">
						Plan PRO Requerido
					</AlertTitle>
					<AlertDescription className="text-amber-800 dark:text-amber-200">
						Para crear y gestionar enlaces necesitas un plan PRO. Por favor,
						contacta a un administrador para activar tu suscripción.
					</AlertDescription>
				</Alert>
			)}

			{links.length === 0 ? (
				<div className="text-center py-12 border-2 border-dashed rounded-lg">
					<Link2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
					<h3 className="text-xl font-semibold mb-2">
						No tienes enlaces todavía
					</h3>
					<p className="text-muted-foreground mb-6">
						{hasPro
							? "Crea tu primer enlace para comenzar"
							: "Necesitas un plan PRO para crear enlaces"}
					</p>
					<Button onClick={handleCreateClick} size="lg" className="gap-2">
						<Plus className="h-5 w-5" />
						Crear Primer Enlace
					</Button>
				</div>
			) : (
				<LinksList
					links={links}
					onEdit={handleEdit}
					onDelete={handleDelete}
					onReorder={handleReorder}
				/>
			)}

			<CreateLinkDialog
				open={createOpen}
				onOpenChange={setCreateOpen}
				onSuccess={() => {
					queryClient.invalidateQueries({ queryKey: ["links"] });
					setCreateOpen(false);
				}}
			/>

			{editLink && (
				<EditLinkDialog
					link={editLink}
					open={!!editLink}
					onOpenChange={(open: boolean) => !open && setEditLink(null)}
					onSuccess={() => {
						queryClient.invalidateQueries({ queryKey: ["links"] });
						setEditLink(null);
					}}
				/>
			)}
		</div>
	);
}
