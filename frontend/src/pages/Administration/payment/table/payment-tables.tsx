import * as React from 'react';

import { useDataTable } from '@/hooks/use-data-table';
import getColumns from './payments-table-column';
import { DataTable } from '@/components/data-tables/data-table';
import { PaymentsTableFloatingBar } from './payments-table-floating-bar';
import { DataTableToolbar } from '@/components/data-tables/data-table-toolbar';
import { PaymentsTableToolbarActions } from './payments-table-toolbar-actions';
import { getPayments } from '@/services/PaymentsService';
import { DataTableSkeleton } from '@/components/data-tables/data-tables-skeleton';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/handle-error';

interface PaymentTableProps {
  paymentPromise: ReturnType<typeof getPayments>;
}

export function PaymentsTable({ paymentPromise }: PaymentTableProps) {
  const [data, setData] = React.useState([]);
  const [pageCount, setPageCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);

  const columns = React.useMemo(() => getColumns(), []);

  React.useEffect(() => {
    const fetchData = async () => {
      if (paymentPromise) {
        setIsLoading(true);
        toast.promise(paymentPromise, {
          loading: 'Loading...',
          success: (res) => {
            setData(res.content), setPageCount(res.totalPages), setIsLoading(false);
            return 'Payments loaded successfully';
          },
          error: (err) => {
            setIsLoading(false);
            return getErrorMessage(err);
          },
        });
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
      <DataTable isLoading={isLoading} table={table} floatingBar={<PaymentsTableFloatingBar table={table} />}>
        <DataTableToolbar table={table}>
          <PaymentsTableToolbarActions table={table} />
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
