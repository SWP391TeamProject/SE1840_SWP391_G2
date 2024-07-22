import * as React from 'react';

import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@/components/data-tables/data-table';
import { DataTableToolbar } from '@/components/data-tables/data-table-toolbar';
import getColumns from './order-table-column';
import { OrdersTableFloatingBar } from './order-table-floating-bar';
import { OrdersTableToolbarActions } from './order-table-toolbar-actions';
import { getOrders } from '@/services/OrderService';
import {
  DataTableSkeleton
} from "@/components/data-tables/data-tables-skeleton.tsx";
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/handle-error';

interface OrderTableProps {
  orderPromise: ReturnType<typeof getOrders>;
}

export function OrdersTable({ orderPromise }: OrderTableProps) {
  const [data, setData] = React.useState([]);
  const [pageCount, setPageCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo(() => getColumns(), []);

  React.useEffect(() => {
    const fetchData = async () => {
      if (orderPromise) {
        setIsLoading(true);
        toast.promise(orderPromise, {
          loading: 'Loading...',
          success: (res) => {
            setData(res.data.content), setPageCount(res.data.totalPages), setIsLoading(false);
            return 'Orders loaded successfully';
          },
          error: (err) => {
            setIsLoading(false);
            return getErrorMessage (err);
          },
        });
      }
    };
    fetchData();
  }, [orderPromise]);

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    defaultPerPage: 10,
  });

  return (
    <DataTable isLoading={isLoading} table={table} floatingBar={<OrdersTableFloatingBar table={table} />}>
      <DataTableToolbar table={table}>
        <OrdersTableToolbarActions table={table} />
      </DataTableToolbar>
      {isLoading && <DataTableSkeleton
        columnCount={7}
        cellWidths={['10rem', '10rem', '10rem', '10rem', '10rem', '8rem']}
        shrinkZero
        showViewOptions={false}
      />}
    </DataTable>
  );
}
