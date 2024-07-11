import * as React from "react";

import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-tables/data-table";
import { DataTableToolbar } from "@/components/data-tables/data-table-toolbar";
import { DataTableFilterField } from "@/types";
import getColumns from "./consignments-table-column";
import { fetchAccountsService } from "@/services/AccountsServices";
import { getConsignments } from "@/services/ConsignmentService";
import { ConsignmentsTableFloatingBar } from "./consignments-table-floating-bar";
import { ConsignmentsTableToolbarActions } from "./consignments-table-toolbar-actions";
interface ConsignmentTableProps {
    consignmentPromise: ReturnType<typeof getConsignments>;
}

export function ConsignmentsTable({ consignmentPromise }: ConsignmentTableProps) {
    const [data, setData] = React.useState([]);
    const [pageCount, setPageCount] = React.useState(0);

    // Memoize the columns so they don't re-render on every render
    const columns = React.useMemo(() => getColumns(), []);

    React.useEffect(() => {
        const fetchData = async () => {
            if (consignmentPromise) {
                const content = (await consignmentPromise).data.content;
                const totalPages = (await consignmentPromise).data.totalPages;
                setData(content);
                setPageCount(totalPages);
                console.log(content);
                console.log(totalPages);
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
        <DataTable
            table={table}
            floatingBar={
                <ConsignmentsTableFloatingBar table={table} />
            }
                    >
        
    
        <DataTableToolbar table={table}>
          <ConsignmentsTableToolbarActions table={table} />
        </DataTableToolbar>
        </DataTable >
    );
}