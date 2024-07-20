import * as React from 'react';

import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@/components/data-tables/data-table';
import { DataTableToolbar } from '@/components/data-tables/data-table-toolbar';
import { DataTableFilterField } from '@/types';
import getColumns from './consignments-table-column';
import { fetchAccountsService } from '@/services/AccountsServices';
import { getConsignments } from '@/services/ConsignmentService';
import { ConsignmentsTableFloatingBar } from './consignments-table-floating-bar';
import { ConsignmentsTableToolbarActions } from './consignments-table-toolbar-actions';
import { DataTableSkeleton } from '@/components/data-tables/data-tables-skeleton';
import { set } from 'date-fns';
interface ConsignmentTableProps {
  consignmentPromise: ReturnType<typeof getConsignments>;
}

export function ConsignmentsTable({ consignmentPromise }: ConsignmentTableProps) {
  const [data, setData] = React.useState([]);
  const [pageCount, setPageCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo(() => getColumns(), []);

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      if (consignmentPromise) {
        const content = (await consignmentPromise).data.content;
        const totalPages = (await consignmentPromise).data.totalPages;
        setData(content);
        setPageCount(totalPages);
        console.log(content);
        console.log(totalPages);
        setIsLoading(false);
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
      {isLoading ? (
        <DataTableSkeleton
          columnCount={6}
          cellWidths={['10rem', '12rem', '12rem', '12rem', '12rem', '4rem']}
          shrinkZero
        />
      ) : (
        <DataTable table={table} floatingBar={<ConsignmentsTableFloatingBar table={table} />}>
          <DataTableToolbar table={table}>
            <ConsignmentsTableToolbarActions table={table} />
          </DataTableToolbar>
        </DataTable>
      )}
    </>
  );
}
