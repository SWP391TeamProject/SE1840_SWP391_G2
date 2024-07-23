import * as React from 'react';

import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@/components/data-tables/data-table';
import { DataTableToolbar } from '@/components/data-tables/data-table-toolbar';
import { fetchAccountsService } from '@/services/AccountsServices';
import { DataTableSkeleton } from '@/components/data-tables/data-tables-skeleton';
import { CustomersTableToolbarActions } from '@/pages/Administration/Customer/customer-data-table/customer-table-toolbar-actions.tsx';
import getColumns from '@/pages/Administration/Customer/customer-data-table/customer-table-column.tsx';

interface CustomersTableProps {
  customerPromise: ReturnType<typeof fetchAccountsService>;
}

export function CustomersTable({ customerPromise }: CustomersTableProps) {
  const [data, setData] = React.useState([]);
  const [pageCount, setPageCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const columns = React.useMemo(() => getColumns(), []);

  React.useEffect(() => {
    const fetchData = async () => {
      if (customerPromise) {
        setIsLoading(true);
        const content = (await customerPromise).data.content;
        const totalPages = (await customerPromise).data.totalPages;
        setData(content);
        setPageCount(totalPages);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [customerPromise]);

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
          <CustomersTableToolbarActions table={table} />
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
