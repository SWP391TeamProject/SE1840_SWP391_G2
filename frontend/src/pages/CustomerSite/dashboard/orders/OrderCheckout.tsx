import { Button } from '@/components/ui/button.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import { useCurrency } from '@/CurrencyProvider.tsx';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import LoadingAnimation from '@/components/loadingAnimation/LoadingAnimation';
import { useNavigate, useParams } from 'react-router-dom';
import { lazy, Suspense, useEffect, useState } from 'react';
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { PaymentStatus } from '@/constants/enums.tsx';
import { showErrorToast } from '@/lib/handle-error';
import { ConfirmationDialog } from '@/components/confirmation/confirmation-dialog.tsx';
const SearchAddress = lazy(() => import('@/components/ui/search-address'));

const orderCheckoutSchema = z.object({
  shippingAddress: z
    .string({
      // message: 'Address is required',
    })
    .optional(),
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
  const [address, setAddress] = useState('');
  const orderCheckoutForm = useForm<z.infer<typeof orderCheckoutSchema>>({
    resolver: zodResolver(orderCheckoutSchema),
    defaultValues: {
      shippingAddress: '',
      shippingNote: '',
    },
  });
  const [showTrigger, setShowTrigger] = useState(false);

  useEffect(() => {
    getOrderById(orderId)
      .then((res) => {
        if (res.data.payment.status !== PaymentStatus.PENDING) {
          nav('/dashboard/order/' + orderId);
          return;
        }
        dispatch(setCurrentOrder(res.data));
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        showErrorToast(e);
      });
  }, []);
  useEffect(() => {
    if (address) {
      // orderCheckoutForm.setValue('shippingAddress', orderCheckoutForm.getFieldState('shippingAddress') + address);
    }
    console.log(orderCheckoutForm);
  }, [address]);

  const checkout = async () => {
    setShowTrigger(false);
    const ok = await orderCheckoutForm.trigger();
    if (!ok) return;
    setLoading(true);
    const formData = orderCheckoutForm.getValues();
    const submitData = {
      shippingAddress: formData.shippingAddress + address,
      shippingNote: formData.shippingNote,
    };
    payOrder(orderId, submitData)
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
                  <div className="App">
                    <SearchAddress
                      onSelectLocation={(location) => {
                        console.log(location);

                        setAddress(location.label);
                      }}
                    />
                  </div>
                  <FormField
                    control={orderCheckoutForm.control}
                    name="shippingAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additonal address information</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="provide additional detail   (e.g. apartment, suite, unit, building, floor, etc.)"
                            type="text"
                            {...field}
                            required
                          />
                        </FormControl>
                        <FormMessage />
                        <FormDescription>
                          Please provide any missing address information to ensure successful delivery.
                        </FormDescription>
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
              {order?.orderDetails?.map((detail) => (
                <div key={detail.item.itemId} className="grid grid-cols-[80px_1fr_80px] items-center gap-4">
                  <img
                    src={
                      detail.item.attachments && detail.item.attachments.length > 0
                        ? detail.item.attachments[0].link
                        : '/placeholder.svg'
                    }
                    alt="Product Image"
                    width={80}
                    height={80}
                    className="rounded-md"
                  />
                  <div>
                    <h3 className="font-medium">
                      <a href={`/jewelries/${detail.item.itemId}`}>{detail.item.name}</a>
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{currency.format(detail.soldPrice)}</div>
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
                  <span>{currency.format(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fee</span>
                  <span>{currency.format(order.fee)}</span>
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

              {
                order.payment.paymentAmount - auth.user?.balance > 0 ? (
                  <Button
                    onClick={() => {
                      nav('/profile/balance');
                    }}
                  >
                    Deposit
                  </Button>
                ) : (
                  <Button
                    onClick={() => setShowTrigger(true)}
                    disabled={order.payment.paymentAmount - auth.user?.balance > 0}
                  >
                    Buy now
                  </Button>
                )
                // <Button variant="outline" onClick={() => setShowTrigger(true)}>
                //   Pay with another method
                // </Button>
              }

              <ConfirmationDialog
                description="This action cannot be undone."
                label="Ok"
                message="Are you sure to Create this payment?"
                onSuccess={() => checkout()}
                open={showTrigger}
                onOpenChange={setShowTrigger}
                title="Confirmation"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
