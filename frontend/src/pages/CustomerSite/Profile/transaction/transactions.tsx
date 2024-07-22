/**
 * v0 by Vercel.
 * @see https://v0.dev/t/NbbWRyWAWx3
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import {getPayments} from '@/services/PaymentsService';
import {useSearchParams} from "react-router-dom";
import {useDebouncedCallback} from "use-debounce";
import {getEnumValue, parseDate, parseIntOrUndefined} from "@/lib/utils.ts";
import {PaymentStatus, PaymentType} from "@/constants/enums.tsx";
import {
  TransactionsTable
} from "@/pages/CustomerSite/Profile/transaction/transaction-tables.tsx";
import {useAuth} from "@/AuthProvider.tsx";

export default function Transactions() {
  const auth = useAuth();
  const [searchParams] = useSearchParams();
  const [paymentPromise, setPaymentPromise] = useState<any>();

  const fetchPayments = useDebouncedCallback(() => {
    const query = {
      type: getEnumValue(PaymentType, searchParams.get('type')) as PaymentType,
      status: getEnumValue(PaymentStatus, searchParams.get('status')) as PaymentStatus,
      from: parseDate(searchParams.get('from')),
      to: parseDate(searchParams.get('to')),
      search: searchParams.get('search'),
      page: parseIntOrUndefined(searchParams.get('page')),
      size: parseIntOrUndefined(searchParams.get('per_page')),
      sort: searchParams.get('sort') || 'paymentId,desc',
      user: auth.user.accountId
    };
    setPaymentPromise(getPayments(query));
  }, 500);

  useEffect(() => {
    fetchPayments();
  }, [searchParams]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
        <CardDescription>View your recent transactions.</CardDescription>
      </CardHeader>
      <CardContent>
        <TransactionsTable paymentPromise={paymentPromise} />
      </CardContent>
    </Card>
  );
}
