import * as React from 'react';

import { useDataTable } from '@/hooks/use-data-table';
import getColumns from './items-table-column';
import { DataTable } from '@/components/data-tables/data-table';
import { ItemsTableFloatingBar } from './items-table-floating-bar';
import { DataTableToolbar } from '@/components/data-tables/data-table-toolbar';
import { ItemsTableToolbarActions } from './items-table-toolbar-actions';
import { DataTableSkeleton } from '@/components/data-tables/data-tables-skeleton';
import { getItems } from '@/services/ItemService.ts';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/handle-error';

interface ItemTableProps {
  itemPromise: ReturnType<typeof getItems>;
}

export default function ItemsTable({ itemPromise }: ItemTableProps) {
  const [data, setData] = React.useState([]);
  const [pageCount, setPageCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const columns = React.useMemo(() => getColumns(), []);

  React.useEffect(() => {
    const fetchData = async () => {
      if (itemPromise) {
        setIsLoading(true);
        toast.promise(itemPromise, {
          loading: 'Loading...',
          success: (res) => {
            setData(res.data.content), setPageCount(res.data.totalPages), setIsLoading(false);
            return 'Items loaded successfully';
          },
          error: (err) => {
            setIsLoading(false);
            return getErrorMessage(err);
          },
        });
      }
    };
    fetchData();
  }, [itemPromise]);

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    defaultPerPage: 10,
  });

  return (
    <>
      <DataTable isLoading={isLoading} table={table} floatingBar={<ItemsTableFloatingBar table={table} />}>
        <DataTableToolbar table={table}>
          <ItemsTableToolbarActions table={table} />
        </DataTableToolbar>
        {isLoading && (
          <DataTableSkeleton
            columnCount={6}
            searchableColumnCount={0}
            filterableColumnCount={0}
            cellWidths={['10rem', '20rem', '8rem', '8rem', '8rem', '8rem', '8rem']}
            shrinkZero
            showViewOptions={false}
          />
        )}
      </DataTable>
    </>
  );
}
