import * as React from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/data-tables/data-table-column-header"
import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "@/redux/hooks"
import { formatDate } from "@/lib/utils"
import { setCurrentOrder } from "@/redux/reducers/Orders"
import {ShippingStatus} from "@/models/newModel/order.ts";
import {useCurrency} from "@/CurrencyProvider.tsx";

// Define the JewelryItem type based on the provided JSON structure
type Order = {
  orderId: number
  payment: {
    accountId: number
    paymentAmount: number
    date: Date
    id: number
    status: string
    type: string
  }
  auctionItemDTOS: {
    currentPrice: number
    id: {
      auctionSessionId: number
      itemId: number
    }
    itemDTO: {
      attachments: {
        attachmentId: number
        createDate: Date
        link: string
        updateDate: Date
      }[]
      buyInPrice: number
      category: {
        createDate: Date
        itemCategoryId: number
        name: string
      }
      createDate: Date
      description: string
      itemId: number
      name: string
      owner: {
        accountId: number
        avatar: string
        balance: number
        createDate: Date
        email: string
        kyc: boolean
        nickname: string
        password: string
        phone: string
        require2fa: boolean
        role: string
        status: string
        updateDate: Date
      }
      reservePrice: number
      status: string
      updateDate: Date
    }
    numberOfBids: number
  }[]
  shippingAddress: string
  shippingStatus: ShippingStatus
  createDate: Date
}

export const getColumns = (): ColumnDef<Order>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
    accessorKey: "orderId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="w-5">{row.getValue("orderId")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "payment.paymentAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total"  className="w-"/>
    ),
    cell: ({ row }) => {
      const currency = useCurrency();

      return (
        <>
          <div className="flex space-x-2">
          <span className="max-w-[10rem] truncate font-medium">
            {currency.format({amount: row.original.payment.paymentAmount})}
          </span>
          </div>
        </>)
    },
  },
  {
    accessorKey: "payment.accountId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Account" className="w-[50px]" />
    ),
    cell: ({ row }) => (
      <div className="font-medium max-w-[20rem]">
        {row.original.payment.accountId}
      </div>
    ),
  },
  {
    accessorKey: "shippingAddress",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Shipping Address" />
    ),
    cell: ({ row }) => (
      <div className="font-medium max-w-[20rem]">
        {row.original.shippingAddress}
      </div>
    ),
  },
  {
    accessorKey: "payment.status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const currency = useCurrency();

      const statusColor = {
        FAILED: "text-red-500",
        PENDING: "text-yellow-500",
        PACKAGING: "text-purple-500",
        DELIVERING: "text-black-500",
        DELIVERED: "text-green-600",
      };

      const status = row.original.payment.status == "SUCCESS" ?
        row.original.shippingStatus : row.original.payment.status;

      return (
        <>
          <div className={`font-medium capitalize ${statusColor[status]}`}>
            { status }
          </div>
        </>)
    },
  },
  {
    accessorKey: "createDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => (
      <div>
        {row.original.createDate ? formatDate(new Date(row.original.createDate)) : ""}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const  nav = useNavigate();
      const dispatch = useAppDispatch();

      const handleViewDetailsClick = (row: any) => {
        let order = row.original;
        if (order) {
          dispatch(setCurrentOrder(order));
        }
        nav("/admin/orders/" + row.original.orderId);
      }

      return (
        <>
          {/* Placeholder for UpdateItemSheet and DeleteItemDialog components */}
          <Button variant="outline" size="sm" onClick={() => handleViewDetailsClick(row)}>
            View Details
          </Button>
        </>
      )
    },
  }
]

export default getColumns