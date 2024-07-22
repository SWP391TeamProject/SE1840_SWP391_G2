import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { PaymentStatus, PaymentType } from '@/constants/enums';
import { PaymentsTable } from './table/payment-tables';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useSearchParams } from 'react-router-dom';
import { getEnumValue, parseDate, parseIntOrUndefined } from '@/lib/utils.ts';
import { getPayments } from '@/services/PaymentsService.ts';

export default function PaymentsList() {
  const [searchParams] = useSearchParams();
  const [paymentPromise, setPaymentPromise] = useState<any>();

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
              <PaymentsTable paymentPromise={paymentPromise} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
