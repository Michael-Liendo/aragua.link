import type { ILink } from "@aragualink/shared";
import {
	BarChart3,
	Copy,
	Edit,
	ExternalLink,
	GripVertical,
	MoreVertical,
	Power,
	PowerOff,
	Trash2,
} from "lucide-react";
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

interface LinksListProps {
	links: ILink[];
	onEdit: (link: ILink) => void;
	onDelete: (id: string) => void;
	onReorder: (links: ILink[]) => void;
}

export function LinksList({ links, onEdit, onDelete }: LinksListProps) {
	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
		toast({
			title: "Copiado",
			description: "El enlace ha sido copiado al portapapeles",
		});
	};

	const getShortUrl = (shortCode: string) => {
		return `${window.location.origin}/r/${shortCode}`;
	};

	return (
		<div className="space-y-4">
			{links.map((link) => (
				<Card key={link.id} className="p-6 hover:shadow-lg transition-shadow">
					<div className="flex items-start gap-4">
						{/* Drag handle */}
						<button
							type="button"
							className="mt-2 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
						>
							<GripVertical className="h-5 w-5" />
						</button>

						{/* Link content */}
						<div className="flex-1 min-w-0">
							<div className="flex items-start justify-between gap-4 mb-2">
								<div className="flex-1 min-w-0">
									<h3 className="text-lg font-semibold truncate">
										{link.title}
									</h3>
									{link.description && (
										<p className="text-sm text-muted-foreground mt-1">
											{link.description}
										</p>
									)}
								</div>
								<div className="flex items-center gap-2">
									<Badge variant={link.is_active ? "default" : "secondary"}>
										{link.is_active ? (
											<>
												<Power className="h-3 w-3 mr-1" />
												Activo
											</>
										) : (
											<>
												<PowerOff className="h-3 w-3 mr-1" />
												Inactivo
											</>
										)}
									</Badge>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" size="sm">
												<MoreVertical className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
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
							<div className="space-y-2 mt-4">
								<div className="flex items-center gap-2 text-sm">
									<span className="text-muted-foreground font-medium">
										Enlace corto:
									</span>
									<code className="px-2 py-1 bg-muted rounded text-primary font-mono">
										{getShortUrl(link.short_code)}
									</code>
									<Button
										variant="ghost"
										size="sm"
										onClick={() =>
											copyToClipboard(getShortUrl(link.short_code))
										}
									>
										<Copy className="h-3 w-3" />
									</Button>
								</div>
								<div className="flex items-center gap-2 text-sm">
									<span className="text-muted-foreground font-medium">
										Destino:
									</span>
									<a
										href={link.url}
										target="_blank"
										rel="noopener noreferrer"
										className="text-primary hover:underline truncate max-w-md"
									>
										{link.url}
									</a>
								</div>
							</div>

							{/* Stats */}
							<div className="flex items-center gap-6 mt-4 pt-4 border-t">
								<div className="flex items-center gap-2 text-sm">
									<BarChart3 className="h-4 w-4 text-muted-foreground" />
									<span className="font-semibold">{link.clicks}</span>
									<span className="text-muted-foreground">clicks</span>
								</div>
								<div className="text-sm text-muted-foreground">
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
		</div>
	);
}
