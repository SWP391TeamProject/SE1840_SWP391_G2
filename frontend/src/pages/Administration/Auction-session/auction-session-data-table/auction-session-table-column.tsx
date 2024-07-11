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
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTableColumnHeader } from "@/components/data-tables/data-table-column-header"
import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "@/redux/hooks"
import { AccountStatus } from "@/constants/enums"
import { formatDate } from "@/lib/utils"
import { MoreHorizontal } from "lucide-react"

// Define the JewelryItem type based on the provided JSON structure
type AuctionSession = {
  auctionSessionId: number
  auctionItems: any[]
  attachments: any[]
  deposits: any[]
  endDate: Date
  startDate: Date
  title: string
  status: string
  updateDate: Date
}

export const getColumns = (): ColumnDef<AuctionSession>[] => [
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
    accessorKey: "auctionSessionId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Session ID" />
    ),
    cell: ({ row }) => <div className="w-20">{row.getValue("auctionSessionId")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title"  className="w-"/>
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[7.25rem] truncate font-medium">
          {row.getValue("title")}
        </span>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start Date" />
    ),
    cell: ({ row }) => formatDate(new Date(row.getValue("startDate"))),
    enableSorting: false,
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="End Date" />
    ),
    cell: ({ row }) => formatDate(new Date(row.getValue("endDate"))),
    enableSorting: false,
  },
  {
    accessorKey: "deposits",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Participant" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">
        {row.getValue("deposits").length}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "auctionItems",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Number Of Lots" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">
        {row.getValue("auctionItems").length}
      </div>
    ),
    enableSorting: false,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [showUpdateItemSheet, setShowUpdateItemSheet] = React.useState(false)
      const [showDeleteItemDialog, setShowDeleteItemDialog] = React.useState(false)
      const  nav = useNavigate();
      const dispatch = useAppDispatch();

      const handleEditClick = (accountId: number) => {
        // return (<EditAcc item={item!} key={item!.itemId} hidden={false} />);
        nav(`/admin/accounts/${accountId}`);
      }

      const handleDetailClick = (auctionSessionId: number) => {
        nav(`/admin/auction-sessions/${auctionSessionId}`);
      }

      const handleAssignAuctionItemClick = (auctionSessionId: number) => {
        nav(`/admin/auction-sessions/${auctionSessionId}/assign-items`);
      }
      return (
        <>
          {/* Placeholder for UpdateItemSheet and DeleteItemDialog components */}
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Open menu"
                variant="ghost"
                className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
              >
                <DotsHorizontalIcon className="h-4 w-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onSelect={() => handleEditClick(
                row.original.auctionSessionId
              )}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setShowDeleteItemDialog(true)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-haspopup="true"
                size="icon"
                variant="ghost"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => { handleDetailClick(row.original.auctionSessionId) }}>Detail</DropdownMenuItem>
              <DropdownMenuItem onClick={() => { handleAssignAuctionItemClick(row.original.auctionSessionId) }}>Assign Items</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )
    },
  }
]

export default getColumns