import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/data-tables/data-table-column-header';

// Define the Transaction type based on the provided data structure
type Transaction = {
  id: number;
  paymentAmount: number;
  date: string;
  type: 'DEPOSIT' | 'AUCTION_DEPOSIT';
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  method: string | null;
  accountId: number;
};

export const getColumns = (): ColumnDef<Transaction>[] => [
  {
    accessorKey: 'paymentId',
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <div className="w-5">{row.original.id}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'paymentAmount',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
    cell: ({ row }) => {
      const paymentAmount = parseFloat(row.getValue('paymentAmount'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(paymentAmount);
      return <div className="font-medium">{formatted}</div>;
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'createDate',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Create Date" />,
    cell: ({ row }) => {
      console.log(row.getValue('createDate'));
      const date = new Date(row.getValue('createDate'));
      return <div>{date.toLocaleString()}</div>;
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'type',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
    cell: ({ row }) => {
      const type = row.getValue('type') as string;
      return (
        <Badge variant="outline" className="capitalize">
          {type.toLowerCase().replace('_', ' ')}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge 
          variant={status === 'SUCCESS' ? 'default' : status === 'PENDING' ? 'secondary' : 'destructive'}
        >
          {status}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'method',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Method" />,
    cell: ({ row }) => row.getValue('method') || 'N/A',
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'account.accountId',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Account ID" />,
    cell: ({ row }) => row.original.accountId,
    enableSorting: true,
    enableHiding: true,
  },
];

export default getColumns;