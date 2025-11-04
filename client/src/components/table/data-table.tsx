import type { IPaginationResponse } from "@aragualink/shared";
import {
	type ColumnDef,
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getSortedRowModel,
	type Row,
	type SortingState,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table";
import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { cn } from "@/utils/cn";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";
import { DataTablePagination } from "./DataTablePagination";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[] | undefined;
	loading?: boolean;
	pagination?: IPaginationResponse;
	grouping?: string[];
	onPageChange?: (pageIndex: number) => void;
	renderExpandedRow?: (rowData: TData) => React.ReactNode;
	onRowClick?: (rowData: TData) => void;
	renderGroupedRow?: (row: Row<TData>) => React.ReactNode;
	defaultExpandedKey?: string;
	route?: string;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	loading,
	route,
	pagination,
	onPageChange,
}: DataTableProps<TData, TValue>) {
	const navigate = useNavigate();

	const [rowSelection, setRowSelection] = useState({});
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [sorting, setSorting] = useState<SortingState>([]);
	const table = useReactTable({
		data: data ?? [],
		columns,
		pageCount: pagination
			? Math.ceil(pagination.total / pagination.limit)
			: undefined,
		state: {
			sorting,
			columnVisibility,
			rowSelection,
			columnFilters,
			pagination: {
				pageIndex: pagination ? pagination.page - 1 : 0, // Convert 1-based to 0-based
				pageSize: pagination ? pagination.limit : 10,
			},
		},
		manualPagination: true,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onPaginationChange: (newPagination) => {
			if (pagination) {
				if (typeof newPagination === "function") {
					onPageChange?.(
						newPagination({
							pageIndex: pagination.page - 1, // Convert 1-based to 0-based
							pageSize: pagination.limit,
						}).pageIndex + 1, // Convert back to 1-based
					);
				} else {
					onPageChange?.(newPagination.pageIndex + 1); // Convert back to 1-based
				}
			}
		},
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
	});

	function handleGoToRoute(id: string | undefined) {
		if (!id || !route) {
			console.warn("Row data id or route is undefined");
			return;
		}
		navigate(`${route}/${id}`);
	}

	return (
		<div className="space-y-4 w-full">
			{/* <DataTableToolbar table={table} /> */}
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id} colSpan={header.colSpan}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{loading ? (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									Loading...
								</TableCell>
							</TableRow>
						) : table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => {
								const rowData = row.original as { id?: string };
								return (
									<TableRow
										key={row.id}
										onClick={() => {
											handleGoToRoute(rowData.id);
										}}
										className={cn({
											"cursor-pointer": !!route,
										})}
										data-state={row.getIsSelected() && "selected"}
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</TableCell>
										))}
									</TableRow>
								);
							})
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									Sin resultados.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			{pagination && <DataTablePagination table={table} />}
		</div>
	);
}
