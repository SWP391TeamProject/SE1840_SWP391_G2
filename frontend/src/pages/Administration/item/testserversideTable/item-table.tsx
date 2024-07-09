import * as React from "react";

import { useDataTable } from "@/hooks/use-data-table";
import getColumns from "./items-table-column";
import { DataTable } from "@/components/data-tables/data-table";
import { getItems } from "./item-apis";
import { ItemsTableFloatingBar } from "./items-table-floating-bar";
import { DataTableToolbar } from "@/components/data-tables/data-table-toolbar";
import { ItemsTableToolbarActions } from "./items-table-toolbar-actions";
interface ItemTableProps {
    itemPromise: ReturnType<typeof getItems>;
}

export function ItemsTable({ itemPromise }: ItemTableProps) {
    const [data, setData] = React.useState([]);
    const [pageCount, setPageCount] = React.useState(0);

    // Memoize the columns so they don't re-render on every render
    const columns = React.useMemo(() => getColumns(), []);

    React.useEffect(() => {
        const fetchData = async () => {
            if (itemPromise) {
                const content = (await itemPromise).content;
                const totalPages = (await itemPromise).totalPages;
                setData(content);
                setPageCount(totalPages);
                console.log(content);
                console.log(totalPages);
            }
        };
        fetchData();
    }, [itemPromise]);

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
                <ItemsTableFloatingBar table={table} />
            }
                    >
        
    
        <DataTableToolbar table={table} >
          <ItemsTableToolbarActions table={table} />
        </DataTableToolbar>
        </DataTable >
    );
}