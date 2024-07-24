/**
 * v0 by Vercel.
 * @see https://v0.dev/t/NbbWRyWAWx3
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import {
  getPayments,
  getPaymentSummary,
  PaymentSummaryDTO
} from '@/services/PaymentsService';
import { useSearchParams } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';
import {
  formatDateToISO,
  getEnumValue,
  parseDate,
  parseIntOrUndefined
} from '@/lib/utils.ts';
import { PaymentStatus, PaymentType } from '@/constants/enums.tsx';
import { TransactionsTable } from '@/pages/CustomerSite/Profile/transaction/transaction-tables.tsx';
import { useAuth } from '@/AuthProvider.tsx';
import {useCurrency} from "@/CurrencyProvider.tsx";

export default function Transactions() {
  const auth = useAuth();
  const currency = useCurrency();
  const [searchParams] = useSearchParams();
  const [paymentPromise, setPaymentPromise] = useState<any>();
  const [summary, setSummary] = useState<PaymentSummaryDTO>();

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
      user: auth.user.accountId,
    };
    setPaymentPromise(getPayments(query));
    getPaymentSummary(auth.user.accountId,
      formatDateToISO(parseDate(query.from)),
      formatDateToISO(parseDate(query.to)))
      .then((dto) => {
      setSummary(dto);
    })
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
        {summary &&
          <div className="flex flex-row items-start justify-between mb-5">
            <div className="flex flex-col justify-start">
              <span className="font-semibold">Inbound Fund:</span>
              <span>{currency.format(summary.inboundFund)}</span>
            </div>
            <div className="flex flex-col justify-start">
              <span className="font-semibold">Outgoing Fund:</span>
              <span>{currency.format(summary.outgoingFund)}</span>
            </div>
            <div className="flex flex-col justify-start">
              <span className="font-semibold">Frozen Money:</span>
              <span>{currency.format(summary.frozenMoney)}</span>
            </div>
            <div className="flex flex-col justify-start">
              <span className="font-semibold">Wallet Deposit:</span>
              <span>{currency.format(summary.walletDeposit)}</span>
            </div>
            <div className="flex flex-col justify-start">
              <span className="font-semibold">Wallet Withdrawal:</span>
              <span>{currency.format(summary.walletWithdrawal)}</span>
            </div>
          </div>}
        <TransactionsTable paymentPromise={paymentPromise} />
      </CardContent>
    </Card>
  );
}
