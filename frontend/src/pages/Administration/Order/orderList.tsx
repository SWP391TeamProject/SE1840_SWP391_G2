import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import {PaymentStatus, PaymentType} from '@/constants/enums';
import { getOrders } from '@/services/OrderService';
import {useEffect, useState } from 'react';
import {useSearchParams} from 'react-router-dom';
import { OrdersTable } from './order-data-table/order-table';
import {useDebouncedCallback} from "use-debounce";
import {getEnumValue, parseDate, parseIntOrUndefined} from "@/lib/utils.ts";
import {ShippingStatus} from "@/models/newModel/order.ts";

export const OrderList = () => {
  const [searchParams] = useSearchParams();
  const [orderPromise, setOrderPromise] = useState<any>();

  const fetchOrders = useDebouncedCallback(
    () => {
      const query = {
        type: PaymentType.AUCTION_ORDER,
        status: getEnumValue(PaymentStatus, searchParams.get('status')) as PaymentStatus,
        shippingStatus: getEnumValue(ShippingStatus, searchParams.get('shippingStatus')) as ShippingStatus,
        from: parseDate(searchParams.get('from')),
        to: parseDate(searchParams.get('to')),
        user: parseIntOrUndefined(searchParams.get('user')),
        search: searchParams.get('search'),
        page: parseIntOrUndefined(searchParams.get('page')),
        size: parseIntOrUndefined(searchParams.get('per_page')),
        sort: searchParams.get('sort') || 'orderId,desc',
      };
      setOrderPromise(getOrders(query));
    }, 500
  );

  useEffect(() => {
    fetchOrders();
  }, [searchParams]);

  return (
    <main className="grid flex-1 orders-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Tabs defaultValue="all">
        <TabsContent value="all">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Orders
              </CardTitle>
              <CardDescription>Manage orders and view
                details.</CardDescription>
            </CardHeader>
            <CardContent>
              <OrdersTable orderPromise={orderPromise} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
};

function ArrowUpDownIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21 16-4 4-4-4" />
      <path d="M17 20V4" />
      <path d="m3 8 4-4 4 4" />
      <path d="M7 4v16" />
    </svg>
  );
}
