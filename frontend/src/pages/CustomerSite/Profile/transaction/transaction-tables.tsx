import * as React from 'react';

import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@/components/data-tables/data-table';
import { DataTableToolbar } from '@/components/data-tables/data-table-toolbar';
import { getPayments } from '@/services/PaymentsService';
import { DataTableSkeleton } from '@/components/data-tables/data-tables-skeleton';
import { TransactionsTableToolbarActions } from '@/pages/CustomerSite/Profile/transaction/transaction-table-toolbar-actions.tsx';
import getColumns from '@/pages/CustomerSite/Profile/transaction/transaction-table-column.tsx';

interface TransactionsTableProps {
  paymentPromise: ReturnType<typeof getPayments>;
}

export function TransactionsTable({ paymentPromise }: TransactionsTableProps) {
  const [data, setData] = React.useState([]);
  const [pageCount, setPageCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);

  const columns = React.useMemo(() => getColumns(), []);

  React.useEffect(() => {
    const fetchData = async () => {
      if (paymentPromise) {
        setIsLoading(true);
        const content = (await paymentPromise).content;
        const totalPages = (await paymentPromise).totalPages;
        setData(content);
        setPageCount(totalPages);
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
      <DataTable isLoading={isLoading} table={table}>
        <DataTableToolbar table={table}>
          <TransactionsTableToolbarActions table={table} />
        </DataTableToolbar>
        {isLoading && (
          <DataTableSkeleton
            columnCount={7}
            cellWidths={['10rem', '10rem', '10rem', '10rem', '10rem', '8rem']}
            shrinkZero
            showViewOptions={false}
          />
        )}
      </DataTable>
    </>
  );
}
