import type { ILinkForCreate } from "@aragualink/shared";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, Check, Download, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/features/ui/useToast";
import Services from "@/services";

interface BulkCreateLinkDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess: () => void;
}

export function BulkCreateLinkDialog({
	open,
	onOpenChange,
	onSuccess,
}: BulkCreateLinkDialogProps) {
	const [links, setLinks] = useState<ILinkForCreate[]>([]);
	const [errors, setErrors] = useState<string[]>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const createBulkMutation = useMutation({
		mutationFn: (links: ILinkForCreate[]) => Services.links.createBulk(links),
		onSuccess: (result) => {
			toast({
				description: (
					<div className="flex items-center justify-between w-full space-x-4">
						<Check className="text-green-600 ml-auto" />
						<span>
							{result.success} enlaces creados exitosamente
							{result.failed > 0 && `, ${result.failed} fallidos`}
						</span>
					</div>
				),
			});
			onSuccess();
			setLinks([]);
			setErrors([]);
		},
		onError: (error: Error) => {
			toast({
				description: (
					<div className="flex items-center justify-between w-full space-x-4">
						<X className="text-red-600 ml-auto" />
						<span>{error.message || "Error al crear enlaces masivos"}</span>
					</div>
				),
			});
		},
	});

	const downloadTemplate = () => {
		// Create template data
		const templateData = [
			{
				title: "Ejemplo 1",
				url: "https://ejemplo.com",
				short_code: "ejemplo1",
				description: "Descripción opcional",
				is_active: "true",
			},
			{
				title: "Ejemplo 2",
				url: "https://google.com",
				short_code: "ejemplo2",
				description: "",
				is_active: "true",
			},
		];

		// Create worksheet
		const ws = XLSX.utils.json_to_sheet(templateData);

		// Set column widths
		ws["!cols"] = [
			{ wch: 20 }, // title
			{ wch: 30 }, // url
			{ wch: 15 }, // short_code
			{ wch: 30 }, // description
			{ wch: 10 }, // is_active
		];

		// Create workbook
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "Enlaces");

		// Download
		XLSX.writeFile(wb, "plantilla_enlaces_aragualink.xlsx");

		toast({
			description: (
				<div className="flex items-center justify-between w-full space-x-4">
					<Download className="text-blue-600 ml-auto" />
					<span>Plantilla descargada exitosamente</span>
				</div>
			),
		});
	};

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const data = new Uint8Array(e.target?.result as ArrayBuffer);
				const workbook = XLSX.read(data, { type: "array" });

				// Get first sheet
				const sheetName = workbook.SheetNames[0];
				const worksheet = workbook.Sheets[sheetName];

				// Convert to JSON
				const jsonData = XLSX.utils.sheet_to_json(worksheet) as Array<{
					title: string;
					url: string;
					short_code: string;
					description?: string;
					is_active?: string;
				}>;

				// Validate and transform data
				const validationErrors: string[] = [];
				const validLinks: ILinkForCreate[] = [];

				for (let i = 0; i < jsonData.length; i++) {
					const row = jsonData[i];
					const rowNumber = i + 2; // +2 because Excel is 1-indexed and has header

					// Validate required fields
					if (!row.title) {
						validationErrors.push(`Fila ${rowNumber}: Falta el título`);
						continue;
					}
					if (!row.url) {
						validationErrors.push(`Fila ${rowNumber}: Falta la URL`);
						continue;
					}
					if (!row.short_code) {
						validationErrors.push(`Fila ${rowNumber}: Falta el código corto`);
						continue;
					}

					// Validate URL format
					try {
						new URL(row.url);
					} catch {
						validationErrors.push(`Fila ${rowNumber}: URL inválida`);
						continue;
					}

					// Transform to ILinkForCreate
					validLinks.push({
						title: row.title,
						url: row.url,
						short_code: row.short_code,
						description: row.description || undefined,
						is_active: row.is_active?.toLowerCase() === "false" ? false : true,
					});
				}

				setLinks(validLinks);
				setErrors(validationErrors);

				if (validLinks.length === 0) {
					toast({
						description: (
							<div className="flex items-center justify-between w-full space-x-4">
								<AlertCircle className="text-red-600 ml-auto" />
								<span>No se encontraron enlaces válidos en el archivo</span>
							</div>
						),
					});
				} else {
					toast({
						description: (
							<div className="flex items-center justify-between w-full space-x-4">
								<Check className="text-green-600 ml-auto" />
								<span>{validLinks.length} enlaces cargados correctamente</span>
							</div>
						),
					});
				}
			} catch {
				toast({
					description: (
						<div className="flex items-center justify-between w-full space-x-4">
							<X className="text-red-600 ml-auto" />
							<span>Error al leer el archivo Excel</span>
						</div>
					),
				});
			}
		};

		reader.readAsArrayBuffer(file);

		// Reset input
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleSubmit = () => {
		if (links.length === 0) {
			toast({
				description: (
					<div className="flex items-center justify-between w-full space-x-4">
						<AlertCircle className="text-amber-600 ml-auto" />
						<span>No hay enlaces para crear</span>
					</div>
				),
			});
			return;
		}

		createBulkMutation.mutate(links);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[700px]">
				<DialogHeader>
					<DialogTitle>Crear Enlaces Masivos</DialogTitle>
					<DialogDescription>
						Carga un archivo Excel con múltiples enlaces para crearlos todos a
						la vez
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					{/* Download Template Button */}
					<div className="flex flex-col gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={downloadTemplate}
							className="gap-2"
						>
							<Download className="h-4 w-4" />
							Descargar Plantilla Excel
						</Button>
						<p className="text-sm text-muted-foreground">
							Descarga la plantilla, complétala con tus enlaces y súbela aquí
						</p>
					</div>

					{/* Upload File */}
					<div className="flex flex-col gap-2">
						<input
							ref={fileInputRef}
							type="file"
							accept=".xlsx,.xls"
							onChange={handleFileUpload}
							className="hidden"
							id="file-upload"
						/>
						<Button
							type="button"
							variant="default"
							onClick={() => fileInputRef.current?.click()}
							className="gap-2"
						>
							<Upload className="h-4 w-4" />
							Subir Archivo Excel
						</Button>
					</div>

					{/* Validation Errors */}
					{errors.length > 0 && (
						<Alert variant="destructive">
							<AlertCircle className="h-4 w-4" />
							<AlertTitle>Errores de validación</AlertTitle>
							<AlertDescription>
								<ul className="list-disc list-inside space-y-1 mt-2">
									{errors.slice(0, 5).map((error, index) => (
										<li key={index} className="text-sm">
											{error}
										</li>
									))}
									{errors.length > 5 && (
										<li className="text-sm font-medium">
											... y {errors.length - 5} errores más
										</li>
									)}
								</ul>
							</AlertDescription>
						</Alert>
					)}

					{/* Success Info */}
					{links.length > 0 && (
						<Alert>
							<Check className="h-4 w-4" />
							<AlertTitle>Enlaces listos para crear</AlertTitle>
							<AlertDescription>
								Se crearán {links.length} enlaces
								{errors.length > 0 && ` (${errors.length} filas con errores)`}
							</AlertDescription>
						</Alert>
					)}

					{/* Preview Table */}
					{links.length > 0 && (
						<div className="border rounded-md overflow-hidden">
							<div className="max-h-[300px] overflow-y-auto">
								<table className="w-full text-sm">
									<thead className="bg-muted sticky top-0">
										<tr>
											<th className="text-left p-2 font-medium">Título</th>
											<th className="text-left p-2 font-medium">URL</th>
											<th className="text-left p-2 font-medium">
												Código Corto
											</th>
										</tr>
									</thead>
									<tbody>
										{links.slice(0, 10).map((link, index) => (
											<tr key={index} className="border-t">
												<td className="p-2">{link.title}</td>
												<td className="p-2 truncate max-w-[200px]">
													{link.url}
												</td>
												<td className="p-2">{link.short_code}</td>
											</tr>
										))}
										{links.length > 10 && (
											<tr className="border-t bg-muted/50">
												<td colSpan={3} className="p-2 text-center">
													... y {links.length - 10} enlaces más
												</td>
											</tr>
										)}
									</tbody>
								</table>
							</div>
						</div>
					)}
				</div>

				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						onClick={() => {
							onOpenChange(false);
							setLinks([]);
							setErrors([]);
						}}
					>
						Cancelar
					</Button>
					<Button
						type="button"
						onClick={handleSubmit}
						disabled={links.length === 0 || createBulkMutation.isPending}
					>
						{createBulkMutation.isPending
							? "Creando..."
							: `Crear ${links.length} Enlaces`}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
