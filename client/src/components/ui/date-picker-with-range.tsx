'use client';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import type { DateRange, Matcher } from 'react-day-picker';

import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { es } from 'date-fns/locale';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';

export function DatePickerWithRange({
	className,
	date,
	setDate,
	maxDate,
}: React.HTMLAttributes<HTMLDivElement> & {
	date: DateRange | undefined;
	setDate: (date: DateRange) => void;
	maxDate?: Date;
}) {

	const nextYear = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

	const matcher: Matcher = {
		after: maxDate ?? nextYear,
	};

	return (
		<div className={cn('grid gap-2', className)}>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id='date'
						variant={'outline'}
						className={cn(
							'w-[300px] justify-start text-left font-normal',
							!date && 'text-muted-foreground',
						)}
					>
						<CalendarIcon />
						{date?.from ? (
							date.to ? (
								<>
									{format(date.from, 'LLL dd, y', { locale: es })} -{' '}
									{format(date.to, 'LLL dd, y', { locale: es })}
								</>
							) : (
								format(date.from, 'LLL dd, y', { locale: es })
							)
						) : (
							<span>Selecciona una fecha</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-auto p-0' align='start'>
					<Calendar
						initialFocus
						mode='range'
						defaultMonth={date?.from}
						selected={date}
						onSelect={(range) => range && setDate(range)}
						numberOfMonths={2}
						locale={es}
						disabled={matcher}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}
