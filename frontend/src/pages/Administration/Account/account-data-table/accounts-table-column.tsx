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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTableColumnHeader } from '@/components/data-tables/data-table-column-header';
import { Link, useNavigate } from 'react-router-dom';
import { AccountStatus } from '@/constants/enums';
import { ConfirmationDialog } from '@/components/confirmation/confirmation-dialog';
import { activateAccountService, deleteAccountService } from '@/services/AccountsServices';
import { showErrorToast } from '@/lib/handle-error';
import { toast } from 'sonner';
import { Account } from '@/models/AccountModel.tsx';
import AccountTooltip from '@/pages/Administration/Tooltip/AccountTooltip.tsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { BadgeCheck } from 'lucide-react';
import AccountRoleBadge from '@/components/AccountRoleBadge.tsx';

export const getColumns = (): ColumnDef<Account>[] => [
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
    accessorKey: 'accountId',
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <div className="w-2">{row.getValue('accountId')}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'nickname',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nickname" />,
    cell: ({ row }) => {
      return (
        <AccountTooltip account={row.original}>
          <Link to={`/admin/account/${row.original.accountId}`} className="flex justify-center items-center gap-2">
            {row.original.kyc && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <BadgeCheck className="size-5" />
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
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" className="w-20" />,
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[20rem] truncate">{row.getValue('email')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Phone" />,
    cell: ({ row }) => <div>{row.getValue('phone')}</div>,
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
    cell: ({ row }) => {
      return <AccountRoleBadge role={row.original.role} />;
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => (
      <Badge
        variant={row.getValue('status') === AccountStatus.DISABLED ? 'destructive' : 'default'}
        className={row.getValue('status') === AccountStatus.ACTIVE ? 'bg-green-500' : ''}
      >
        {row.getValue('status')}
      </Badge>

      //   {row.getValue("status") == AccountStatus.ACTIVE ?
      //     <Badge variant="default" className="bg-green-500">{AccountStatus[row.status]}</Badge> :
      //     <Badge variant="destructive">{AccountStatus[row.status]}</Badge>}
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  //   {
  //     accessorKey: "createDate",
  //     header: ({ column }) => (
  //       <DataTableColumnHeader column={column} title="Created At" />
  //     ),
  //     cell: ({ row }) => formatDate(new Date(row.getValue("createDate"))),
  //   },
  //   {
  //     accessorKey: "owner.nickname",
  //     header: ({ column }) => (
  //       <DataTableColumnHeader column={column} title="Owner" />
  //     ),
  //     cell: ({ row }) => row.original.owner.nickname,
  //   },
  {
    id: 'actions',
    cell: ({ row }) => {
      const [showDeleteItemDialog, setShowDeleteItemDialog] = React.useState(false);
      const nav = useNavigate();

      const handleEditClick = (accountId: number) => {
        // return (<EditAcc item={item!} key={item!.itemId} hidden={false} />);
        nav(`/admin/accounts/${accountId}`);
      };

      const suspendAccount = (id: string) => {
        setShowDeleteItemDialog(false);
        deleteAccountService(id)
          .then((res) => {
            if (res) {
              window.location.reload();
              toast.success('Account suspended');
            }
          })
          .catch((err) => {
            showErrorToast(err);
          });
      };

      const activateAccount = (id: string) => {
        setShowDeleteItemDialog(false);
        activateAccountService(id)
          .then((res) => {
            if (res) {
              window.location.reload();
              toast.success('Account activated');
            }
          })
          .catch((err) => {
            showErrorToast(err);
          });
      };

      return (
        <>
          {row.original.status == AccountStatus.ACTIVE ? (
            <ConfirmationDialog
              open={showDeleteItemDialog}
              onOpenChange={setShowDeleteItemDialog}
              message={'Are you sure to suspend account ' + row.original.accountId + '?'}
              title={'Suspend Account'}
              label={'Suspend'}
              description={''}
              onSuccess={() => suspendAccount(row.original.accountId.toString())}
            />
          ) : (
            <ConfirmationDialog
              open={showDeleteItemDialog}
              onOpenChange={setShowDeleteItemDialog}
              message={'Are you sure to activate account ' + row.original.accountId + '?'}
              title={'Activate Account'}
              label={'Activate'}
              description={''}
              onSuccess={() => activateAccount(row.original.accountId.toString())}
            />
          )}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button aria-label="Open menu" variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
                <DotsHorizontalIcon className="h-4 w-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onSelect={() => handleEditClick(row.original.accountId)}>Edit</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setShowDeleteItemDialog(true)}>
                {row.original.status == AccountStatus.ACTIVE ? 'Suspend' : 'Activate'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];

export default getColumns;
