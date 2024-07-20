import { DataTableColumnHeader } from '@/components/data-tables/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PaymentStatus, PaymentType } from '@/constants/enums';
import { useCurrency } from '@/CurrencyProvider';
import { formatDate } from '@/lib/utils';
import { method } from '@/models/payment';
import { ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

interface Payment {
  accountId: number;
  consignmentRewardItemId: number;
  createDate: Date;
  depositAuctionId: number;
  id: number;
  method: method;
  paymentAmount: number;
  status: PaymentStatus;
  type: PaymentType;
}
export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'createDate',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    enableSorting: true,
    cell: ({ row }) => {
      return <div>{formatDate(row.original.createDate)}</div>;
    },
  },

  {
    accessorKey: 'paymentAmount',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
    enableSorting: true,
    cell: ({ row }) => {
      const currency = useCurrency();
      return <div>{currency.format(row.original.paymentAmount)}</div>;
    },
  },

  {
    accessorKey: 'method',
    header: 'Method',
    cell: ({ row }) => {
      return (
        <div>
          {(() => {
            switch (row.original.method) {
              case 'VNPAY':
                return (
                  <Badge variant="default" className="bg-blue-100 text-blue-800">
                    VNPAY
                  </Badge>
                );
              case 'PAYPAL':
                return (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    PaypalL
                  </Badge>
                );
              default:
                return (
                  <Badge variant="outline" className="bg-gray-100 text-gray-800">
                    Manual
                  </Badge>
                );
            }
          })()}
        </div>
      );
    },
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      return (
        <div>
          {(() => {
            switch (row.original.type) {
              case 'DEPOSIT':
                return (
                  <Badge variant="default" className="bg-blue-100 text-blue-800">
                    Deposit
                  </Badge>
                );
              case 'WITHDRAW':
                return (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Withdraw
                  </Badge>
                );
              case 'AUCTION_DEPOSIT':
                return (
                  <Badge variant="default" className="bg-purple-100 text-purple-800">
                    Auction Deposit
                  </Badge>
                );
              case 'AUCTION_BID':
                return (
                  <Badge variant="default" className="bg-red-100 text-red-800">
                    Auction Bid
                  </Badge>
                );
              case 'AUCTION_ORDER':
                return (
                  <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                    Auction Order
                  </Badge>
                );
              case 'AUCTION_DEPOSIT_REFUND':
                return (
                  <Badge variant="default" className="bg-orange-100 text-orange-800">
                    Auction Deposit Refund
                  </Badge>
                );
              case 'CONSIGNMENT_REWARD':
                return (
                  <Badge variant="default" className="bg-teal-100 text-teal-800">
                    Consignment Reward
                  </Badge>
                );
              default:
                return (
                  <Badge variant="outline" className="bg-gray-100 text-gray-800">
                    Unknown
                  </Badge>
                );
            }
          })()}
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      return (
        <div>
          {(() => {
            switch (row.original.status) {
              case 'SUCCESS':
                return <Badge variant="default">Success</Badge>;
              case 'FAILED':
                return <Badge variant="destructive">Failed</Badge>;
              case 'PENDING':
                return <Badge variant="secondary">Pending</Badge>;
              default:
                return <Badge variant="default">Unknown</Badge>;
            }
          })()}
        </div>
      );
    },
  },
  {
    accessorKey: 'Action',
    header: 'Action',
    cell: ({ row }) => {
      const nav = useNavigate();

      switch (row.original.type) {
        case 'AUCTION_DEPOSIT':
          return (
            <div>
              <Button
                variant="link"
                onClick={() => {
                  nav(`/auctions/${row.original.depositAuctionId}`);
                }}
              >
                Go to auction
              </Button>
            </div>
          );
        case 'AUCTION_ORDER':
          return (
            <div>
              <Button
                variant="link"
                onClick={() => {
                  nav(`/dashboard/orders/checkout/${row.original.id}`);
                }}
              >
                order details
              </Button>
            </div>
          );
        case 'AUCTION_DEPOSIT_REFUND':
          return (
            <div>
              <Button variant="link">DetaIls</Button>
            </div>
          );
        case 'CONSIGNMENT_REWARD':
          return (
            <div>
              <Button variant="link">DetaIls</Button>
            </div>
          );
        default:
      }

      return (
        <div>
          <Button variant="link">DetaIls</Button>
        </div>
      );
    },
  },
];
