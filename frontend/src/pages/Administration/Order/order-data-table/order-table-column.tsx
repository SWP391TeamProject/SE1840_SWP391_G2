import * as React from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTableColumnHeader } from "@/components/data-tables/data-table-column-header"
import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "@/redux/hooks"
import { formatDate } from "@/lib/utils"
import { setCurrentBlogPost } from "@/redux/reducers/Blogs"
import BlogService from "@/services/BlogService"
import { setCurrentOrder } from "@/redux/reducers/Orders"

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
      <DataTableColumnHeader column={column} title="Order ID" />
    ),
    cell: ({ row }) => <div className="w-20">{row.getValue("orderId")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "payment.paymentAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total"  className="w-"/>
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[7.25rem] truncate font-medium">
          ${row.original.payment.paymentAmount}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "shippingAddress",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Shipping Address" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.shippingAddress}
      </div>
    ),
  },
  {
    accessorKey: "payment.status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.payment.status}
      </div>
    ),
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
      const [showUpdateItemSheet, setShowUpdateItemSheet] = React.useState(false)
      const [showDeleteItemDialog, setShowDeleteItemDialog] = React.useState(false)
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