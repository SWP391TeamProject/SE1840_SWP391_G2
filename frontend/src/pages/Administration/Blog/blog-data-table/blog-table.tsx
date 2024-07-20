import * as React from 'react';

import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@/components/data-tables/data-table';
import { DataTableToolbar } from '@/components/data-tables/data-table-toolbar';
import { DataTableFilterField } from '@/types';
import getColumns from './blog-table-column';
import { fetchAccountsService } from '@/services/AccountsServices';
import { BlogsTableFloatingBar } from './blog-table-floating-bar';
import { BlogsTableToolbarActions } from './blog-table-toolbar-actions';
interface BlogTableProps {
  blogPromise: ReturnType<typeof fetchAccountsService>;
}

export function BlogsTable({ blogPromise }: BlogTableProps) {
  const [data, setData] = React.useState([]);
  const [pageCount, setPageCount] = React.useState(0);

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo(() => getColumns(), []);

  React.useEffect(() => {
    const fetchData = async () => {
      if (blogPromise) {
        const content = (await blogPromise).content;
        const totalPages = (await blogPromise).totalPages;
        setData(content);
        setPageCount(totalPages);
        console.log(content);
        console.log(totalPages);
      }
    };
    fetchData();
  }, [blogPromise]);

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    defaultPerPage: 10,
  });

  return (
    <DataTable table={table} floatingBar={<BlogsTableFloatingBar table={table} />}>
      <DataTableToolbar table={table}>
        <BlogsTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
