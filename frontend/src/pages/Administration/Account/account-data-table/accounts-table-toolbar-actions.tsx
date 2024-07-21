import {DownloadIcon} from '@radix-ui/react-icons';
import {type Table} from '@tanstack/react-table';

import {exportTableToCSV} from '@/lib/export';
import {Button} from '@/components/ui/button';
import {DeleteAccountsDialog} from './delete-accounts-dialog';
import {ListFilter, PlusIcon, SearchIcon} from 'lucide-react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {useEffect} from "react";
import {getEnumValue} from "@/lib/utils.ts";
import {useForm} from "react-hook-form";
import {Form, FormField} from "@/components/ui/form.tsx";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Input} from "@/components/ui/input.tsx";
import {AccountStatus, RoleName} from "@/constants/enums.tsx";
import {Account} from "@/models/AccountModel.tsx";

interface TasksTableToolbarActionsProps {
  table: Table<Account>;
}

type FormData = {
  search?: string;
};

export function AccountsTableToolbarActions({table}: TasksTableToolbarActionsProps) {
  const nav = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const status = getEnumValue(AccountStatus, searchParams.get('status')) as AccountStatus;
  const role = getEnumValue(RoleName, searchParams.get('role')) as RoleName;
  const form = useForm<FormData>({
    defaultValues: {
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
      setParam('search', formValues.search);
    };
    handleFieldChange();
  }, [formValues]);

  return (
    <div className="flex justify-between grow">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteAccountsDialog
          items={table.getFilteredSelectedRowModel().rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}
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
              {Object.keys(AccountStatus).map((s) => (
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
                  className="sr-only sm:not-sr-only sm:whitespace-nowrap">Role</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Role</DropdownMenuLabel>
              <DropdownMenuSeparator/>
              <DropdownMenuCheckboxItem
                checked={role === undefined}
                onClick={() => setParam('role', undefined)}
              >All</DropdownMenuCheckboxItem>
              {Object.keys(RoleName).map((s) => (
                <DropdownMenuCheckboxItem
                  checked={role === s}
                  onClick={() => setParam('role', s)}
                >{s}</DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
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
        <Button variant="outline" size="sm" onClick={() => nav('create')}>
          <PlusIcon className="mr-2 size-4" aria-hidden="true"/>
          Create
        </Button>
      </div>
    </div>
  );
}
