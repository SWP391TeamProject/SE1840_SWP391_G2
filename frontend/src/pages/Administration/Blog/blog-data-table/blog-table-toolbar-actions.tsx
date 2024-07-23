import { DownloadIcon } from '@radix-ui/react-icons';
import { type Table } from '@tanstack/react-table';

import { exportTableToCSV } from '@/lib/export';
import { Button } from '@/components/ui/button';
import { ListFilter, PlusIcon, SearchIcon } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormField } from '@/components/ui/form.tsx';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import { Input } from '@/components/ui/input.tsx';
import { showErrorToast } from '@/lib/handle-error.ts';
import BlogCategoryService from '@/services/BlogCategoryService.tsx';
import { AxiosResponse } from 'axios';
import { Page } from '@/models/Page.ts';
import { BlogCategory } from '@/models/newModel/blogCategory.ts';
import { BlogPost } from '@/models/newModel/blogPost.ts';

interface TasksTableToolbarActionsProps {
  table: Table<BlogPost>;
}

type FormData = {
  search?: string;
};

export function BlogsTableToolbarActions({ table }: TasksTableToolbarActionsProps) {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  useEffect(() => {
    BlogCategoryService.getAllBlogCategories(0, 50)
      .then((res: AxiosResponse<Page<BlogCategory>>) => {
        setCategories(res.data.content);
      })
      .catch((e) => {
        console.error(e);
        showErrorToast(e);
      });
  }, []);

  const nav = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get('categoryId');
  const form = useForm<FormData>({
    defaultValues: {
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
                  checked={categoryId === ctg.blogCategoryId.toString()}
                  onClick={() => setParam('categoryId', ctg.blogCategoryId)}
                >
                  {ctg.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
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
