import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDebounce } from "@/utils/useDebounce";

type FilterType = "text" | "select" | "number";

export type FilterOption = {
	label: string;
	value: string;
};

export type DataTableFilterConfig = {
	key: string;
	label: string;
	type: FilterType;
	options?: FilterOption[];
};

type Props = {
	filters: DataTableFilterConfig[];
};

type TextInputs = Record<string, string | number>;

export function DataTableFilters({ filters }: Props) {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	const [textInputs, setTextInputs] = useState<TextInputs>(() => {
		const initialState: TextInputs = {};
		for (const filter of filters) {
			if (filter.type === "text") {
				initialState[filter.key] = searchParams.get(filter.key) || "";
			}
		}
		return initialState;
	});

	const debouncedInputs = useDebounce(textInputs, 300);

	const updateQuery = (key: string, value: string) => {
		const params = new URLSearchParams(window.location.search);
		if (value) {
			params.set(key, value);
		} else {
			params.delete(key);
		}
		params.set("page", "0"); // reset de paginación
		navigate({ search: params.toString() });
	};

	useEffect(() => {
		for (const [key, value] of Object.entries(debouncedInputs)) {
			updateQuery(key, String(value));
		}
	}, [debouncedInputs]);

	return (
		<div className="flex flex-wrap gap-4 mb-4">
			{filters.map((filter) => {
				const currentValue =
					filter.type === "text"
						? (textInputs[filter.key] ?? "")
						: (searchParams.get(filter.key) ?? "");

				const handleChange = (
					e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
				) => {
					const value = e.target.value;

					if (filter.type === "text") {
						setTextInputs((prev) => ({ ...prev, [filter.key]: value }));
					} else {
						updateQuery(filter.key, value);
					}
				};

				const handleClear = () => {
					if (filter.type === "text") {
						setTextInputs((prev) => ({ ...prev, [filter.key]: "" }));
					} else {
						updateQuery(filter.key, "");
					}
				};

				return (
					<div key={filter.key} className="flex flex-col">
						<label htmlFor={filter.key} className="text-sm mb-1">
							{filter.label}
						</label>

						{filter.type === "text" || filter.type === "number" ? (
							<input
								type={filter.type === "number" ? "number" : "text"}
								value={currentValue}
								onChange={handleChange}
								className="border rounded px-2 py-1"
							/>
						) : (
							<select
								value={currentValue}
								onChange={handleChange}
								className="border rounded px-2 py-1.5"
							>
								<option value="">Todos</option>
								{filter.options?.map((opt) => (
									<option key={opt.value} value={opt.value}>
										{opt.label}
									</option>
								))}
							</select>
						)}

						<button
							type="button"
							onClick={handleClear}
							className="text-xs font-semibold uppercase cursor-pointer mt-2"
						>
							Limpiar
						</button>
					</div>
				);
			})}
		</div>
	);
}
