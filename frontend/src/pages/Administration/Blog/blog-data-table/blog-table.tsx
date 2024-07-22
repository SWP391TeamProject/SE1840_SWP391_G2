import * as React from 'react';

import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@/components/data-tables/data-table';
import { DataTableToolbar } from '@/components/data-tables/data-table-toolbar';
import getColumns from './blog-table-column';
import { BlogsTableFloatingBar } from './blog-table-floating-bar';
import { BlogsTableToolbarActions } from './blog-table-toolbar-actions';
import { DataTableSkeleton } from '@/components/data-tables/data-tables-skeleton.tsx';
import BlogService from '@/services/BlogService.tsx';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/handle-error';

interface BlogTableProps {
  blogPromise: ReturnType<typeof BlogService.getBlogs>;
}

export function BlogsTable({ blogPromise }: BlogTableProps) {
  const [data, setData] = React.useState([]);
  const [pageCount, setPageCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const columns = React.useMemo(() => getColumns(), []);

  React.useEffect(() => {
    const fetchData = async () => {
      if (blogPromise) {
        setIsLoading(true);
        toast.promise(blogPromise, {
          loading: 'Loading...',
          success: (res) => {
            setData(res.data.content), setPageCount(res.data.totalPages), setIsLoading(false);
            return 'Blogs loaded successfully';
          },
          error: (err) => {
            setIsLoading(false);
            return getErrorMessage(err);
          },
        });
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
    <>
      <DataTable isLoading={isLoading} table={table} floatingBar={<BlogsTableFloatingBar table={table} />}>
        <DataTableToolbar table={table}>
          <BlogsTableToolbarActions table={table} />
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
