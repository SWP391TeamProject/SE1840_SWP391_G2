import { Button } from '@/components/ui/button.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import { useCurrency } from '@/CurrencyProvider.tsx';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import LoadingAnimation from '@/components/loadingAnimation/LoadingAnimation';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getOrderById, updateOrder } from '@/services/OrderService';
import { setCurrentOrder } from '@/redux/reducers/Orders';
import { toast } from 'sonner';
import {CircleAlert, CircleCheck} from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { PaymentStatus } from '@/constants/enums.tsx';
import { ShippingStatus } from '@/models/newModel/order';
import { showErrorToast } from '@/lib/handle-error';

const orderUpdateSchema = z.object({
  shippingAddress: z
    .string({
      message: 'Address is required',
    })
    .min(8, 'Address must contain at least 8 characters')
    .max(300, 'Address must contain at most 300 characters'),
  shippingNote: z.string().optional(),
});

export function UserOrderDetail() {
  const nav = useNavigate();
  const orderId = parseInt(useParams().id);
  const dispatch = useAppDispatch();
  const order = useAppSelector((state) => state.orders.currentOrder);
  const currency = useCurrency();
  const [loading, setLoading] = useState(true);
  const orderUpdateForm = useForm<z.infer<typeof orderUpdateSchema>>({
    resolver: zodResolver(orderUpdateSchema),
    defaultValues: {
      shippingAddress: '',
      shippingNote: '',
    },
  });

  useEffect(() => {
    getOrderById(orderId)
      .then((res) => {
        if (res.data.payment.status === PaymentStatus.PENDING) {
          nav('/dashboard/order/checkout/' + orderId);
          return;
        }
        dispatch(setCurrentOrder(res.data));
        orderUpdateForm.setValue('shippingAddress', res.data.shippingAddress);
        orderUpdateForm.setValue('shippingNote', res.data.shippingNote);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        showErrorToast(e);
      });
  }, []);

  const submitUpdateOrder = async () => {
    const ok = await orderUpdateForm.trigger();
    if (!ok) return;
    setLoading(true);
    updateOrder(orderId, orderUpdateForm.getValues())
      .then((res) => {
        dispatch(setCurrentOrder(res.data));
        setLoading(false);
        toast.success('Delivery information updated!', {});
      })
      .catch((e) => {
        setLoading(false);
        console.error(e);
        toast.error('Error when updating order!', {});
      });
  };

  return (
    <>
      {loading ? (
        <LoadingAnimation />
      ) : (
        <div className="lg:flex flex-row justify-between gap-10 items-start p-10 lg:p-20 lg:pt-10">
          <div className="basis-7/12">
            {order.shippingStatus == ShippingStatus.PACKAGING && (
              <div className="mb-4 flex justify-between">
                <h2 className="text-2xl font-bold">Contact information</h2>
                <Button onClick={() => submitUpdateOrder()} size="sm">
                  Update
                </Button>
              </div>
            )}
            {order.shippingStatus == ShippingStatus.PACKAGING && (
              <div className="pb-6">
                <Form {...orderUpdateForm}>
                  <div className="flex flex-col gap-2">
                    <FormField
                      control={orderUpdateForm.control}
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
                      control={orderUpdateForm.control}
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
            )}
            {order.shippingStatus == ShippingStatus.PACKAGING && <Separator className="mb-4" />}
            <h2 className="text-2xl font-bold mb-4">Items</h2>
            <div className="space-y-4">
              {order?.orderDetails?.map((detail) => (
                <div key={detail.item.itemId} className="grid grid-cols-[80px_1fr_80px] items-center gap-4">
                  <img
                    src={
                      detail.item.attachments && detail.item.attachments.length > 0 ?
                        detail.item.attachments[0].link : '/placeholder.svg'
                    }
                    alt="Product Image"
                    width={80}
                    height={80}
                    className="rounded-md"
                  />
                  <div>
                    <h3 className="font-medium">
                      <a href={`/item/${detail.item.itemId}`}>{detail.item.name}</a>
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{currency.format(detail.soldPrice)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="basis-5/12 xl:basis-4/12 flex flex-col gap-5">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mt-10 lg:mt-0">
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
                {order.payment.status === PaymentStatus.SUCCESS &&
                  <Button className="bg-green-600 flex justify-center items-center gap-2" disabled>
                    <CircleCheck className="w-5 h-5" />
                    Order Paid
                  </Button>}
                {order.payment.status === PaymentStatus.FAILED &&
                  <Button className="bg-red-600 flex justify-center items-center gap-2" disabled>
                    <CircleAlert className="w-5 h-5" />
                    Order Overdue
                  </Button>}
              </div>
            </div>
            {order.payment.status === PaymentStatus.SUCCESS &&
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mt-10 lg:mt-0">
                <h2 className="text-2xl font-bold mb-4">Delivery Tracking</h2>
                <div className="flex flex-col gap-5">
                  <div className="flex justify-between gap-3">
                    <span className="basis-1/3">Delivery Partner</span>
                    <span>Biddify</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="basis-1/3">Status</span>
                    <span className="capitalize">{order.shippingStatus.toLowerCase()}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="basis-1/3">Address</span>
                    <span>{order.shippingAddress}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="basis-1/3">Note</span>
                    <span className="break-all">{order.shippingNote}</span>
                  </div>
                </div>
              </div>}
          </div>
        </div>
      )}
    </>
  );
}
