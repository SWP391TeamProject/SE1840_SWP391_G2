import * as React from "react";

import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-tables/data-table";
import { DataTableToolbar } from "@/components/data-tables/data-table-toolbar";
import { DataTableFilterField } from "@/types";
import getColumns from "./auction-session-table-column";
import { fetchAccountsService } from "@/services/AccountsServices";
import { AcutionSessionsTableFloatingBar } from "./auction-session-table-floating-bar";
import { AcutionSessionsTableToolbarActions } from "./auction-session-table-toolbar-actions";
import { fetchAllAuctionSessions, getAllAuction } from "@/services/AuctionSessionService";
interface AcutionSessionTableProps {
    acutionSessionPromise: ReturnType<typeof getAllAuction>;
}

export function AcutionSessionsTable({ acutionSessionPromise }: AcutionSessionTableProps) {
    const [data, setData] = React.useState([]);
    const [pageCount, setPageCount] = React.useState(0);

    // Memoize the columns so they don't re-render on every render
    const columns = React.useMemo(() => getColumns(), []);

    React.useEffect(() => {
        const fetchData = async () => {
            if (acutionSessionPromise) {
                const content = (await acutionSessionPromise).data.content;
                const totalPages = (await acutionSessionPromise).data.totalPages;
                setData(content);
                setPageCount(totalPages);
                console.log(content);
                console.log(totalPages);
            }
        };
        fetchData();
    }, [acutionSessionPromise]);

    const { table } = useDataTable({
        data,
        columns,
        pageCount,
        defaultPerPage: 10,
    });

    return (
        <DataTable
            table={table}
            floatingBar={
                <AcutionSessionsTableFloatingBar table={table} />
            }
                    >
        
    
        <DataTableToolbar table={table}>
          <AcutionSessionsTableToolbarActions table={table} />
        </DataTableToolbar>
        </DataTable >
    );
}