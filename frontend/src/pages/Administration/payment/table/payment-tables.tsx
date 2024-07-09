import * as React from "react";

import { useDataTable } from "@/hooks/use-data-table";
import getColumns from "./payments-table-column";
import { DataTable } from "@/components/data-tables/data-table";
import { PaymentsTableFloatingBar } from "./payments-table-floating-bar";
import { DataTableToolbar } from "@/components/data-tables/data-table-toolbar";
import { PaymentsTableToolbarActions } from "./payments-table-toolbar-actions";
import { fetchPaymentssService } from "@/services/PaymentsService";
interface PaymentTableProps {
    paymentPromise: ReturnType<typeof fetchPaymentssService>;
}

export function PaymentsTable({ paymentPromise }: PaymentTableProps) {
    const [data, setData] = React.useState([]);
    const [pageCount, setPageCount] = React.useState(0);

    // Memoize the columns so they don't re-render on every render
    const columns = React.useMemo(() => getColumns(), []);

    React.useEffect(() => {
        const fetchData = async () => {
            if (paymentPromise) {
                const content = (await paymentPromise).data.content;
                const totalPages = (await paymentPromise)?.data.totalPages;
                setData(content);
                setPageCount(totalPages);
                console.log(content);
                console.log(totalPages);
            }
        };
        fetchData();
    }, [paymentPromise]);

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
                <PaymentsTableFloatingBar table={table} />
            }
                    >
        <DataTableToolbar table={table} >
          <PaymentsTableToolbarActions table={table} />
        </DataTableToolbar>
        </DataTable >
    );
}