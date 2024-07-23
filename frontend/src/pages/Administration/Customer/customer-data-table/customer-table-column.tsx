import {type ColumnDef} from '@tanstack/react-table';
import {Badge} from '@/components/ui/badge';
import {
  DataTableColumnHeader
} from '@/components/data-tables/data-table-column-header';
import {Link, useNavigate} from 'react-router-dom';
import {AccountStatus} from '@/constants/enums';
import {Account} from "@/models/AccountModel.tsx";
import AccountTooltip from "@/pages/Administration/Tooltip/AccountTooltip.tsx";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip.tsx";
import {BadgeCheck} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {DotsHorizontalIcon} from "@radix-ui/react-icons";
import AccountRoleBadge from "@/components/AccountRoleBadge.tsx";
import * as React from "react";

export const getColumns = (): ColumnDef<Account>[] => [
  {
    accessorKey: 'accountId',
    header: ({column}) => <DataTableColumnHeader column={column} title="ID"/>,
    cell: ({row}) => <div className="w-2">{row.getValue('accountId')}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'nickname',
    header: ({column}) => <DataTableColumnHeader column={column}
                                                 title="Nickname"/>,
    cell: ({row}) => {
      return (
        <AccountTooltip account={row.original}>
          <Link
            to={`/admin/customers/${row.original.accountId}`}
            className="flex justify-center items-center gap-2">
            {row.original.kyc && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <BadgeCheck className="size-5"/>
                </TooltipTrigger>
                <TooltipContent>
                  <p>KYC Verified</p>
                </TooltipContent>
              </Tooltip>
            )}
            {row.original.nickname}
          </Link>
        </AccountTooltip>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'email',
    header: ({column}) => <DataTableColumnHeader column={column} title="Email"
                                                 className="w-20"/>,
    cell: ({row}) => (
      <div className="flex space-x-2">
        <span className="max-w-[20rem] truncate">{row.getValue('email')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'phone',
    header: ({column}) => <DataTableColumnHeader column={column}
                                                 title="Phone"/>,
    cell: ({row}) => <div>{row.getValue('phone')}</div>,
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: 'role',
    header: ({column}) => <DataTableColumnHeader column={column} title="Role"/>,
    cell: ({row}) => {
      return (<AccountRoleBadge role={row.original.role}/>);
    },
  },
  {
    accessorKey: 'status',
    header: ({column}) => <DataTableColumnHeader column={column}
                                                 title="Status"/>,
    cell: ({row}) => (
      <Badge
        variant={row.getValue('status') === AccountStatus.DISABLED ? 'destructive' : 'default'}
        className={row.getValue('status') === AccountStatus.ACTIVE ? 'bg-green-500' : ''}
      >
        {row.getValue('status')}
      </Badge>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: 'actions',
    cell: ({row}) => {
      const nav = useNavigate();

      const handleDetailsClick = (accountId: number) => {
        nav(`/admin/customers/${accountId}`);
      };

      return (
        <>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button aria-label="Open menu" variant="ghost"
                      className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
                <DotsHorizontalIcon className="h-4 w-4" aria-hidden="true"/>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onSelect={() => handleDetailsClick(row.original.accountId)}>Details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];

export default getColumns;
