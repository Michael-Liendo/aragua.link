import {
	detectSpecialLinkType,
	extractSpecialLinkCode,
	getSpecialLinkDisplay,
	type ILink,
	SPECIAL_LINK_TEMPLATES,
} from "@aragualink/shared";
import {
	BarChart3,
	Copy,
	Edit,
	ExternalLink,
	GripVertical,
	Lock,
	MoreVertical,
	Power,
	PowerOff,
	QrCode,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/features/ui/useToast";
import { QRCodeDialog } from "./QRCodeDialog";

interface LinksListProps {
	links: ILink[];
	onEdit: (link: ILink) => void;
	onDelete: (id: string) => void;
	onReorder: (links: ILink[]) => void;
	userPlan?: string;
}

export function LinksList({
	links,
	onEdit,
	onDelete,
	userPlan,
}: LinksListProps) {
	const navigate = useNavigate();
	const [qrLink, setQrLink] = useState<ILink | null>(null);
	const isFree = userPlan === "FREE";

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
		toast({
			title: "Copiado",
			description: "El enlace ha sido copiado al portapapeles",
		});
	};

	const getShortUrl = (shortCode: string) => {
		return `${window.location.origin}/${shortCode}`;
	};

	return (
		<div className="space-y-3 sm:space-y-4">
			{links.map((link) => (
				<Card
					key={link.id}
					className="p-3 sm:p-6 hover:shadow-lg transition-shadow overflow-hidden"
				>
					<div className="flex items-start gap-2 sm:gap-4">
						{/* Drag handle - hidden on mobile */}
						<button
							type="button"
							className="hidden sm:block mt-2 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
						>
							<GripVertical className="h-5 w-5" />
						</button>

						{/* Link content */}
						<div className="flex-1 min-w-0 overflow-hidden">
							<div className="flex items-start justify-between gap-2 mb-2">
								<div className="flex-1 min-w-0 overflow-hidden">
									<h3 className="text-sm sm:text-lg font-semibold truncate">
										{link.title}
									</h3>
									{link.description && (
										<p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
											{link.description}
										</p>
									)}
								</div>
								<div className="flex items-center gap-1 shrink-0">
									<Badge
										variant={link.is_active ? "default" : "secondary"}
										className="text-xs px-1.5 sm:px-2.5 h-6"
									>
										{link.is_active ? (
											<>
												<Power className="h-3 w-3 sm:mr-1" />
												<span className="hidden sm:inline">Activo</span>
											</>
										) : (
											<>
												<PowerOff className="h-3 w-3 sm:mr-1" />
												<span className="hidden sm:inline">Inactivo</span>
											</>
										)}
									</Badge>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="ghost"
												size="sm"
												className="h-7 w-7 sm:h-8 sm:w-8 p-0"
											>
												<MoreVertical className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem
												onClick={() => {
													if (isFree) {
														toast({
															title: "Plan PRO requerido",
															description:
																"Actualiza a PRO para acceder a analytics y métricas detalladas.",
														});
														return;
													}
													navigate(`/app/links/${link.id}/analytics`);
												}}
												disabled={isFree}
											>
												{isFree ? (
													<Lock className="h-4 w-4 mr-2" />
												) : (
													<BarChart3 className="h-4 w-4 mr-2" />
												)}
												Ver Analytics {isFree && "(PRO)"}
											</DropdownMenuItem>
											<DropdownMenuItem onClick={() => setQrLink(link)}>
												<QrCode className="h-4 w-4 mr-2" />
												Ver Código QR
											</DropdownMenuItem>
											<DropdownMenuSeparator />
											<DropdownMenuItem onClick={() => onEdit(link)}>
												<Edit className="h-4 w-4 mr-2" />
												Editar
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() =>
													copyToClipboard(getShortUrl(link.short_code))
												}
											>
												<Copy className="h-4 w-4 mr-2" />
												Copiar enlace
											</DropdownMenuItem>
											<DropdownMenuItem asChild>
												<a
													href={getShortUrl(link.short_code)}
													target="_blank"
													rel="noopener noreferrer"
												>
													<ExternalLink className="h-4 w-4 mr-2" />
													Abrir
												</a>
											</DropdownMenuItem>
											<DropdownMenuSeparator />
											<DropdownMenuItem
												onClick={() => onDelete(link.id)}
												className="text-destructive"
											>
												<Trash2 className="h-4 w-4 mr-2" />
												Eliminar
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</div>

							{/* URLs */}
							<div className="space-y-2 mt-3">
								<div className="flex flex-col gap-1 text-xs sm:text-sm overflow-hidden">
									<span className="text-muted-foreground font-medium">
										Enlace corto:
									</span>
									<div className="flex items-center gap-1 min-w-0">
										<code className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-muted rounded text-primary font-mono text-[11px] sm:text-sm truncate flex-1 min-w-0">
											{getShortUrl(link.short_code)}
										</code>
										<Button
											variant="ghost"
											size="sm"
											className="h-6 w-6 p-0 shrink-0"
											onClick={() =>
												copyToClipboard(getShortUrl(link.short_code))
											}
										>
											<Copy className="h-3 w-3" />
										</Button>
									</div>
								</div>
								<div className="flex flex-col gap-1 text-xs sm:text-sm overflow-hidden">
									<span className="text-muted-foreground font-medium">
										Destino:
									</span>
									{(() => {
										// Intentar usar los campos guardados primero
										let type = link.special_type;
										let code = link.special_code;

										// Si no están guardados, detectar automáticamente
										if (!type || !code) {
											const detectedType = detectSpecialLinkType(link.url);
											if (detectedType !== "custom") {
												const extracted = extractSpecialLinkCode(link.url);
												if (extracted) {
													type = extracted.type;
													code = extracted.code;
												}
											}
										}

										// Si es un link especial, mostrar formato especial
										if (type && code && type !== "custom") {
											return (
												<div className="flex items-center gap-1 min-w-0 overflow-hidden">
													<span className="text-sm sm:text-lg shrink-0">
														{SPECIAL_LINK_TEMPLATES[type]?.icon}
													</span>
													<span className="font-medium text-xs sm:text-sm truncate">
														{getSpecialLinkDisplay(type, code)}
													</span>
												</div>
											);
										}

										// Si es un link normal, mostrar URL
										return (
											<a
												href={link.url}
												target="_blank"
												rel="noopener noreferrer"
												className="text-primary hover:underline truncate text-[11px] sm:text-sm block"
											>
												{link.url}
											</a>
										);
									})()}
								</div>
							</div>

							{/* Stats */}
							<div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 pt-3 border-t">
								<div className="flex items-center gap-1.5 text-xs sm:text-sm">
									<BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
									<span className="font-semibold">{link.clicks}</span>
									<span className="text-muted-foreground">clicks</span>
								</div>
								<div className="text-[10px] sm:text-sm text-muted-foreground">
									Creado:{" "}
									{new Date(link.created_at).toLocaleDateString("es-ES", {
										year: "numeric",
										month: "short",
										day: "numeric",
									})}
								</div>
							</div>
						</div>
					</div>
				</Card>
			))}

			{qrLink && (
				<QRCodeDialog
					open={!!qrLink}
					onOpenChange={(open) => !open && setQrLink(null)}
					url={getShortUrl(qrLink.short_code)}
					title={qrLink.title}
				/>
			)}
		</div>
	);
}
