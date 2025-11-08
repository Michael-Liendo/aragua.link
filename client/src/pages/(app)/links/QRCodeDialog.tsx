import { Download } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/features/ui/useToast";

interface QRCodeDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	url: string;
	title: string;
}

export function QRCodeDialog({
	open,
	onOpenChange,
	url,
	title,
}: QRCodeDialogProps) {
	const downloadQRCode = () => {
		const svg = document.getElementById("qr-code-svg");
		if (!svg) return;

		// Create a canvas element
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Set canvas size
		const size = 512;
		canvas.width = size;
		canvas.height = size;

		// Convert SVG to image
		const svgData = new XMLSerializer().serializeToString(svg);
		const img = new Image();
		const svgBlob = new Blob([svgData], {
			type: "image/svg+xml;charset=utf-8",
		});
		const url_img = URL.createObjectURL(svgBlob);

		img.onload = () => {
			ctx.drawImage(img, 0, 0, size, size);
			URL.revokeObjectURL(url_img);

			// Download as PNG
			canvas.toBlob((blob) => {
				if (!blob) return;
				const url_download = URL.createObjectURL(blob);
				const link = document.createElement("a");
				link.download = `qr-${title.replace(/\s+/g, "-").toLowerCase()}.png`;
				link.href = url_download;
				link.click();
				URL.revokeObjectURL(url_download);

				toast({
					title: "Código QR descargado",
					description: "El código QR se ha descargado exitosamente",
				});
			});
		};

		img.src = url_img;
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Código QR</DialogTitle>
					<DialogDescription>
						Escanea este código QR para acceder a: {title}
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col items-center gap-6 py-6">
					<div className="bg-white p-6 rounded-lg shadow-sm">
						<QRCodeSVG
							id="qr-code-svg"
							value={url}
							size={256}
							level="H"
							includeMargin={true}
						/>
					</div>

					<div className="text-center space-y-2">
						<p className="text-sm font-medium">{title}</p>
						<p className="text-xs text-muted-foreground font-mono break-all">
							{url}
						</p>
					</div>

					<Button onClick={downloadQRCode} className="gap-2 w-full">
						<Download className="h-4 w-4" />
						Descargar Código QR
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
