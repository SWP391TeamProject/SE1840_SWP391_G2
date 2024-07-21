import * as React from 'react';

import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@/components/data-tables/data-table';
import { DataTableToolbar } from '@/components/data-tables/data-table-toolbar';
import getColumns from './blog-table-column';
import { BlogsTableFloatingBar } from './blog-table-floating-bar';
import { BlogsTableToolbarActions } from './blog-table-toolbar-actions';
import {
  DataTableSkeleton
} from "@/components/data-tables/data-tables-skeleton.tsx";
import BlogService from "@/services/BlogService.tsx";

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
        const content = (await blogPromise).data.content;
        const totalPages = (await blogPromise).data.totalPages;
        setData(content);
        setPageCount(totalPages);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [blogPromise]);


  const {table} = useDataTable({
    data,
    columns,
    pageCount,
    defaultPerPage: 10,
  });

  return (
    <>
      <DataTable isLoading={isLoading} table={table}
                 floatingBar={<BlogsTableFloatingBar table={table}/>}>
        <DataTableToolbar table={table}>
          <BlogsTableToolbarActions table={table}/>
        </DataTableToolbar>
        {isLoading && <DataTableSkeleton
          columnCount={6}
          searchableColumnCount={0}
          filterableColumnCount={0}
          cellWidths={['10rem', '10rem', '10rem', '10rem', '10rem', '8rem']}
          shrinkZero
          showViewOptions={false}
        />}
      </DataTable>
    </>
  );
}
