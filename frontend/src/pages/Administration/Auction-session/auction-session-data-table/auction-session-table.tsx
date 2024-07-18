import * as React from "react";

import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-tables/data-table";
import { DataTableToolbar } from "@/components/data-tables/data-table-toolbar";
import { DataTableFilterField } from "@/types";
import getColumns from "./auction-session-table-column";
import { fetchAccountsService } from "@/services/AccountsServices";
import { AcutionSessionsTableFloatingBar } from "./auction-session-table-floating-bar";
import { AcutionSessionsTableToolbarActions } from "./auction-session-table-toolbar-actions";
import { getAuctions } from "@/services/AuctionSessionService";
import { DataTableSkeleton } from "@/components/data-tables/data-tables-skeleton";
interface AcutionSessionTableProps {
    acutionSessionPromise: ReturnType<typeof getAuctions>;
}

export default function AcutionSessionsTable({ acutionSessionPromise }: AcutionSessionTableProps) {
    const [data, setData] = React.useState([]);
    const [pageCount, setPageCount] = React.useState(0);
    const [isLoading, setIsLoading] = React.useState(false);

    // Memoize the columns so they don't re-render on every render
    const columns = React.useMemo(() => getColumns(), []);

    React.useEffect(() => {
        const fetchData = async () => {
           
            setIsLoading(true)
            acutionSessionPromise?.then((res) => {
                console.log(res)
                setData(res.data.content);
                setPageCount(res.data.totalPages);
                setIsLoading(false);
            })
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
        <>{
            isLoading ?
                <DataTableSkeleton
                    columnCount={7}
                    cellWidths={["10rem", "10rem", "10rem", "10rem", "10rem", "10rem", "8rem"]}
                    shrinkZero
                />

                :
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
        }

        </>

    );
}