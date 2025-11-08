import {
	type ILinkForCreate,
	LinkForCreateSchema,
	SPECIAL_LINK_TEMPLATES,
	type SpecialLinkType,
} from "@aragualink/shared";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { Check, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { SpecialLinkSelector } from "@/components/SpecialLinkSelector";
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
	userPlan?: string;
}

export function CreateLinkDialog({
	open,
	onOpenChange,
	onSuccess,
	userPlan,
}: CreateLinkDialogProps) {
	const [showSpecialLinks, setShowSpecialLinks] = useState(false);
	const isPro = userPlan === "PRO" || userPlan === "ENTERPRISE";

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
			setShowSpecialLinks(false);
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
			special_type: null,
			special_code: null,
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

	const handleSpecialLinkSelect = (
		url: string,
		type: SpecialLinkType,
		code: string,
	) => {
		formik.setFieldValue("url", url);
		formik.setFieldValue("special_type", type);
		formik.setFieldValue("special_code", code);
		setShowSpecialLinks(false);
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

				{showSpecialLinks ? (
					<SpecialLinkSelector
						onSelect={handleSpecialLinkSelect}
						onCancel={() => setShowSpecialLinks(false)}
					/>
				) : (
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
								<p className="text-sm text-destructive">
									{formik.errors.title}
								</p>
							)}
						</div>

						{/* Mostrar link especial seleccionado o botón para seleccionar */}
						{formik.values.special_type && formik.values.special_code ? (
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<Label>Link Especial Seleccionado</Label>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										onClick={() => {
											formik.setFieldValue("special_type", null);
											formik.setFieldValue("special_code", null);
											formik.setFieldValue("url", "");
										}}
									>
										Cambiar
									</Button>
								</div>
								<div className="p-3 bg-muted rounded-md flex items-center gap-2">
									<span className="text-2xl">
										{SPECIAL_LINK_TEMPLATES[formik.values.special_type]?.icon}
									</span>
									<div>
										<p className="font-medium">
											{SPECIAL_LINK_TEMPLATES[formik.values.special_type]?.name}
										</p>
										<p className="text-sm text-muted-foreground">
											Código: {formik.values.special_code}
										</p>
									</div>
								</div>
							</div>
						) : (
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<Label htmlFor="url">URL de Destino *</Label>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => setShowSpecialLinks(true)}
										className="gap-2"
									>
										<Sparkles className="h-4 w-4" />
										Links Especiales
									</Button>
								</div>
								<Input
									id="url"
									name="url"
									type="url"
									placeholder="https://ejemplo.com"
									value={formik.values.url}
									onChange={formik.handleChange}
								/>
								{formik.errors.url && (
									<p className="text-sm text-destructive">
										{formik.errors.url}
									</p>
								)}
							</div>
						)}

						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<Label htmlFor="short_code">Código Corto *</Label>
								{!isPro && (
									<span className="text-xs text-muted-foreground">
										Personalización disponible en PRO
									</span>
								)}
							</div>
							<div className="flex gap-2">
								<Input
									id="short_code"
									name="short_code"
									placeholder={
										isPro ? "mi-enlace" : "Se generará automáticamente"
									}
									value={formik.values.short_code}
									onChange={formik.handleChange}
									className="flex-1"
									disabled={!isPro}
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
								{isPro ? (
									<>
										Tu enlace será: {window.location.origin}/
										{formik.values.short_code || "..."}
									</>
								) : (
									"Los usuarios FREE reciben códigos generados automáticamente"
								)}
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
				)}
			</DialogContent>
		</Dialog>
	);
}
