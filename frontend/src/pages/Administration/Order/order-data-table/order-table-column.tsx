import { type ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/data-tables/data-table-column-header';
import {Link, useNavigate} from 'react-router-dom';
import { useAppDispatch } from '@/redux/hooks';
import { formatDate } from '@/lib/utils';
import { setCurrentOrder } from '@/redux/reducers/Orders';
import { useCurrency } from '@/CurrencyProvider.tsx';
import AccountTooltip from "@/pages/Administration/Tooltip/AccountTooltip.tsx";
import {Order} from "@/models/newModel/order.ts";

export const getColumns = (): ColumnDef<Order>[] => [
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
    accessorKey: 'orderId',
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <div className="w-5">{row.getValue('orderId')}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'payment.account.nickname',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Account" className="w-[50px]" />,
    cell: ({row}) => {
      return (
        <AccountTooltip account={row.original.payment.account}>
          <Link
            to={`/admin/account/${row.original.payment.account.accountId}`}>{row.original.payment.account.nickname}</Link>
        </AccountTooltip>
      );
    },
  },
  {
    accessorKey: 'payment.paymentAmount',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Total" className="w-" />,
    cell: ({ row }) => {
      const currency = useCurrency();

      return (
        <>
          <div className="flex space-x-2">
            <span className="max-w-[10rem] truncate font-medium">
              {currency.format(row.original.payment.paymentAmount)}
            </span>
          </div>
        </>
      );
    },
  },
  {
    accessorKey: 'shippingAddress',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Shipping Address" />,
    cell: ({ row }) => <div className="max-w-[20rem]">{row.original.shippingAddress}</div>,
  },
  {
    accessorKey: 'payment.status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const statusColor = {
        FAILED: 'text-red-500',
        PENDING: 'text-yellow-500',
        PACKAGING: 'text-purple-500',
        DELIVERING: 'text-gray-500',
        DELIVERED: 'text-green-600',
      };

      const status =
        row.original.payment.status == 'SUCCESS' ? row.original.shippingStatus : row.original.payment.status;

      return (
        <>
          <div className={`font-medium capitalize ${statusColor[status]}`}>{status}</div>
        </>
      );
    },
  },
  {
    accessorKey: 'createDate',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
    cell: ({ row }) => <div>{row.original.createDate ? formatDate(new Date(row.original.createDate)) : ''}</div>,
  },
  {
    accessorKey: 'updateDate',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Updated" />,
    cell: ({ row }) => <div>{row.original.updateDate ? formatDate(new Date(row.original.updateDate)) : ''}</div>,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const nav = useNavigate();
      const dispatch = useAppDispatch();

      const handleViewDetailsClick = (row: any) => {
        let order = row.original;
        if (order) {
          dispatch(setCurrentOrder(order));
        }
        nav('/admin/orders/' + row.original.orderId);
      };

      return (
        <>
          <Button size="sm" onClick={() => handleViewDetailsClick(row)}>
            View Details
          </Button>
        </>
      );
    },
  },
];

export default getColumns;
