import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/data-tables/data-table-column-header';
import { Payment } from '@/models/payment.ts';
import { formatDate } from '@/lib/utils.ts';
import { Link } from 'react-router-dom';
import { useCurrency } from '@/CurrencyProvider.tsx';
import { PaymentType } from '@/constants/enums.tsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button.tsx';

export const getColumns = (): ColumnDef<Payment>[] => [
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
      const currency = useCurrency();
      return <div className="font-medium">{currency.format(row.original.paymentAmount)}</div>;
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
    accessorKey: 'method',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Method" />,
    cell: ({ row }) => row.getValue('method') || 'N/A',
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge variant={status === 'SUCCESS' ? 'success' : status === 'PENDING' ? 'secondary' : 'destructive'}>
          {status}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'createDate',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Create Date" />,
    cell: ({ row }) => {
      return <div>{formatDate(row.getValue('createDate'))}</div>;
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      switch (row.original.type) {
        case PaymentType.DEPOSIT: {
          if (row.original.status === 'FAILED') {
            return (
              <Dialog>
                <DialogTrigger>
                  <Button size="sm">View reason</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Failure reason</DialogTitle>
                    <DialogDescription>{row.original.failedReason}</DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            );
          }
          return <></>;
        }
        case PaymentType.WITHDRAW: {
          if (row.original.status === 'FAILED') {
            return (
              <Dialog>
                <DialogTrigger>
                  <Button size="sm">View reason</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Failure reason</DialogTitle>
                    <DialogDescription>{row.original.failedReason}</DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            );
          }
          return <></>;
        }
        case PaymentType.AUCTION_DEPOSIT: {
          return (
            <Button size="sm" asChild>
              <Link to={`/auctions/${row.original.depositAuctionId}`} target="_blank">
                View auction
              </Link>
            </Button>
          );
        }
        case PaymentType.AUCTION_ORDER: {
          return (
            <Button size="sm" asChild>
              <Link to={`/dashboard/order/${row.original.id}`} target="_blank">
                View order
              </Link>
            </Button>
          );
        }
        case PaymentType.CONSIGNMENT_REWARD: {
          return (
            <Button size="sm" asChild>
              <Link to={`/item/${row.original.consignmentRewardItemId}`} target="_blank">
                View item
              </Link>
            </Button>
          );
        }
      }
    },
  },
];

export default getColumns;
