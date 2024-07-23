import { DownloadIcon } from '@radix-ui/react-icons';
import { type Table } from '@tanstack/react-table';

import { exportTableToCSV } from '@/lib/export';
import { Button } from '@/components/ui/button';
import { CircleDollarSign, ListFilter, PlusIcon, SearchIcon } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import { getEnumValue, parseIntOrUndefined } from '@/lib/utils.ts';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input.tsx';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form.tsx';
import { Order } from '@/constants/interfaces.ts';
import { ItemStatus } from '@/models/Item.ts';
import { getAllItemCategories } from '@/services/ItemCategoryService.ts';
import { showErrorToast } from '@/lib/handle-error.ts';
import { ItemCategory } from '@/models/newModel/itemCategory.ts';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';

interface TasksTableToolbarActionsProps {
  table: Table<Order>;
}

type FormData = {
  minPrice?: number;
  maxPrice?: number;
  search?: string;
};

export function ItemsTableToolbarActions({ table }: TasksTableToolbarActionsProps) {
  const nav = useNavigate();
  const [categories, setCategories] = useState<ItemCategory[]>([]);
  useEffect(() => {
    getAllItemCategories(0, 50)
      .then((res) => {
        setCategories(res.data.content);
      })
      .catch((e) => {
        console.error(e);
        showErrorToast(e);
      });
  }, []);

  const [searchParams, setSearchParams] = useSearchParams();
  const status = getEnumValue(ItemStatus, searchParams.get('status')) as ItemStatus;
  const categoryId = searchParams.get('categoryId');
  const form = useForm<FormData>({
    defaultValues: {
      minPrice: parseIntOrUndefined(searchParams.get('minPrice')),
      maxPrice: parseIntOrUndefined(searchParams.get('maxPrice')),
      search: searchParams.get('search'),
    },
  });
  const formValues = form.watch();

  function setParam(key: string, value: any | undefined | null) {
    if (String(value).length === 0) value = undefined;
    if (
      (!searchParams.has(key) && (value === undefined || value === null)) ||
      (searchParams.has(key) && value === searchParams.get(key))
    ) {
      return;
    }
    if (value) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
    setSearchParams(searchParams, { replace: true });
  }

  useEffect(() => {
    const handleFieldChange = () => {
      setParam('minPrice', formValues.minPrice > 0 ? formValues.minPrice.toString() : undefined);
      setParam('maxPrice', formValues.maxPrice > 0 ? formValues.maxPrice.toString() : undefined);
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
                <ListFilter className="mr-2 size-4" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Status</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked={status === undefined} onClick={() => setParam('status', undefined)}>
                All
              </DropdownMenuCheckboxItem>
              {Object.keys(ItemStatus).map((s) => (
                <DropdownMenuCheckboxItem checked={status === s} onClick={() => setParam('status', s)}>
                  {s}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ListFilter className="mr-2 size-4" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Category</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={categoryId === undefined}
                onClick={() => setParam('categoryId', undefined)}
              >
                All
              </DropdownMenuCheckboxItem>
              {categories.map((ctg) => (
                <DropdownMenuCheckboxItem
                  checked={categoryId === ctg.itemCategoryId.toString()}
                  onClick={() => setParam('categoryId', ctg.itemCategoryId)}
                >
                  {ctg.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <CircleDollarSign className="mr-2 size-4" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Reserve Price</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Price Range</h4>
              </div>
              <div className="flex flex-col gap-2 mt-3">
                <FormField
                  control={form.control}
                  name="minPrice"
                  render={({ field }) => (
                    <FormItem className="flex justify-center items-center gap-2">
                      <FormLabel>Min</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="h-9 focus-visible:[box-shadow:none]" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxPrice"
                  render={({ field }) => (
                    <FormItem className="flex justify-center items-center gap-2">
                      <FormLabel>Max</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="h-9 focus-visible:[box-shadow:none]" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </PopoverContent>
          </Popover>
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <div className="w-full relative">
                <Input {...field} className="px-8 h-9 focus-visible:[box-shadow:none]" />
                <SearchIcon className="absolute left-1.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 peer-focus:text-gray-900" />
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
          <DownloadIcon className="mr-2 size-4" aria-hidden="true" />
          Export
        </Button>
        <Button variant="outline" size="sm" onClick={() => nav('create')}>
          <PlusIcon className="mr-2 size-4" aria-hidden="true" />
          Create
        </Button>
      </div>
    </div>
  );
}
