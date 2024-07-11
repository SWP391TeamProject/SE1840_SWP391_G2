import * as React from "react";

import { useDataTable } from "@/hooks/use-data-table";
import getColumns, { JewelryItem } from "./items-table-column";
import { DataTable } from "@/components/data-tables/data-table";
import { getItems } from "./item-apis";
import { ItemsTableFloatingBar } from "./items-table-floating-bar";
import { DataTableToolbar } from "@/components/data-tables/data-table-toolbar";
import { ItemsTableToolbarActions } from "./items-table-toolbar-actions";
import { DataTableFilterField } from "@/types";
import { Item } from "@/models/newModel/item";
import { ItemStatus } from "@/constants/enums";
interface ItemTableProps {
    itemPromise: ReturnType<typeof getItems>;
}

export function ItemsTable({ itemPromise }: ItemTableProps) {
    const [data, setData] = React.useState([]);
    const [pageCount, setPageCount] = React.useState(0);

    // Memoize the columns so they don't re-render on every render
    const columns = React.useMemo(() => getColumns(), []);

    const status = ["UNSOLD",
        "SOLD",
        "IN_AUCTION",
       "QUEUE",
        "VALUATING"]
    
    const filterFields: DataTableFilterField<JewelryItem>[] = [
        {
          label: "Status",
          value: "status",
          options: status.map((status) => ({
            label: status[0]?.toUpperCase() + status.slice(1),
            value: status,
            withCount: false,
          })),
        },
      ]

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
        
    
        <DataTableToolbar table={table}>
          <ItemsTableToolbarActions table={table} />
        </DataTableToolbar>
        </DataTable >
    );
}