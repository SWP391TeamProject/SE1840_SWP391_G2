import * as React from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { formatDate } from "@/lib/utils"
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
import { setCurrentItem } from "@/redux/reducers/Items"
import { DeleteItemsDialog } from "./delete-items-dialog"

// Define the JewelryItem type based on the provided JSON structure
export type JewelryItem = {
  itemId: number
  category: {
    itemCategoryId: number
    name: string
    createDate: string
  }
  name: string
  description: string
  reservePrice: number
  buyInPrice: number
  status: string
  createDate: string
  updateDate: string
  owner: {
    accountId: number
    nickname: string
    email: string
  }
  attachments: {
    attachmentId: number
    link: string
  }[]
}

export const getColumns = (): ColumnDef<JewelryItem>[] => [
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
    accessorKey: "itemId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="w-5">{row.getValue("itemId")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name"  className="w-"/>
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Badge variant="outline">{row.original.category.name}</Badge>
        <span className="max-w-[10rem] truncate font-medium">
          {row.getValue("name")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "reservePrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reserve Price" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">
        ${row.getValue<number>("reservePrice").toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: "buyInPrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Buy-In Price" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">
        ${row.getValue<number>("buyInPrice").toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <Badge variant={row.getValue("status") === "QUEUE" ? "outline" : "default"}>
        {row.getValue("status")}
      </Badge>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "createDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => formatDate(new Date(row.getValue("createDate"))),
  },
  {
    accessorKey: "owner.nickname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Owner" />
    ),
    cell: ({ row }) => row.original.owner.nickname,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [showUpdateItemSheet, setShowUpdateItemSheet] = React.useState(false)
      const [showDeleteItemDialog, setShowDeleteItemDialog] = React.useState(false)
      const  nav = useNavigate();
      const dispatch = useAppDispatch();

      const handleEditClick = (itemId: number) => {
        // return (<EditAcc item={item!} key={item!.itemId} hidden={false} />);
        nav(`/admin/items/${itemId}`);
      }
      return (
        <>
          {/* Placeholder for UpdateItemSheet and DeleteItemDialog components */}
          <DeleteItemsDialog
              open={showDeleteItemDialog}
              onOpenChange={setShowDeleteItemDialog}
              items={[row.original]}
              showTrigger={false}
              onSuccess={() => row.toggleSelected(false)}
            />
          <DropdownMenu>
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
                row.original.itemId
              )}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setShowDeleteItemDialog(true)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )
    },
  }
]

export default getColumns