import type { ILink, ILinkForUpdate } from "@aragualink/shared";
import { LinkForUpdateSchema } from "@aragualink/shared";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { Check, X } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/features/ui/useToast";
import Services from "@/services";
import { toFormikValidationSchema } from "@/utils/toFormikValidationSchema";

interface EditLinkDialogProps {
	link: ILink;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess: () => void;
}

export function EditLinkDialog({
	link,
	open,
	onOpenChange,
	onSuccess,
}: EditLinkDialogProps) {
	const updateMutation = useMutation({
		mutationFn: (data: ILinkForUpdate) => Services.links.update(link.id, data),
		onSuccess: () => {
			toast({
				description: (
					<div className="flex items-center justify-between w-full space-x-4">
						<Check className="text-green-600 ml-auto" />
						<span>Enlace actualizado exitosamente</span>
					</div>
				),
			});
			onSuccess();
		},
		onError: (error: Error) => {
			toast({
				description: (
					<div className="flex items-center justify-between w-full space-x-4">
						<X className="text-red-600 ml-auto" />
						<span>{error.message || "Error al actualizar el enlace"}</span>
					</div>
				),
			});
		},
	});

	const formik = useFormik<ILinkForUpdate>({
		initialValues: {
			title: link.title,
			url: link.url,
			description: link.description || "",
			is_active: link.is_active,
		},
		validationSchema: toFormikValidationSchema(LinkForUpdateSchema),
		validateOnChange: false,
		validateOnBlur: false,
		onSubmit: (values) => {
			updateMutation.mutate(values);
		},
	});

	// Reset form when link changes
	useEffect(() => {
		formik.resetForm({
			values: {
				title: link.title,
				url: link.url,
				description: link.description || "",
				is_active: link.is_active,
			},
		});
	}, [link]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>Editar Enlace</DialogTitle>
					<DialogDescription>
						Actualiza la información de tu enlace
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={formik.handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="edit-title">Título *</Label>
						<Input
							id="edit-title"
							name="title"
							placeholder="Mi enlace importante"
							value={formik.values.title}
							onChange={formik.handleChange}
						/>
						{formik.errors.title && (
							<p className="text-sm text-destructive">{formik.errors.title}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="edit-url">URL de Destino *</Label>
						<Input
							id="edit-url"
							name="url"
							type="url"
							placeholder="https://ejemplo.com"
							value={formik.values.url}
							onChange={formik.handleChange}
						/>
						{formik.errors.url && (
							<p className="text-sm text-destructive">{formik.errors.url}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label>Código Corto</Label>
						<div className="px-3 py-2 bg-muted rounded-md text-sm font-mono">
							{window.location.origin}/{link.short_code}
						</div>
						<p className="text-sm text-muted-foreground">
							El código corto no se puede modificar
						</p>
					</div>

					<div className="space-y-2">
						<Label htmlFor="edit-description">Descripción (opcional)</Label>
						<Textarea
							id="edit-description"
							name="description"
							placeholder="Descripción breve del enlace"
							value={formik.values.description || ""}
							onChange={formik.handleChange}
							rows={3}
						/>
						{formik.errors.description && (
							<p className="text-sm text-destructive">
								{formik.errors.description}
							</p>
						)}
					</div>

					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label htmlFor="edit-is_active">Enlace activo</Label>
							<p className="text-sm text-muted-foreground">
								Los enlaces inactivos no redirigen
							</p>
						</div>
						<Switch
							id="edit-is_active"
							checked={formik.values.is_active}
							onCheckedChange={(checked) =>
								formik.setFieldValue("is_active", checked)
							}
						/>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Cancelar
						</Button>
						<Button type="submit" disabled={updateMutation.isPending}>
							{updateMutation.isPending ? "Guardando..." : "Guardar Cambios"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
