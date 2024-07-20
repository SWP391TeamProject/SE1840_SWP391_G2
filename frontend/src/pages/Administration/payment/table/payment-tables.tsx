import * as React from 'react';

import { useDataTable } from '@/hooks/use-data-table';
import getColumns from './payments-table-column';
import { DataTable } from '@/components/data-tables/data-table';
import { PaymentsTableFloatingBar } from './payments-table-floating-bar';
import { DataTableToolbar } from '@/components/data-tables/data-table-toolbar';
import { PaymentsTableToolbarActions } from './payments-table-toolbar-actions';
import { getPayments } from '@/services/PaymentsService';
import { set } from 'date-fns';
import { DataTableSkeleton } from '@/components/data-tables/data-tables-skeleton';
interface PaymentTableProps {
  paymentPromise: ReturnType<typeof getPayments>;
}

export function PaymentsTable({ paymentPromise }: PaymentTableProps) {
  const [data, setData] = React.useState([]);
  const [pageCount, setPageCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo(() => getColumns(), []);

  React.useEffect(() => {
    const fetchData = async () => {
      if (paymentPromise) {
        setIsLoading(true);
        const content = (await paymentPromise).content;
        const totalPages = (await paymentPromise).totalPages;
        setData(content);
        setPageCount(totalPages);
        console.log(content);
        console.log(totalPages);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [paymentPromise]);

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
          columnCount={7}
          cellWidths={['10rem', '10rem', '10rem', '10rem', '10rem', '8rem']}
          shrinkZero
        />
      ) : (
        <DataTable table={table} floatingBar={<PaymentsTableFloatingBar table={table} />}>
          <DataTableToolbar table={table}>
            <PaymentsTableToolbarActions table={table} />
          </DataTableToolbar>
        </DataTable>
      )}
    </>
  );
}
