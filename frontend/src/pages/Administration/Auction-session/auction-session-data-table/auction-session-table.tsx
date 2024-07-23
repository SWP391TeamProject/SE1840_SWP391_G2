import * as React from 'react';

import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@/components/data-tables/data-table';
import { DataTableToolbar } from '@/components/data-tables/data-table-toolbar';
import getColumns from './auction-session-table-column';
import { AuctionSessionsTableFloatingBar } from './auction-session-table-floating-bar';
import { AuctionSessionsTableToolbarActions } from './auction-session-table-toolbar-actions';
import { getAuctions } from '@/services/AuctionSessionService';
import { DataTableSkeleton } from '@/components/data-tables/data-tables-skeleton';

interface AuctionSessionTableProps {
  auctionSessionPromise: ReturnType<typeof getAuctions>;
}

export default function AuctionSessionsTable({ auctionSessionPromise }: AuctionSessionTableProps) {
  const [data, setData] = React.useState([]);
  const [pageCount, setPageCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const columns = React.useMemo(() => getColumns(), []);

  React.useEffect(() => {
    const fetchData = async () => {
      if (auctionSessionPromise) {
        setIsLoading(true);
        const content = (await auctionSessionPromise).data.content;
        const totalPages = (await auctionSessionPromise).data.totalPages;
        setData(content);
        setPageCount(totalPages);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [auctionSessionPromise]);

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    defaultPerPage: 10,
  });

  return (
    <>
      <DataTable isLoading={isLoading} table={table} floatingBar={<AuctionSessionsTableFloatingBar table={table} />}>
        <DataTableToolbar table={table}>
          <AuctionSessionsTableToolbarActions table={table} />
        </DataTableToolbar>
        {isLoading && (
          <DataTableSkeleton
            searchableColumnCount={0}
            filterableColumnCount={0}
            columnCount={7}
            cellWidths={['10rem', '10rem', '10rem', '10rem', '10rem', '10rem', '8rem']}
            shrinkZero
            showViewOptions={false}
          />
        )}
      </DataTable>
    </>
  );
}
