import * as React from 'react';

import { useDataTable } from '@/hooks/use-data-table';
import getColumns from './items-table-column';
import { DataTable } from '@/components/data-tables/data-table';
import { getItems } from './item-apis';
import { ItemsTableFloatingBar } from './items-table-floating-bar';
import { DataTableToolbar } from '@/components/data-tables/data-table-toolbar';
import { ItemsTableToolbarActions } from './items-table-toolbar-actions';
import { DataTableSkeleton } from '@/components/data-tables/data-tables-skeleton';
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
        const content = (await itemPromise).data.content;
        const totalPages = (await itemPromise).data.totalPages;
        setData(content);
        setPageCount(totalPages);
        setIsLoading(false);
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
        {isLoading && <DataTableSkeleton
          columnCount={6}
          searchableColumnCount={0}
          filterableColumnCount={0}
          cellWidths={['10rem', '20rem', '8rem', '8rem', '8rem', '8rem', '8rem']}
          shrinkZero
          showViewOptions={false}
        />}
      </DataTable>
    </>
  );
}
