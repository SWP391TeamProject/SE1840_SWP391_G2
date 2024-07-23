import * as React from 'react';

import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@/components/data-tables/data-table';
import { DataTableToolbar } from '@/components/data-tables/data-table-toolbar';
import { AccountsTableToolbarActions } from './accounts-table-toolbar-actions';
import { AccountsTableFloatingBar } from './accounts-table-floating-bar';
import getColumns from './accounts-table-column';
import { fetchAccountsService } from '@/services/AccountsServices';
import { DataTableSkeleton } from '@/components/data-tables/data-tables-skeleton';

interface AccountTableProps {
  accountPromise: ReturnType<typeof fetchAccountsService>;
}

export function AccountsTable({ accountPromise }: AccountTableProps) {
  const [data, setData] = React.useState([]);
  const [pageCount, setPageCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const columns = React.useMemo(() => getColumns(), []);

  React.useEffect(() => {
    const fetchData = async () => {
      if (accountPromise) {
        setIsLoading(true);
        const content = (await accountPromise).data.content;
        const totalPages = (await accountPromise).data.totalPages;
        setData(content);
        setPageCount(totalPages);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [accountPromise]);

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    defaultPerPage: 10,
  });

  return (
    <>
      <DataTable isLoading={isLoading} table={table} floatingBar={<AccountsTableFloatingBar table={table} />}>
        <DataTableToolbar table={table}>
          <AccountsTableToolbarActions table={table} />
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
