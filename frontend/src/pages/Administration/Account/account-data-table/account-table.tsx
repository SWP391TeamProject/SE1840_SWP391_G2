import * as React from "react";

import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-tables/data-table";
import { DataTableToolbar } from "@/components/data-tables/data-table-toolbar";
import { AccountsTableToolbarActions } from "./accounts-table-toolbar-actions";
import { DataTableFilterField } from "@/types";
import { AccountsTableFloatingBar } from "./accounts-table-floating-bar";
import getColumns from "./accounts-table-column";
import { fetchAccountsService } from "@/services/AccountsServices";
interface AccountTableProps {
    accountPromise: ReturnType<typeof fetchAccountsService>;
}

export function AccountsTable({ accountPromise }: AccountTableProps) {
    const [data, setData] = React.useState([]);
    const [pageCount, setPageCount] = React.useState(0);

    // Memoize the columns so they don't re-render on every render
    const columns = React.useMemo(() => getColumns(), []);

    React.useEffect(() => {
        const fetchData = async () => {
            if (accountPromise) {
                const content = (await accountPromise).content;
                const totalPages = (await accountPromise).totalPages;
                setData(content);
                setPageCount(totalPages);
                // console.log(content);
                // console.log(totalPages);
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
        <DataTable
            table={table}
            floatingBar={
                <AccountsTableFloatingBar table={table} />
            }
        >

            <DataTableToolbar table={table}>
                <AccountsTableToolbarActions table={table} />
            </DataTableToolbar>
        </DataTable >
    );
}