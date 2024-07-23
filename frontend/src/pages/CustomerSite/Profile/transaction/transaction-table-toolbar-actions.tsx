import {DownloadIcon} from '@radix-ui/react-icons';
import {type Table} from '@tanstack/react-table';

import {exportTableToCSV} from '@/lib/export';
import {Button} from '@/components/ui/button';
import {CalendarClock, ListFilter, PlusIcon, SearchIcon} from 'lucide-react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {Payment} from '@/models/payment';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {PaymentStatus, PaymentType} from "@/constants/enums.tsx";
import {
  formatDateToISO,
  getEnumValue,
  parseDate,
  parseIntOrUndefined
} from "@/lib/utils.ts";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover.tsx";
import {useEffect} from "react";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useForm} from "react-hook-form";
import {DateTimePicker} from "@/components/time-picker/date-time-picker.tsx";
import {Form, FormField} from "@/components/ui/form.tsx";

interface TransactionsTableToolbarActionsProps {
  table: Table<Payment>;
}

type FormData = {
  from?: Date;
  to?: Date;
  useFrom: boolean;
  useTo: boolean;
  search?: string;
  user?: number;
};

export function TransactionsTableToolbarActions({table}: TransactionsTableToolbarActionsProps) {
  const nav = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const type = getEnumValue(PaymentType, searchParams.get('type')) as PaymentType;
  const status = getEnumValue(PaymentStatus, searchParams.get('status')) as PaymentStatus;
  const form = useForm<FormData>({
    defaultValues: {
      useFrom: parseDate(searchParams.get('from')) !== undefined,
      useTo: parseDate(searchParams.get('to')) !== undefined,
      from: parseDate(searchParams.get('from')),
      to: parseDate(searchParams.get('to')),
      user: parseIntOrUndefined(searchParams.get('user')),
      search: searchParams.get('search'),
    },
  });
  const formValues = form.watch();

  function setParam(key: string, value: any | undefined | null) {
    if (String(value).length === 0) value = undefined;
    if ((!searchParams.has(key) && (value === undefined || value === null)) ||
      (searchParams.has(key) && value === searchParams.get(key))) {
      return;
    }
    if (value) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
    setSearchParams(searchParams, {replace: true});
  }

  useEffect(() => {
    const handleFieldChange = () => {
      setParam('from', formValues.useFrom && formValues.from ? formatDateToISO(formValues.from) : undefined);
      setParam('to', formValues.useTo && formValues.to ? formatDateToISO(formValues.to) : undefined);
      setParam('search', formValues.search);
    };
    handleFieldChange();
  }, [formValues]);

  return (
    <div className="flex justify-between grow">
      <div className="flex gap-2">
        <Form {...form}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ListFilter className="mr-2 size-4"/>
                <span
                  className="sr-only sm:not-sr-only sm:whitespace-nowrap">Status</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuSeparator/>
              <DropdownMenuCheckboxItem
                checked={status === undefined}
                onClick={() => setParam('status', undefined)}
              >All</DropdownMenuCheckboxItem>
              {Object.keys(PaymentStatus).map((s) => (
                <DropdownMenuCheckboxItem
                  checked={status === s}
                  onClick={() => setParam('status', s)}
                >{s}</DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ListFilter className="mr-2 size-4"/>
                <span
                  className="sr-only sm:not-sr-only sm:whitespace-nowrap">Type</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Type</DropdownMenuLabel>
              <DropdownMenuSeparator/>
              <DropdownMenuCheckboxItem
                className="w-9/12"
                checked={type === undefined}
                onClick={() => setParam('type', undefined)}
              >All</DropdownMenuCheckboxItem>
              {Object.keys(PaymentType).map((t) => (
                <div className="flex m-1 items-center justify-between" key={t}>
                  <DropdownMenuCheckboxItem
                    className="w-9/12"
                    checked={type === t}
                    onClick={() => setParam('type', t)}
                  >{t}</DropdownMenuCheckboxItem>
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <CalendarClock className="mr-2 size-4"/>
                <span
                  className="sr-only sm:not-sr-only sm:whitespace-nowrap">Date</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Date Range</h4>
              </div>
              <div className="flex flex-col gap-2 mt-3">
                <div className="flex justify-center items-center gap-2">
                  <FormField
                    control={form.control}
                    name="useFrom"
                    render={({field}) => (
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}/>
                    )}
                  />
                  <DateTimePicker {...form.register("from")}  placeholder='from'/>
                </div>
                <div className="flex justify-center items-center gap-2">
                  <FormField
                    control={form.control}
                    name="useTo"
                    render={({field}) => (
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}/>
                    )}
                  />
                  <DateTimePicker {...form.register("to")}  placeholder='to'/>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <FormField
            control={form.control}
            name="search"
            render={({field}) => (
              <div className="w-full relative">
                <Input {...field}
                       className="px-8 h-9 focus-visible:[box-shadow:none]"/>
                <SearchIcon
                  className="absolute left-1.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 peer-focus:text-gray-900"/>
              </div>
            )}
          />
        </Form>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            exportTableToCSV(table, {
              filename: 'tasks',
              excludeColumns: ['select', 'actions'],
            })
          }
        >
          <DownloadIcon className="mr-2 size-4" aria-hidden="true"/>
          Export
        </Button>
      </div>
    </div>
  );
}
