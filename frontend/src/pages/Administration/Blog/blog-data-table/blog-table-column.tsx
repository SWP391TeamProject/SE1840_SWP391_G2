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

// Define the JewelryItem type based on the provided JSON structure
type Blog = {
  postId: number
  author: {
    accountId: number
    email: string
    kyc: boolean
    nickname: string
    phone: string
    role: string
    status: string
    updateDate: Date
  }
  category: {
    blogCategoryId: number
    name: string
    createDate: Date
    updateDate: Date
  }
  content: string
  createDate: Date
  title: string
  updateDate: Date
}

export const getColumns = (): ColumnDef<Blog>[] => [
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
    accessorKey: "postId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="w-3">{row.getValue("postId")}</div>,
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
        <span className="max-w-[20rem] truncate font-medium">
          {row.getValue("title")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "createDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => formatDate(new Date(row.getValue("createDate"))),
  },
  {
    accessorKey: "author.nickname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Author" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.author.nickname}
      </div>
    ),
  },
  {
    accessorKey: "category.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.category.name}
      </div>
    ),
  },
  // {
  //   accessorKey: "status",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Status" />
  //   ),
  //   cell: ({ row }) => (
  //     <Badge variant={row.getValue("status") === AccountStatus.DISABLED ? "destructive" : "default"} className={row.getValue("status") === AccountStatus.ACTIVE ? "bg-green-500" : ""}> 
  //       {row.getValue("status")}
  //     </Badge>

  //   //   {row.getValue("status") == AccountStatus.ACTIVE ?
  //   //     <Badge variant="default" className="bg-green-500">{AccountStatus[row.status]}</Badge> :
  //   //     <Badge variant="destructive">{AccountStatus[row.status]}</Badge>}
  //   ),
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id))
  //   },
  // },
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
      const  nav = useNavigate();
      const dispatch = useAppDispatch();

      const handleEditClick = (blogId: number) => {
        nav("/admin/blogs/"+blogId+"/edit");
      }

      const handleDetailClick = (blogId: number) => {
        BlogService.getBlogById(blogId).then((res) => {
          let blog = res.data;
          dispatch(setCurrentBlogPost(blog));
          nav(`/admin/blogs/${blogId}`);
        });
      }

      return (
        <>
          {/* Placeholder for UpdateItemSheet and DeleteItemDialog components */}
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
                row.original.postId
              )}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleDetailClick(row.original.postId)}>Detail</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )
    },
  }
]

export default getColumns