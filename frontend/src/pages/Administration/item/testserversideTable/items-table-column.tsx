import * as React from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTableColumnHeader } from '@/components/data-tables/data-table-column-header';
import { Link, useNavigate } from 'react-router-dom';
import AccountTooltip from '@/pages/Administration/Tooltip/AccountTooltip.tsx';
import { Item } from '@/models/Item.ts';

export const getColumns = (): ColumnDef<Item>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-0.5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-0.5"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'itemId',
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <div className="w-5">{row.getValue('itemId')}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" className="w-" />,
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Badge variant="outline">{row.original.category.name}</Badge>
        <span className="max-w-[10rem] truncate font-medium">{row.getValue('name')}</span>
      </div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'reservePrice',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Reserve Price" />,
    cell: ({ row }) => <div className="font-medium">${row.getValue<number>('reservePrice').toLocaleString()}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => (
      <Badge variant={row.getValue('status') === 'QUEUE' ? 'outline' : 'default'}>{row.getValue('status')}</Badge>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableHiding: true,
  },
  {
    accessorKey: 'createDate',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Create Date" />,
    cell: ({ row }) =>
      new Date(row.getValue('createDate')).getDate() === new Date().getDate()
        ? 'Today'
        : formatDate(row.getValue('createDate')),
    enableHiding: true,
  },
  {
    accessorKey: 'owner.nickname',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Owner" />,
    cell: ({ row }) => {
      return (
        <AccountTooltip account={row.original.owner}>
          <Link to={`/admin/account/${row.original.owner.accountId}`}>{row.original.owner.nickname}</Link>
        </AccountTooltip>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const nav = useNavigate();

      const handleEditClick = (itemId: number) => {
        nav(`/admin/jewelry/${itemId}`);
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label="Open menu" variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
                <DotsHorizontalIcon className="h-4 w-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onSelect={() => handleEditClick(row.original.itemId)}>Edit</DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/jewelries/${row.original.itemId}`} target="_blank">
                  Public View
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];

export default getColumns;
