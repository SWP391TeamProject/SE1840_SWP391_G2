import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { PaymentStatus, PaymentType } from '@/constants/enums';
import { PaymentsTable } from './table/payment-tables';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useSearchParams } from 'react-router-dom';
import {
  formatDateToISO,
  getEnumValue,
  parseDate,
  parseIntOrUndefined
} from '@/lib/utils.ts';
import {
  getPayments,
  getPaymentSummary,
  PaymentSummaryDTO
} from '@/services/PaymentsService.ts';
import {useCurrency} from "@/CurrencyProvider.tsx";

export default function PaymentsList() {
  const [searchParams] = useSearchParams();
  const [paymentPromise, setPaymentPromise] = useState<any>();
  const currency = useCurrency();
  const [summary, setSummary] = useState<PaymentSummaryDTO>();

  const fetchPayments = useDebouncedCallback(() => {
    const query = {
      type: getEnumValue(PaymentType, searchParams.get('type')) as PaymentType,
      status: getEnumValue(PaymentStatus, searchParams.get('status')) as PaymentStatus,
      from: parseDate(searchParams.get('from')),
      to: parseDate(searchParams.get('to')),
      user: parseIntOrUndefined(searchParams.get('user')),
      search: searchParams.get('search'),
      page: parseIntOrUndefined(searchParams.get('page')),
      size: parseIntOrUndefined(searchParams.get('per_page')),
      sort: searchParams.get('sort') || 'paymentId,desc',
    };
    setPaymentPromise(getPayments(query));
    getPaymentSummary(parseIntOrUndefined(searchParams.get('user')),
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
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Tabs defaultValue="all">
        <TabsContent value="all">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">Payments</CardTitle>
              <CardDescription>Manage payments and view details.</CardDescription>
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
              <PaymentsTable paymentPromise={paymentPromise} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
