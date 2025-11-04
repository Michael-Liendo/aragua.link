import {
	SPECIAL_LINK_TEMPLATES,
	type SpecialLinkType,
} from "@aragualink/shared";
import { Check } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";

export interface SpecialLinkSelectorProps {
	onSelect: (url: string, type: SpecialLinkType, code: string) => void;
	onCancel: () => void;
}

export function SpecialLinkSelector({
	onSelect,
	onCancel,
}: SpecialLinkSelectorProps) {
	const [selectedType, setSelectedType] =
		useState<SpecialLinkType>("whatsapp_group");
	const [code, setCode] = useState("");

	const template = SPECIAL_LINK_TEMPLATES[selectedType];

	const handleGenerate = () => {
		if (!code.trim()) return;

		const url = template.urlPattern(code.trim());
		onSelect(url, selectedType, code.trim());
	};

	return (
		<div className="space-y-4">
			<div>
				<h3 className="text-lg font-semibold mb-2">Links Especiales</h3>
				<p className="text-sm text-muted-foreground">
					Selecciona un tipo de link y completa el código
				</p>
			</div>

			<div className="space-y-2">
				<Label>Tipo de Link</Label>
				<Select
					value={selectedType}
					onValueChange={(value) => setSelectedType(value as SpecialLinkType)}
				>
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{Object.values(SPECIAL_LINK_TEMPLATES)
							.filter((t) => t.type !== "custom")
							.map((template) => (
								<SelectItem key={template.type} value={template.type}>
									<div className="flex items-center gap-2">
										<span>{template.icon}</span>
										<span>{template.name}</span>
									</div>
								</SelectItem>
							))}
					</SelectContent>
				</Select>
				<p className="text-xs text-muted-foreground">{template.description}</p>
			</div>

			<div className="space-y-2">
				<Label htmlFor="special-code">
					{selectedType === "whatsapp_chat" ? "Número de teléfono" : "Código"}
				</Label>
				<Input
					id="special-code"
					placeholder={template.placeholder}
					value={code}
					onChange={(e) => setCode(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter" && code.trim()) {
							handleGenerate();
						}
					}}
				/>
				<p className="text-xs text-muted-foreground">
					Ejemplo: {template.placeholder}
				</p>
			</div>

			<div className="flex gap-2 justify-end">
				<Button variant="outline" onClick={onCancel}>
					Cancelar
				</Button>
				<Button
					onClick={handleGenerate}
					disabled={!code.trim()}
					className="gap-2"
				>
					<Check className="h-4 w-4" />
					Usar este Link
				</Button>
			</div>
		</div>
	);
}
