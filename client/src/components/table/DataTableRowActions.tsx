"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModals } from "@/features/ui/useModal";
import { toast } from "@/features/ui/useToast";
import { handleApiError } from "@/utils/handleApiError";

interface DataTableRowActionsProps<
	TData extends { id?: string | number; reference?: string | number },
> {
	row: Row<TData>;
	showEditButton: true;

	canDelete?: boolean;
	deleteMutationFn?: (row: Row<TData>) => Promise<boolean>;
	onDeleteSuccess?: () => void;
	onDeleteError?: (error: unknown) => void;

	showValidateButton?: (rowData: TData) => boolean;
	validateMutationFn?: (row: Row<TData>) => Promise<boolean>;
	onValidateSuccess?: () => void;
	onValidateError?: (error: unknown) => void;

	invalidateQueryKey?: string[];
	isValidationPending?: boolean;

	successMessage?: string;
	errorMessage?: string;
}

export function DataTableRowActions<TData extends { id?: string | number }>({
	row,
	showEditButton,
	canDelete = true,
	deleteMutationFn,
	onDeleteSuccess,
	onDeleteError,
	validateMutationFn,
	onValidateSuccess,
	onValidateError,
	showValidateButton,
	invalidateQueryKey,
	isValidationPending,
	successMessage,
	errorMessage,
}: DataTableRowActionsProps<TData>) {
	const queryClient = useQueryClient();
	const [confirmDelete, setConfirmDelete] = useState(false);

	const { openModal } = useModals();
	const modalKey = `edit-${row.original.id}`;

	const deleteMutation = useMutation({
		mutationFn: async () => {
			if (!deleteMutationFn)
				throw new Error("No delete mutation function provided");
			return await deleteMutationFn(row);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: invalidateQueryKey });
			toast.success(successMessage || "Eliminado con éxito");
			setConfirmDelete(false);
			onDeleteSuccess?.();
		},
		onError: (err) => {
			handleApiError(err, errorMessage || "Error al eliminar");
			onDeleteError?.(err);
		},
	});

	const validateMutation = useMutation({
		mutationFn: async () => {
			if (!validateMutationFn)
				throw new Error("No validate mutation function provided");
			return await validateMutationFn(row);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: invalidateQueryKey });
			toast.success("Elemento validado");
			onValidateSuccess?.();
		},
		onError: (err) => {
			handleApiError(err, "Error al validar");
			onValidateError?.(err);
		},
	});

	const handleValidate = () => {
		if (validateMutationFn) {
			validateMutation.mutate();
		}
	};

	return (
		<div className="flex items-center">
			{showValidateButton?.(row.original) && (
				<Button
					onClick={handleValidate}
					disabled={validateMutation.isPending || isValidationPending}
				>
					Validar
				</Button>
			)}
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
					>
						<MoreHorizontal />
						<span className="sr-only">Abrir menú</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-[160px]">
					{showEditButton && (
						<DropdownMenuItem onClick={() => openModal(modalKey)}>
							Editar
						</DropdownMenuItem>
					)}
					<DropdownMenuSeparator />
					{canDelete && (
						<DropdownMenuItem
							onClick={() => setConfirmDelete(true)}
							variant="destructive"
						>
							Eliminar
						</DropdownMenuItem>
					)}
				</DropdownMenuContent>
			</DropdownMenu>

			<Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>¿Estás seguro que deseas eliminar?</DialogTitle>
						<DialogDescription>
							Esta acción no se puede deshacer.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="destructive"
							onClick={() => deleteMutation.mutate()}
							disabled={deleteMutation.isPending}
						>
							Eliminar
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
