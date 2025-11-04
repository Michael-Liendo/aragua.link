import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

export function ConfirmDialog({
	open,
	setOpen,
	title = "¿Estás seguro?",
	description = "Esta acción no se puede deshacer.",
	confirmText = "Confirmar",
	confirmVariant = "destructive",
	onConfirm,
}: {
	open: boolean;
	setOpen: (open: boolean) => void;
	title?: string;
	description?: string;
	confirmText?: string;
	confirmVariant?:
		| "default"
		| "destructive"
		| "secondary"
		| "outline"
		| "ghost"
		| "link";
	onConfirm: () => Promise<void> | void;
}) {
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>

				<DialogFooter>
					<Button
						variant={confirmVariant}
						onClick={async () => {
							await onConfirm();
							setOpen(false);
						}}
					>
						{confirmText}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
