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
import { ConsignmentStatus } from "@/constants/enums"
import { formatDate } from "@/lib/utils"
import { Consignment } from "@/models/newModel/consignment"

// Define the JewelryItem type based on the provided JSON structure
// type Consignment = {
//   consignmentId: number
//   preferContact: string
//   staff: {
//     accountId: number
//     email: string
//     nickname: string
//     phone: string
//     role: string
//   }
//   createDate: string
//   status: string
//   updateDate: Date
// }

export const getColumns = (): ColumnDef<Consignment>[] => [
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
    accessorKey: "consignmentId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="w-3">{row.getValue("consignmentId")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "preferContact",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prefer Contact" />
    ),
    cell: ({ row }) => <div className="w-20">{row.getValue("preferContact")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "createDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => formatDate(new Date(row.getValue("createDate"))),
  },
  {
    accessorKey: "staff.nickname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assigned Staff" />
    ),
    cell: ({ row }) => row.original.staff?.nickname ? row.original.staff.nickname : "",
  },
  {
    accessorKey: "requester",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Requester Name" />

    ),
    cell: ({ row }) => (
      <div className="font-medium max-w-[20rem]">
        {row.original.user.nickname ? row.original.user.nickname : ""}
      </div>
    ),
    enableSorting: false,

  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
          switch (row.original.status) {
            case ConsignmentStatus.WAITING_STAFF:
              return <Badge variant="default" className="bg-yellow-500 w-[150px] text-center flex justify-center items-center">Waiting for Staff</Badge>;
            case ConsignmentStatus.FINISHED:
              return <Badge variant="default" className="bg-green-500 w-[150px] text-center flex justify-center items-center">Finished</Badge>;
            case ConsignmentStatus.IN_INITIAL_EVALUATION:
              return <Badge variant="default" className="bg-blue-500 w-[150px] text-center flex justify-center items-center">In Initial Evaluation</Badge>;
            case ConsignmentStatus.IN_FINAL_EVALUATION:
              return <Badge variant="default" className="bg-indigo-500 w-[150px] text-center flex justify-center items-center">In Final Evaluation</Badge>;
            case ConsignmentStatus.SENDING:
              return <Badge variant="default" className="bg-purple-500 w-[150px] text-center flex justify-center items-center">Sending</Badge>;
            case ConsignmentStatus.TERMINATED:
              return <Badge variant="default" className="bg-red-500 w-[150px] text-center flex justify-center items-center">Terminated</Badge>;
            case ConsignmentStatus.WAITING_SELLER:
              return <Badge variant="default" className="bg-pink-400 w-[150px] text-center flex justify-center items-center">Waiting seller</Badge>;
            case ConsignmentStatus.TO_ITEM:
              return <Badge variant="default" className="bg-cyan-400 w-[150px] text-center flex justify-center items-center">To Item</Badge>;
            default:
              return <Badge variant="destructive">Unknown Status</Badge>;
          }
        }
        
      //   {row.getValue("status") == ConsignmentStatus.ACTIVE ?
      //     <Badge variant="default" className="bg-green-500">{ConsignmentStatus[row.status]}</Badge> :
      //     <Badge variant="destructive">{ConsignmentStatus[row.status]}</Badge>}
    ,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
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
    id: "actions",
    cell: ({ row }) => {
      const [showUpdateItemSheet, setShowUpdateItemSheet] = React.useState(false)
      const [showDeleteItemDialog, setShowDeleteItemDialog] = React.useState(false)
      const nav = useNavigate();
      const dispatch = useAppDispatch();

      const handleEditClick = (accountId: number) => {
        // return (<EditAcc item={item!} key={item!.itemId} hidden={false} />);
        nav(`/admin/accounts/${accountId}`);
      }

      const handleDetailClick = (consignmentId: number) => {
        nav(`/admin/consignments/${consignmentId}`);
      }

      return (
        <>
          {/* Placeholder for UpdateItemSheet and DeleteItemDialog components */}
          <Button variant="outline" size="sm" onClick={() => { handleDetailClick(row.original.consignmentId) }}>
            Detail
          </Button>
        </>
      )
    },
  }
]

export default getColumns