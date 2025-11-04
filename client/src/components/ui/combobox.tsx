'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/utils/cn';

interface ComboboxProps<T extends { value: string; label: string }> {
	items?: T[]; // Datos fijos
	fetchItems?: (query: string) => Promise<T[]>; // Función para datos dinámicos
	placeholder?: string;
	searchPlaceholder?: string;
	onChange?: (value: string) => void;
	value?: string;
	defaultItem?: T;
}

export function Combobox<T extends { value: string; label: string }>({
	items,
	fetchItems,
	placeholder = 'Select...',
	searchPlaceholder = 'Search...',
	onChange,
	value: controlledValue,
	defaultItem
}: ComboboxProps<T>) {
	const [open, setOpen] = React.useState(false);
	const [inputValue, setInputValue] = React.useState('');
	const [options, setOptions] = React.useState<T[]>(items || []);
	const [loading, setLoading] = React.useState(false);
	const [value, setValue] = React.useState(controlledValue || '');

	const mergedOptions = React.useMemo(() => {
		if (!defaultItem) return options;
		const exists = options.some(opt => opt.value === defaultItem.value);
		return exists ? options : [defaultItem, ...options];
	}, [options, defaultItem]);


	React.useEffect(() => {
		if (!fetchItems) return;

		let active = true;

		const delayDebounce = setTimeout(() => {
			setLoading(true);

			const query = inputValue || '';
			fetchItems(query)
				.then((data) => {
					if (!active) return;
					setOptions(data);
				})
				.finally(() => {
					if (active) setLoading(false);
				});
		}, 300);

		return () => {
			active = false;
			clearTimeout(delayDebounce);
		};
	}, [inputValue, fetchItems]);


	const displayLabel = mergedOptions.find(opt => opt.value === value)?.label || placeholder;

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					// biome-ignore lint/a11y/useSemanticElements: no exists that role
					role='combobox'
					aria-expanded={open}
					className='w-full justify-between'
				>
					{displayLabel}
					<ChevronsUpDown className='opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-full p-0'>
				<Command>
					<CommandInput
						placeholder={searchPlaceholder}
						className='h-9'
						value={inputValue}
						onValueChange={setInputValue}
					/>
					<CommandList>
						{loading ? (
							<div className='flex items-center justify-center py-2'>
								<Loader2 className='h-4 w-4 animate-spin' />
							</div>
						) : (
							<>
								<CommandEmpty>No se encontró ningún resultado.</CommandEmpty>
								<CommandGroup>
									{mergedOptions.map((opt) => (
										<CommandItem
											key={opt.value}
											value={`${opt.value} ${opt.label}`} 
											onSelect={() => {
												setValue(opt.value);
												onChange?.(opt.value);
												setOpen(false);
											}}
										>
											{opt.label}
											<Check
												className={cn(
													'ml-auto',
													value === opt.value ? 'opacity-100' : 'opacity-0',
												)}
											/>
										</CommandItem>
									))}
								</CommandGroup>
							</>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
