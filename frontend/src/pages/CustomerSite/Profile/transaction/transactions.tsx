/**
 * v0 by Vercel.
 * @see https://v0.dev/t/NbbWRyWAWx3
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { fetchPaymentsHistory } from '@/services/PaymentsService';
import { toast } from 'sonner';
import { DataTable } from './data-tables';
import { columns } from './data-table-column';
import { getErrorMessage } from '@/lib/handle-error';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    toast.promise(fetchPaymentsHistory(), {
      loading: 'Loading...',
      success: (res) => {
        setTransactions(res?.data);
        console.log(res?.data);
        return 'Transactions loaded successfully!';
      },
      error: (err) => {
        return getErrorMessage(err);
      },
    });
  }, []);

  return (
    <Card className="w-full lg:w-3/4">
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
        <CardDescription>View your recent transactions.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <DataTable columns={columns} data={transactions} />
        </div>
      </CardContent>
    </Card>
  );
}
