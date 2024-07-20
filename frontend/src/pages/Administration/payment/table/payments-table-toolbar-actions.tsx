'use client';

import { DownloadIcon } from '@radix-ui/react-icons';
import { type Table } from '@tanstack/react-table';

import { exportTableToCSV } from '@/lib/export';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Payment } from '@/models/payment';

// import { CreateTaskDialog } from "./create-task-dialog"
// import { DeletePaymentsDialog } from "./delete-tasks-dialog"

interface PaymentsTableToolbarActionsProps {
  table: Table<Payment>;
}

export function PaymentsTableToolbarActions({ table }: PaymentsTableToolbarActionsProps) {
  const nav = useNavigate();
  return (
    <div className="flex payments-center gap-2">
      {/* {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeletePaymentsDialog
          payments={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null} */}
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          exportTableToCSV(table, {
            filename: 'tasks',
            excludeColumns: ['select', 'actions'],
          })
        }
      >
        <DownloadIcon className="mr-2 size-4" aria-hidden="true" />
        Export
      </Button>
      <Button variant="outline" size="sm" onClick={() => nav('create')}>
        <PlusIcon className="mr-2 size-4" aria-hidden="true" />
        Create
      </Button>
      {/**
       * Other actions can be added here.
       * For example, import, view, etc.
       */}
    </div>
  );
}
