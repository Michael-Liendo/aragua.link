import { type ILinkForCreate, LinkForCreateSchema } from "@aragualink/shared";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { Check, X } from "lucide-react";
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

interface CreateLinkDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess: () => void;
}

export function CreateLinkDialog({
	open,
	onOpenChange,
	onSuccess,
}: CreateLinkDialogProps) {
	const createMutation = useMutation({
		mutationFn: (link: ILinkForCreate) => Services.links.create(link),
		onSuccess: () => {
			toast({
				description: (
					<div className="flex items-center justify-between w-full space-x-4">
						<Check className="text-green-600 ml-auto" />
						<span>Enlace creado exitosamente</span>
					</div>
				),
			});
			onSuccess();
			formik.resetForm();
		},
		onError: (error: Error) => {
			toast({
				description: (
					<div className="flex items-center justify-between w-full space-x-4">
						<X className="text-red-600 ml-auto" />
						<span>{error.message || "Error al crear el enlace"}</span>
					</div>
				),
			});
		},
	});

	const formik = useFormik<ILinkForCreate>({
		initialValues: {
			title: "",
			url: "",
			short_code: "",
			description: "",
			is_active: true,
		},
		validationSchema: toFormikValidationSchema(LinkForCreateSchema),
		validateOnChange: false,
		validateOnBlur: false,
		onSubmit: (values) => {
			createMutation.mutate(values);
		},
	});

	const generateShortCode = () => {
		const randomCode = Math.random().toString(36).substring(2, 8);
		formik.setFieldValue("short_code", randomCode);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>Crear Nuevo Enlace</DialogTitle>
					<DialogDescription>
						Crea un enlace corto personalizado para compartir
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={formik.handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="title">Título *</Label>
						<Input
							id="title"
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
						<Label htmlFor="url">URL de Destino *</Label>
						<Input
							id="url"
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
						<Label htmlFor="short_code">Código Corto *</Label>
						<div className="flex gap-2">
							<Input
								id="short_code"
								name="short_code"
								placeholder="mi-enlace"
								value={formik.values.short_code}
								onChange={formik.handleChange}
								className="flex-1"
							/>
							<Button
								type="button"
								variant="outline"
								onClick={generateShortCode}
							>
								Generar
							</Button>
						</div>
						{formik.errors.short_code && (
							<p className="text-sm text-destructive">
								{formik.errors.short_code}
							</p>
						)}
						<p className="text-sm text-muted-foreground">
							Tu enlace será: {window.location.origin}/r/
							{formik.values.short_code || "..."}
						</p>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Descripción (opcional)</Label>
						<Textarea
							id="description"
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
							<Label htmlFor="is_active">Enlace activo</Label>
							<p className="text-sm text-muted-foreground">
								Los enlaces inactivos no redirigen
							</p>
						</div>
						<Switch
							id="is_active"
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
						<Button type="submit" disabled={createMutation.isPending}>
							{createMutation.isPending ? "Creando..." : "Crear Enlace"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
