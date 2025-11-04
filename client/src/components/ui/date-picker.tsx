import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/utils/cn';
import { useState, useEffect } from 'react';

export function DatePicker({
	date,
	setDate,
	withTime = false,
}: {
	date: Date;
	setDate: (date: Date) => void;
	withTime?: boolean;
}) {
	const [time, setTime] = useState(() => format(date, 'HH:mm'));

	useEffect(() => {
		if (date) {
			setTime(format(date, 'HH:mm'));
		}
	}, [date]);

	const onTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newTime = e.target.value;
		setTime(newTime);

		const [hours, minutes] = newTime.split(':').map(Number);
		const updatedDate = new Date(date);
		updatedDate.setHours(hours);
		updatedDate.setMinutes(minutes);
		updatedDate.setSeconds(0);
		updatedDate.setMilliseconds(0);

		setDate(updatedDate);
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={'outline'}
					className={cn(
						'w-[240px] justify-start text-left font-normal',
						!date && 'text-muted-foreground',
					)}
				>
					<CalendarIcon className='mr-2 h-4 w-4' />
					{date ? (
						format(date, withTime ? 'PPP p' : 'PPP', { locale: es })
					) : (
						<span>Selecciona</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-auto p-4' align='start'>
				<Calendar
					mode='single'
					locale={es}
					selected={date}
					onSelect={(day) => {
						if (day) {
							const newDate = new Date(day);
							if (withTime) {
								newDate.setHours(date.getHours());
								newDate.setMinutes(date.getMinutes());
							}
							setDate(newDate);
						}
					}}
					initialFocus
				/>
				{withTime && (
					<div className='mt-4'>
						<label
							htmlFor='timepicker'
							className='block text-sm font-medium text-gray-700 mb-1'
						>
							Hora
						</label>
						<input
							id='timepicker'
							type='time'
							className='w-full border rounded px-2 py-1'
							value={time}
							onChange={onTimeChange}
						/>
					</div>
				)}
			</PopoverContent>
		</Popover>
	);
}
