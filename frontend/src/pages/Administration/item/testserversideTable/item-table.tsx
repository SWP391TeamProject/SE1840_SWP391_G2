import * as React from 'react';

import { useDataTable } from '@/hooks/use-data-table';
import getColumns, { JewelryItem } from './items-table-column';
import { DataTable } from '@/components/data-tables/data-table';
import { getItems } from './item-apis';
import { ItemsTableFloatingBar } from './items-table-floating-bar';
import { DataTableToolbar } from '@/components/data-tables/data-table-toolbar';
import { ItemsTableToolbarActions } from './items-table-toolbar-actions';
import { DataTableFilterField } from '@/types';
import { Item } from '@/models/newModel/item';
import { ItemStatus } from '@/constants/enums';
import { set } from 'date-fns';
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
  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo(() => getColumns(), []);

  const status = ['UNSOLD', 'SOLD', 'IN_AUCTION', 'QUEUE', 'VALUATING'];

  const filterFields: DataTableFilterField<JewelryItem>[] = [
    {
      label: 'Status',
      value: 'status',
      options: status.map((status) => ({
        label: status[0]?.toUpperCase() + status.slice(1),
        value: status,
        withCount: false,
      })),
    },
  ];

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      if (itemPromise) {
        const content = (await itemPromise).content;
        const totalPages = (await itemPromise).totalPages;
        setData(content);
        setPageCount(totalPages);
        console.log(content);
        console.log(totalPages);
      }
    };
    toast.promise(fetchData(), {
      loading: 'Loading...',
      success: (res) => {
        setIsLoading(false);
        return 'Items loaded successfully!';
      },
      error: (err) => {
        setIsLoading(false);
        return getErrorMessage(err);
      },
    });

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
      {isLoading ? (
        <DataTableSkeleton
          columnCount={6}
          searchableColumnCount={0}
          filterableColumnCount={0}
          cellWidths={['10rem', '20rem', '8rem', '8rem', '8rem', '8rem', '8rem']}
          shrinkZero
        />
      ) : (
        <DataTable table={table} floatingBar={<ItemsTableFloatingBar table={table} />}>
          <DataTableToolbar table={table}>
            <ItemsTableToolbarActions table={table} />
          </DataTableToolbar>
        </DataTable>
      )}
    </>
  );
}
