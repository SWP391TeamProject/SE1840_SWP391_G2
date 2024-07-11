"use client"

import { type Task } from "@/db/schema"
import { DownloadIcon } from "@radix-ui/react-icons"
import { type Table } from "@tanstack/react-table"

import { exportTableToCSV } from "@/lib/export"
import { Button } from "@/components/ui/button"
import { DeleteAccountsDialog } from "./delete-accounts-dialog"
import { PlusIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"

// import { CreateTaskDialog } from "./create-task-dialog"
// import { DeleteTasksDialog } from "./delete-tasks-dialog"

interface TasksTableToolbarActionsProps {
  table: Table<Task>
}

export function AcutionSessionsTableToolbarActions({
  table,
}: TasksTableToolbarActionsProps) {
    const nav = useNavigate()
  return (
    <div className="flex items-center gap-2">
     
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteAccountsDialog
          items={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          exportTableToCSV(table, {
            filename: "tasks",
            excludeColumns: ["select", "actions"],
          })
        }
      >
        <DownloadIcon className="mr-2 size-4" aria-hidden="true" />
        Export
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
         nav('create')
        }
      >
        <PlusIcon className="mr-2 size-4" aria-hidden="true" />
        Create
      </Button>
      {/**
       * Other actions can be added here.
       * For example, import, view, etc.
       */}
    </div>
  )
}
