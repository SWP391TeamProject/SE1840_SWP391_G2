import * as React from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTableColumnHeader } from '@/components/data-tables/data-table-column-header';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/redux/hooks';
import { AccountStatus, AuctionSessionStatus } from '@/constants/enums';
import {formatDate, formatDateTime} from '@/lib/utils';
import { MoreHorizontal } from 'lucide-react';
import { setCurrentAuctionSession } from '@/redux/reducers/AuctionSession';

// Define the JewelryItem type based on the provided JSON structure
type AuctionSession = {
  auctionSessionId: number;
  auctionItems: any[];
  attachments: any[];
  deposits: any[];
  endDate: Date;
  startDate: Date;
  title: string;
  status: string;
  updateDate: Date;
  participantCount: number;
};

export const getColumns = (): ColumnDef<AuctionSession>[] => [
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
    accessorKey: 'auctionSessionId',
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <div className="w-3">{row.getValue('auctionSessionId')}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Title" className="w-" />,
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[7.25rem] truncate font-medium">{row.getValue('title')}</span>
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'startDate',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Start Date" />,
    cell: ({ row }) => formatDateTime(new Date(row.getValue('startDate'))),
    enableSorting: true,
  },
  {
    accessorKey: 'endDate',
    header: ({ column }) => <DataTableColumnHeader column={column} title="End Date" />,
    cell: ({ row }) => formatDateTime(new Date(row.getValue('endDate'))),
    enableSorting: true,
  },
  {
    accessorKey: 'participantCount',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Participant" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue('participantCount')}</div>,
    enableSorting: true,
  },
  {
    accessorKey: 'auctionItems',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Lots" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue('auctionItems')?.length}</div>,
    enableSorting: true,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      switch (row.original.status) {
        case AuctionSessionStatus.PROGRESSING:
          return (
            <Badge variant="default" className="bg-yellow-500 w-[150px] text-center flex justify-center items-center">
              Progressing
            </Badge>
          );
        case AuctionSessionStatus.FINISHED:
          return (
            <Badge variant="default" className="bg-green-500 w-[150px] text-center flex justify-center items-center">
              Finished
            </Badge>
          );
        case AuctionSessionStatus.SCHEDULED:
          return (
            <Badge variant="default" className="bg-blue-500 w-[150px] text-center flex justify-center items-center">
              Scheduled
            </Badge>
          );
        case AuctionSessionStatus.TERMINATED:
          return (
            <Badge variant="default" className="bg-red-500 w-[150px] text-center flex justify-center items-center">
              Terminated
            </Badge>
          );
        default:
          return <Badge variant="destructive">Unknown Status</Badge>;
      }
    },

    //   {row.getValue("status") == ConsignmentStatus.ACTIVE ?
    //     <Badge variant="default" className="bg-green-500">{ConsignmentStatus[row.status]}</Badge> :
    //     <Badge variant="destructive">{ConsignmentStatus[row.status]}</Badge>}
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const [showUpdateItemSheet, setShowUpdateItemSheet] = React.useState(false);
      const [showDeleteItemDialog, setShowDeleteItemDialog] = React.useState(false);
      const nav = useNavigate();
      const dispatch = useAppDispatch();

      const handleDetailClick = (auctionSession: any) => {
        dispatch(setCurrentAuctionSession(auctionSession));
        nav(`/admin/auction-sessions/${auctionSession.auctionSessionId}`);
      };

      const handleAssignAuctionItemClick = (auctionSession: any) => {
        dispatch(setCurrentAuctionSession(auctionSession));
        nav(`/admin/auction-sessions/${auctionSession.auctionSessionId}/assign-items`);
      };
      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  handleDetailClick(row.original);
                }}
              >
                Detail
              </DropdownMenuItem>
              {row.original.status === AuctionSessionStatus.SCHEDULED && (
                <DropdownMenuItem
                  onClick={() => {
                    handleAssignAuctionItemClick(row.original);
                  }}
                >
                  Assign Items
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];

export default getColumns;
