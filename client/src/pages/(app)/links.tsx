import type { ILink } from "@aragualink/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Link2, Plus, Upload } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth";
import { useSEO } from "@/features/seo";
import { toast } from "@/features/ui/useToast";
import Services from "@/services";
import { BulkCreateLinkDialog } from "./links/BulkCreateLinkDialog";
import { CreateLinkDialog } from "./links/CreateLinkDialog";
import { EditLinkDialog } from "./links/EditLinkDialog";
import { LinksList } from "./links/LinksList";

export default function LinksPage() {
	useSEO({ title: "Mis Enlaces" });

	const { user } = useAuth();
	const queryClient = useQueryClient();
	const [createOpen, setCreateOpen] = useState(false);
	const [bulkCreateOpen, setBulkCreateOpen] = useState(false);
	const [editLink, setEditLink] = useState<ILink | null>(null);

	// Check if user has PRO plan
	const _hasPro = user?.plan === "PRO" || user?.plan === "ENTERPRISE";
	const isFree = user?.plan === "FREE";
	const FREE_PLAN_LINK_LIMIT = 2;

	// Fetch links
	const { data: links = [], isLoading } = useQuery({
		queryKey: ["links"],
		queryFn: () => Services.links.getAll(),
	});

	// Check if FREE user has reached limit
	const hasReachedFreeLimit = isFree && links.length >= FREE_PLAN_LINK_LIMIT;

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
		if (hasReachedFreeLimit) {
			toast({
				title: "Límite alcanzado",
				description: `El plan FREE permite hasta ${FREE_PLAN_LINK_LIMIT} enlaces. Actualiza a PRO para crear más enlaces.`,
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
				<div className="flex gap-2">
					<Button
						onClick={() => setBulkCreateOpen(true)}
						size="lg"
						variant="outline"
						className="gap-2"
					>
						<Upload className="h-5 w-5" />
						Importar Excel
					</Button>
					<Button onClick={handleCreateClick} size="lg" className="gap-2">
						<Plus className="h-5 w-5" />
						Crear Enlace
					</Button>
				</div>
			</div>

			{/* Alert para usuarios FREE */}
			{isFree && (
				<Alert className="mb-6 border-amber-500 bg-amber-50 dark:bg-amber-950">
					<AlertCircle className="h-4 w-4 text-amber-600" />
					<AlertTitle className="text-amber-900 dark:text-amber-100">
						Plan FREE - Límite de {FREE_PLAN_LINK_LIMIT} enlaces
					</AlertTitle>
					<AlertDescription className="text-amber-800 dark:text-amber-200">
						Estás usando {links.length} de {FREE_PLAN_LINK_LIMIT} enlaces
						disponibles.
						{hasReachedFreeLimit &&
							" Has alcanzado el límite. Actualiza a PRO para crear hasta 200 enlaces y acceder a analytics."}
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
						Crea tu primer enlace para comenzar
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
					userPlan={user?.plan}
				/>
			)}

			<CreateLinkDialog
				open={createOpen}
				onOpenChange={setCreateOpen}
				onSuccess={() => {
					queryClient.invalidateQueries({ queryKey: ["links"] });
					setCreateOpen(false);
				}}
				userPlan={user?.plan}
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

			<BulkCreateLinkDialog
				open={bulkCreateOpen}
				onOpenChange={setBulkCreateOpen}
				onSuccess={() => {
					queryClient.invalidateQueries({ queryKey: ["links"] });
					setBulkCreateOpen(false);
				}}
			/>
		</div>
	);
}
