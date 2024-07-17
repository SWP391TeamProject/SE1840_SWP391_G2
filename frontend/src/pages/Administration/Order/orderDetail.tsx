import {Button} from "@/components/ui/button.tsx"
import {Separator} from "@/components/ui/separator.tsx"
import {useCurrency} from "@/CurrencyProvider.tsx";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import LoadingAnimation from "@/components/loadingAnimation/LoadingAnimation"
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getOrderById, updateOrder} from "@/services/OrderService";
import {setCurrentOrder} from "@/redux/reducers/Orders";
import {toast} from "react-toastify";
import {
    AlertCircle,
    CircleAlert,
    CircleCheck,
    CircleCheckBig
} from "lucide-react";
import {PaymentStatus} from "@/constants/enums.tsx";
import {ShippingStatus} from "@/models/newModel/order";
import {fetchAccountById} from "@/services/AccountsServices.ts";
import {Account} from "@/models/AccountModel.tsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import dayjs from "dayjs";
import CountDownTime from "@/components/countdownTimer/CountDownTime.tsx";

export function OrderDetail() {
    const orderId = parseInt(useParams().id);
    const dispatch = useAppDispatch();
    const order = useAppSelector(state => state.orders.currentOrder);
    const currency = useCurrency();
    const [loading, setLoading] = useState(true);
    const [customer, setCustomer] = useState({} as Account);

    useEffect(() => {
        getOrderById(orderId).then((res) => {
            dispatch(setCurrentOrder(res.data));
            fetchAccountById(res.data.payment.accountId).then((res) => {
                setCustomer(res.data as Account);
            }).catch((e) => {
                console.error(e);
                toast.error('Error when loading customer detail!', {
                    position: "bottom-right",
                });
            }).finally(() => {
                setLoading(false);
            });
        }).catch((e) => {
            console.error(e);
            toast.error('Error when loading order detail!', {
                position: "bottom-right",
            });
        });
    }, []);

    const updateShippingStatus = async (shippingStatus: ShippingStatus) => {
        setLoading(true);
        updateOrder(orderId, {shippingStatus}).then((res) => {
            dispatch(setCurrentOrder(res.data));
            setLoading(false);
            toast.success('Delivery status updated!', {
                position: "bottom-right",
            });
        }).catch((e) => {
            setLoading(false);
            console.error(e);
            toast.error('Error when updating order!', {
                position: "bottom-right",
            });
        });
    };


    const guides = {
        FAILED: "The customer has failed to pay this order on time. It has been cancelled.",
        PENDING: "Please wait for the customer to pay this order.",
        PACKAGING: "Please package the order and send to the delivery team as soon as possible.",
        DELIVERING: "The delivery is in progress. Please stay in touch with the customer about the delivery status.",
        DELIVERED: "The customer has received the order. There is no action to do with this order.",
    };

    return (
      <>
          {loading ?
            <LoadingAnimation/>
            :
            <div
              className="lg:flex flex-row justify-between gap-10 items-start p-10 lg:p-20 lg:pt-10">
                <div className="basis-7/12">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-10">
                        <h2 className="text-2xl font-bold mb-4">Your action</h2>
                        <p>{guides[order.payment.status == "SUCCESS" ? order.shippingStatus : order.payment.status]}</p>
                        {order.shippingStatus === ShippingStatus.PACKAGING &&
                          <Button className="mt-5 bg-green-400 justify-center gap-2" variant="outline" size="sm"
                                  onClick={() => updateShippingStatus(ShippingStatus.DELIVERING)}>
                              <CircleCheckBig className="w-5 h-5"/>
                              I have packaged and sent for delivery
                          </Button>}
                        {order.shippingStatus === ShippingStatus.DELIVERING &&
                          <Button className="mt-5 bg-green-400 justify-center gap-2" variant="outline" size="sm"
                                  onClick={() => updateShippingStatus(ShippingStatus.DELIVERED)}>
                              <CircleCheckBig className="w-5 h-5"/>
                              The customer reported the order as delivered
                          </Button>}
                    </div>
                    {order.payment.status !== PaymentStatus.FAILED &&
                      <>
                          <h2 className="text-2xl font-bold my-4">Items</h2>
                          <div className="space-y-4">
                              {order?.itemDTOS?.map((item) => (
                                <div key={item.itemId}
                                     className="grid grid-cols-[80px_1fr_80px] items-center gap-4">
                                    <img
                                      src={item.attachments && item.attachments.length > 0 ? item.attachments[0].link : "/placeholder.svg"}
                                      alt="Product Image" width={80} height={80}
                                      className="rounded-md"/>
                                    <div>
                                        <h3 className="font-medium">
                                            <a href={`/item/${item.itemId}`}>{item.name}</a>
                                        </h3>
                                    </div>
                                    <div className="text-right">
                                        <div
                                          className="font-medium">{currency.format({amount: item.soldPrice})}</div>
                                    </div>
                                </div>
                              ))}
                          </div>
                      </>}
                </div>
                <div className="basis-5/12 xl:basis-4/12 flex flex-col gap-5">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mt-10 lg:mt-0">
                        <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                        <div className="flex flex-col gap-5">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>{currency.format({amount: order.payment.paymentAmount})}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Fee</span>
                                    <span>{currency.format({amount: 0})}</span>
                                </div>
                                <Separator/>
                                <div className="flex justify-between font-bold">
                                    <span>Total</span>
                                    <span>{currency.format({amount: order.payment.paymentAmount})}</span>
                                </div>
                                { order.payment.status === PaymentStatus.PENDING &&
                                  <div className="flex justify-between font-bold">
                                      <span>Deadline</span>
                                      <CountDownTime end={dayjs(order.createDate).add(7, 'days').toDate()}
                                                     messageOnEnd="0"/>
                                  </div>
                                }
                                { order.payment.status === PaymentStatus.FAILED &&
                                  <div className="flex justify-between font-bold">
                                      <span>Deadline</span>
                                      <span>Overdue</span>
                                  </div>
                                }
                            </div>
                            { order.payment.status === PaymentStatus.SUCCESS &&
                              <Button className="bg-green-600 flex justify-center items-center gap-2" disabled>
                                  <CircleCheck className="w-5 h-5"/>
                                  Order Paid
                              </Button>
                            }
                            { order.payment.status !== PaymentStatus.SUCCESS &&
                              <Button className="bg-red-600 flex justify-center items-center gap-2" disabled>
                                  <CircleAlert className="w-5 h-5"/>
                                  Order Not Paid
                              </Button>
                            }
                        </div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mt-10 lg:mt-0">
                        <h2 className="text-2xl font-bold mb-4">Customer</h2>
                        <div className="flex flex-col gap-5">
                            <div className="flex justify-between gap-3">
                                <span className="basis-1/3">Account ID</span>
                                <span>{customer.accountId}</span>
                            </div>
                            <div className="flex justify-between gap-3">
                                <span className="basis-1/3">Name</span>
                                <span>{customer.nickname}</span>
                            </div>
                            <div className="flex justify-between gap-3">
                                <span className="basis-1/3">Email</span>
                                <span>{customer.email}</span>
                            </div>
                            <div className="flex justify-between gap-3">
                                <span className="basis-1/3">Phone</span>
                                <span>{customer.phone}</span>
                            </div>
                            {customer.dummy &&
                              <Alert variant="destructive">
                                  <AlertCircle className="h-5 w-5"/>
                                  <AlertTitle>
                                      <h3 className="text-lg">Dummy account</h3>
                                  </AlertTitle>
                                  <AlertDescription>
                                      This is a dummy account for testing purposes. It is not a real person!
                                  </AlertDescription>
                              </Alert>}
                            {!customer.kyc &&
                              <Alert variant="destructive">
                                  <AlertCircle className="h-5 w-5"/>
                                  <AlertTitle>
                                      <h3 className="text-lg">KYC Unverified</h3>
                                  </AlertTitle>
                                  <AlertDescription>
                                      This account has not been KYC-verified.
                                  </AlertDescription>
                              </Alert>}
                        </div>
                    </div>
                    { order.payment.status === PaymentStatus.SUCCESS &&
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
          }
      </>
    )
}
