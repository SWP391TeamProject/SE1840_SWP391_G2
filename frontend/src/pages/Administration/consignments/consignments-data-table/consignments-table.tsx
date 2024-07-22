import * as React from 'react';

import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@/components/data-tables/data-table';
import { DataTableToolbar } from '@/components/data-tables/data-table-toolbar';
import getColumns from './consignments-table-column';
import { getConsignments } from '@/services/ConsignmentService';
import { ConsignmentsTableFloatingBar } from './consignments-table-floating-bar';
import { ConsignmentsTableToolbarActions } from './consignments-table-toolbar-actions';
import { DataTableSkeleton } from '@/components/data-tables/data-tables-skeleton';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/handle-error';

interface ConsignmentTableProps {
  consignmentPromise: ReturnType<typeof getConsignments>;
}

export function ConsignmentsTable({ consignmentPromise }: ConsignmentTableProps) {
  const [data, setData] = React.useState([]);
  const [pageCount, setPageCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const columns = React.useMemo(() => getColumns(), []);

  React.useEffect(() => {
    const fetchData = async () => {
      if (consignmentPromise) {
        // const content = (await consignmentPromise).data.content;
        // const totalPages = (await consignmentPromise).data.totalPages;
        setIsLoading(true);
        toast.promise(consignmentPromise, {
          loading: 'Loading...',
          success: (res) => {
            setData(res.data.content), setPageCount(res.data.totalPages), setIsLoading(false);
            return 'Consignments loaded successfully';
          },
          error: (err) => {
            setIsLoading(false);
            return getErrorMessage(err);
          },  
        });

        // setData(content);
        // setPageCount(totalPages);
        // setIsLoading(false);
      }
    };
    fetchData();
  }, [consignmentPromise]);

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    defaultPerPage: 10,
  });

  return (
    <>
      <DataTable isLoading={isLoading} table={table} floatingBar={<ConsignmentsTableFloatingBar table={table} />}>
        <DataTableToolbar table={table}>
          <ConsignmentsTableToolbarActions table={table} />
        </DataTableToolbar>
        {isLoading && (
          <DataTableSkeleton
            columnCount={6}
            searchableColumnCount={0}
            filterableColumnCount={0}
            cellWidths={['10rem', '10rem', '10rem', '10rem', '10rem', '8rem']}
            shrinkZero
            showViewOptions={false}
          />
        )}
      </DataTable>
    </>
  );
}
