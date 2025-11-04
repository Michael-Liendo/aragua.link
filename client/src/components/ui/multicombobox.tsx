import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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

export interface ComboboxOption {
	value: string;
	label: string;
}

interface MultiSelectComboboxProps {
	options: ComboboxOption[];
	selected: string[];
	onChange: (selected: string[]) => void;
	placeholder?: string;
	className?: string;
}

export function MultiCombobox({
	options,
	selected,
	onChange,
	className,
	placeholder = 'Select options...',
}: MultiSelectComboboxProps) {
	const [open, setOpen] = React.useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					// biome-ignore lint/a11y/useSemanticElements: <explanation>
					role='combobox'
					aria-expanded={open}
					className={cn('w-full justify-between h-auto', className)}
				>
					<div className='flex gap-1 flex-wrap'>
						{selected.length > 0 ? (
							options
								.filter((option) => selected.includes(option.value))
								.map((option) => (
									<Badge
										variant='secondary'
										key={option.value}
										className='mr-1'
									>
										{option.label}
									</Badge>
								))
						) : (
							<span className='text-muted-foreground'>{placeholder}</span>
						)}
					</div>
					<ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-full p-0'>
				<Command className={className}>
					<CommandInput placeholder='Search...' />
					<CommandList>
						<CommandEmpty>No options found.</CommandEmpty>
						<CommandGroup>
							{options.map((option) => (
								<CommandItem
									key={option.value}
									onSelect={() => {
										onChange(
											selected.includes(option.value)
												? selected.filter((item) => item !== option.value)
												: [...selected, option.value],
										);
									}}
								>
									<Check
										className={cn(
											'mr-2 h-4 w-4',
											selected.includes(option.value)
												? 'opacity-100'
												: 'opacity-0',
										)}
									/>
									{option.label}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
