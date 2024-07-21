import {DownloadIcon} from '@radix-ui/react-icons';
import {type Table} from '@tanstack/react-table';

import {exportTableToCSV} from '@/lib/export';
import {Button} from '@/components/ui/button';
import {PlusIcon} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import {Payment} from '@/models/payment';

interface DataTableToolbarActionsProps {
  table: Table<Payment>;
}

export function DataTableToolbarActions({table}: DataTableToolbarActionsProps) {
  const nav = useNavigate();
  return (
    <div className="flex payments-center gap-2">
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
        <DownloadIcon className="mr-2 size-4" aria-hidden="true"/>
        Export
      </Button>
    </div>
  );
}
