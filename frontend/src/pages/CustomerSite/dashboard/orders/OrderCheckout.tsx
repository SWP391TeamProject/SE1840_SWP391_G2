import { Button } from '@/components/ui/button.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import { useCurrency } from '@/CurrencyProvider.tsx';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import LoadingAnimation from '@/components/loadingAnimation/LoadingAnimation';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getOrderById, payOrder } from '@/services/OrderService';
import { setCurrentOrder } from '@/redux/reducers/Orders';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/AuthProvider.tsx';
import { AlertCircle, Wallet } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { PaymentStatus } from '@/constants/enums.tsx';
import { showErrorToast } from '@/lib/handle-error';

const orderCheckoutSchema = z.object({
  shippingAddress: z
    .string({
      message: 'Address is required',
    })
    .min(8, 'Address must contain at least 8 characters')
    .max(300, 'Address must contain at most 300 characters'),
  shippingNote: z.string().optional(),
});

export function OrderCheckout() {
  const nav = useNavigate();
  const auth = useAuth();
  const orderId = parseInt(useParams().id);
  const dispatch = useAppDispatch();
  const order = useAppSelector((state) => state.orders.currentOrder);
  const currency = useCurrency();
  const [loading, setLoading] = useState(true);
  const orderCheckoutForm = useForm<z.infer<typeof orderCheckoutSchema>>({
    resolver: zodResolver(orderCheckoutSchema),
    defaultValues: {
      shippingAddress: '',
      shippingNote: '',
    },
  });
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    getOrderById(orderId)
      .then((res) => {
        if (res.data.payment.status === PaymentStatus.SUCCESS) {
          nav('/dashboard/order/' + orderId);
          return;
        }
        if (res.data.payment.status !== PaymentStatus.PENDING) {
          toast.error('Invalid order!', {});
          return;
        }
        dispatch(setCurrentOrder(res.data));
        setSubtotal(res.data.orderDetails.reduce((total, item) => total + item.soldPrice, 0));
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        showErrorToast(e);
      });
  }, []);

  const checkout = async () => {
    const ok = await orderCheckoutForm.trigger();
    if (!ok) return;
    setLoading(true);
    payOrder(orderId, orderCheckoutForm.getValues())
      .then((res) => {
        dispatch(setCurrentOrder(res.data));
        nav('/dashboard/order/' + orderId);
      })
      .catch((e) => {
        setLoading(false);
        console.error(e);
        showErrorToast(e);
      });
  };

  return (
    <>
      {loading ? (
        <LoadingAnimation />
      ) : (
        <div className="lg:flex flex-row justify-between gap-10 items-start p-10 lg:p-20 lg:pt-10">
          <div className="basis-7/12">
            <h2 className="text-2xl font-bold mb-4">Contact information</h2>
            <div className="pb-6">
              <Form {...orderCheckoutForm}>
                <div className="flex flex-col gap-2">
                  <FormField
                    control={orderCheckoutForm.control}
                    name="shippingAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input type="text" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={orderCheckoutForm.control}
                    name="shippingNote"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Note</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Anything to note about the delivery"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Form>
            </div>
            <Separator />
            <h2 className="text-2xl font-bold my-4">Items</h2>
            <div className="space-y-4">
              {order?.itemDTOS?.map((item) => (
                <div key={item.itemId} className="grid grid-cols-[80px_1fr_80px] items-center gap-4">
                  <img
                    src={
                      item.attachments && item.attachments.length > 0 ? item.attachments[0].link : '/placeholder.svg'
                    }
                    alt="Product Image"
                    width={80}
                    height={80}
                    className="rounded-md"
                  />
                  <div>
                    <h3 className="font-medium">
                      <a href={`/item/${item.itemId}`}>{item.name}</a>
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{currency.format(item.soldPrice)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="basis-5/12 xl:basis-4/12 bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mt-10 lg:mt-0">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            <div className="flex flex-col gap-5">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{currency.format(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fee</span>
                  <span>{currency.format(order.payment.paymentAmount - subtotal)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{currency.format(order.payment.paymentAmount)}</span>
                </div>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>
                    <Wallet className="h-5 w-5 inline-block" /> Pay with Biddify wallet
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between">
                    <span>Your balance</span>
                    <span>{currency.format(auth.user?.balance)}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <i className="text-sm">Please note that the order is non-refundable.</i>
                </CardFooter>
              </Card>
              {order.payment.paymentAmount - auth.user?.balance > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-5 w-5" />
                  <AlertTitle>
                    <h3 className="text-lg">Insufficient balance</h3>
                  </AlertTitle>
                  <AlertDescription>
                    You need to deposit another&nbsp;
                    {currency.format(order.payment.paymentAmount - auth.user?.balance)}&nbsp; to cover this order.
                  </AlertDescription>
                </Alert>
              )}
              <Button onClick={() => checkout()} disabled={order.payment.paymentAmount - auth.user?.balance > 0}>
                Buy now
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
