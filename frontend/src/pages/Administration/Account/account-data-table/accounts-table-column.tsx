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
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/redux/hooks';
import { AccountStatus } from '@/constants/enums';
import { DeleteAccountsDialog } from './delete-accounts-dialog';
import { ConfirmationDialog } from '@/components/confirmation/confirmation-dialog';
import { activateAccountService, deleteAccountService } from '@/services/AccountsServices';
import { getErrorMessage, showErrorToast } from '@/lib/handle-error';
import { toast } from 'sonner';
import { set } from 'zod';

// Define the JewelryItem type based on the provided JSON structure
type Account = {
  accountId: number;
  avatar: {
    attachmentId: number;
    createDate: Date;
    link: string;
    updateDate: Date;
  };
  balance: number;
  createDate: string;
  email: string;
  kyc: boolean;
  nickname: string;
  password: string;
  phone: string;
  require2fa: boolean;
  role: string;
  status: string;
  updateDate: Date;
};

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
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" className="w-20" />,
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[20rem] truncate font-medium">{row.getValue('email')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Phone" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue('phone')}</div>,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue('role')}</div>,
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
      const [showUpdateItemSheet, setShowUpdateItemSheet] = React.useState(false);
      const [showDeleteItemDialog, setShowDeleteItemDialog] = React.useState(false);
      const nav = useNavigate();
      const dispatch = useAppDispatch();

      const handleEditClick = (accountId: number) => {
        // return (<EditAcc item={item!} key={item!.itemId} hidden={false} />);
        nav(`/admin/accounts/${accountId}`);
      };

      const suspendAccount = (id: string) => {
        toast.promise(deleteAccountService(id), {
          loading: 'Suspending account...',
          success: (res) => {
            setShowDeleteItemDialog(false);
            return 'Account suspended';
          },
          error: (err) => {
            setShowDeleteItemDialog(false);
            return getErrorMessage(err);
          },
        });
      };

      const activateAccount = (id: string) => {
        toast.promise(activateAccountService(id), {
          loading: 'Activating account...',
          success: (res) => {
            setShowDeleteItemDialog(false);
            return 'Account activated';
          },
          error: (err) => {
            setShowDeleteItemDialog(false);
            return getErrorMessage(err);
          },
        });

        // activateAccountService(id)
        //   .then((res) => {
        //     if (res) {
        //       toast.success('Account activated');
        //     }
        //     setShowDeleteItemDialog(false);
        //   })
        //   .catch((err) => {
        //     showErrorToast(err);
        //   });
      };

      return (
        <>
          {/* Placeholder for UpdateItemSheet and DeleteItemDialog components */}
          {/* <DeleteAccountsDialog
              open={showDeleteItemDialog}
              onOpenChange={setShowDeleteItemDialog}
              items={[row.original]}
              showTrigger={false}
              onSuccess={() => row.toggleSelected(false)}
            /> */}
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
          <DropdownMenu>
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
