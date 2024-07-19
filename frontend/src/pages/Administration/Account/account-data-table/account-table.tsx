import * as React from 'react';

import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@/components/data-tables/data-table';
import { DataTableToolbar } from '@/components/data-tables/data-table-toolbar';
import { AccountsTableToolbarActions } from './accounts-table-toolbar-actions';
import { DataTableFilterField } from '@/types';
import { AccountsTableFloatingBar } from './accounts-table-floating-bar';
import getColumns from './accounts-table-column';
import { fetchAccountsService } from '@/services/AccountsServices';
import { DataTableSkeleton } from '@/components/data-tables/data-tables-skeleton';
import { set } from 'date-fns';
interface AccountTableProps {
  accountPromise: ReturnType<typeof fetchAccountsService>;
}

export function AccountsTable({ accountPromise }: AccountTableProps) {
  const [data, setData] = React.useState([]);
  const [pageCount, setPageCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo(() => getColumns(), []);

  React.useEffect(() => {
    const fetchData = async () => {
      if (accountPromise) {
        setIsLoading(true);
        const content = (await accountPromise).content;
        const totalPages = (await accountPromise).totalPages;
        setData(content);
        setPageCount(totalPages);
        // console.log(content);
        // console.log(totalPages);
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
      {isLoading ? (
        <DataTableSkeleton
          columnCount={6}
          cellWidths={['10rem', '10rem', '10rem', '10rem', '10rem', '8rem']}
          shrinkZero
        />
      ) : (
        <DataTable table={table} floatingBar={<AccountsTableFloatingBar table={table} />}>
          <DataTableToolbar table={table}>
            <AccountsTableToolbarActions table={table} />
          </DataTableToolbar>
        </DataTable>
      )}
    </>
  );
}
