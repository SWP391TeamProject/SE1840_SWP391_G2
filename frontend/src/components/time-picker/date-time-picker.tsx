'use client';

import { add, format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TimePickerDemo } from './time-picker-demo';

interface DateTimePickerProps {
  name: string;
  placeholder?: string;
}

export function DateTimePicker({ name, placeholder }: DateTimePickerProps) {
  const { setValue, watch } = useFormContext();
  const date = watch(name);

  const handleSelect = (newDay: Date | undefined) => {
    if (!newDay) return;
    if (!date) {
      setValue(name, newDay);
      return;
    }
    const diff = newDay.getTime() - date.getTime();
    const diffInDays = diff / (1000 * 60 * 60 * 24);
    const newDateFull = add(date, { days: Math.ceil(diffInDays) });
    setValue(name, newDateFull);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn('w-[280px] justify-start text-left font-normal', !date && 'text-muted-foreground')}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP HH:mm:ss') : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={(d) => handleSelect(d)} initialFocus />
        <div className="p-3 border-t border-border">
          <TimePickerDemo setDate={(newTime) => setValue(name, newTime)} date={date} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
