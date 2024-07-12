import * as React from "react";

import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-tables/data-table";
import { DataTableToolbar } from "@/components/data-tables/data-table-toolbar";
import { DataTableFilterField } from "@/types";
import getColumns from "./order-table-column";
import { OrdersTableFloatingBar } from "./order-table-floating-bar";
import { OrdersTableToolbarActions } from "./order-table-toolbar-actions";
import { getOrders } from "@/services/OrderService";
interface OrderTableProps {
    orderPromise: ReturnType<typeof getOrders>;
}

export function OrdersTable({ orderPromise }: OrderTableProps) {
    const [data, setData] = React.useState([]);
    const [pageCount, setPageCount] = React.useState(0);

    // Memoize the columns so they don't re-render on every render
    const columns = React.useMemo(() => getColumns(), []);

    React.useEffect(() => {
        const fetchData = async () => {
            if (orderPromise) {
                const content = (await orderPromise).data.content;
                const totalPages = (await orderPromise).data.totalPages;
                setData(content);
                setPageCount(totalPages);
                console.log(content);
                console.log(totalPages);
            }
        };
        fetchData();
    }, [orderPromise]);

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
                <OrdersTableFloatingBar table={table} />
            }
        >
            <DataTableToolbar table={table}>
                <OrdersTableToolbarActions table={table} />
            </DataTableToolbar>
        </DataTable >
    );
}