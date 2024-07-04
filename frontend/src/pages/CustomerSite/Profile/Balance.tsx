import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import axios from "axios";
import {API_SERVER} from "@/constants/domain";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {useState} from "react";
import {useAuth} from "@/AuthProvider.tsx";
import {CurrencyType, useCurrency} from "@/CurrencyProvider.tsx";
import {ExclamationTriangleIcon} from "@radix-ui/react-icons";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {
  PayPalButtons,
  PayPalScriptProvider,
  ReactPayPalScriptOptions
} from "@paypal/react-paypal-js";
import {toast} from "react-toastify";
import {Separator} from "@/components/ui/separator.tsx";

const formSchema = z.object({
  amount: z.string().min(1, {message: "Please enter amount"}),
}).superRefine((data, ctx) => {
  if (parseInt(data.amount) < 5000) {
    ctx.addIssue({
      path: ["amount"],
      message: "Amount must be at least 5000",
      code: "custom",
    });
  }
  if (parseInt(data.amount) > 100000000) {
    ctx.addIssue({
      path: ["amount"],
      message: "Maximum amount is 100,000,000",
      code: "custom",
    });
  }
});

export default function Balance() {
  const auth = useAuth();
  const currency = useCurrency();
  const [isOtherAmount, setIsOtherAmount] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
    },
  });

  function payWithVNPay(values: z.infer<typeof formSchema>) {
    axios.post(`${API_SERVER}/payments/create`, {
      ...values,
      paymentId: "",
      type: "DEPOSIT",
      status: "PENDING",
      accountId: auth.user.accountId,
      ipAddr: "",
      orderInfoType: "DEPOSIT",
      method: "VNPAY"
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + auth.user.accessToken,
      },
    }).then(response => {
      console.log(response.data);
      window.location.href = response.data;
    }).catch(error => {
      console.log(error);
      toast.error(error, {
        position: "top-right",
      });
    });
  }

  const handleOtherCheckbox = (temp: boolean) => {
    if (temp != isOtherAmount) {
      setIsOtherAmount(temp);
    }
  }

  const paypalOptions: ReactPayPalScriptOptions = {
    clientId: "AUuzOvcO_ZxY-14aIgdYphbahknD9ndApYxIEQL-wuejdH37dQrF2gkyHEhHIEa2cj1Trz9x21y2_0j3",
    "data-sdk-integration-source": "integrationbuilder_sc",
  };

  const [paypalOrderId, setPaypalOrderId] = useState<string>(null);

  async function payWithPaypal(values: z.infer<typeof formSchema>) {
    axios.post(`${API_SERVER}/payments/create`, {
      ...values,
      paymentId: "",
      type: "DEPOSIT",
      status: "PENDING",
      accountId: auth.user.accountId,
      ipAddr: "",
      orderInfoType: "DEPOSIT",
      method: "PAYPAL"
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + auth.user.accessToken,
      },
    }).then(response => {
      setPaypalOrderId(response.data);
    }).catch(error => {
      console.log(error);
      toast.error(error, {
        position: "top-right",
      });
    });
  }

  async function callbackPaypal(orderId: string) {
    return axios.post(`${API_SERVER}/payments/capture`, {
      orderId: orderId,
      method: "PAYPAL"
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + auth.user.accessToken,
      },
    }).then(response => {
      return response.data;
    }).catch(error => {
      console.log(error);
      toast.error(error, {
        position: "top-right",
      });
    });
  }

  return (
    <>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-2xl">Current Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-2xl">
            {currency.format({amount: auth.user.balance})}
          </CardDescription>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Top Up Your Balance</CardTitle>

        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form className="space-y-4">
              <div className="grid w-full items-center gap-8">
                <Alert variant="destructive">
                  <ExclamationTriangleIcon className="h-4 w-4"/>
                  <AlertTitle>NOTE</AlertTitle>
                  <AlertDescription>
                    If you are going to pay with VNPAY, your fund will be exchanged
                    to USD automatically at the exchange rate of 1 USD =&nbsp;
                    {currency.format({
                      amount: 1,
                      currency: CurrencyType.VND
                    })}
                  </AlertDescription>
                </Alert>
                <FormField
                  control={form.control}
                  name="amount"
                  render={({field}) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          {
                            [5000, 10000, 100000, 500000, 1000000, 5000000].map((v) =>
                              (<FormItem key={v}
                                         className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem
                                    onClick={() => handleOtherCheckbox(false)}
                                    value={v.toString()}/>
                                </FormControl>
                                <FormLabel
                                  className="text-base font-normal peer-checked:font-semibold peer-checked:text-primary">
                                  {currency.format({
                                    amount: v,
                                    currency: CurrencyType.VND,
                                    exchangeMoney: false
                                  })} {currency.getCurrencyType() === CurrencyType.VND ? "" : `(${currency.format({
                                  amount: v,
                                  baseCurrency: CurrencyType.VND
                                })})`}
                                </FormLabel>
                              </FormItem>)
                            )
                          }
                          <FormItem
                            className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem
                                onClick={() => handleOtherCheckbox(true)}
                                value=""
                              />
                            </FormControl>
                            <FormLabel
                              className="text-base font-medium peer-checked:font-semibold peer-checked:text-primary">
                              Other Amount
                            </FormLabel>
                          </FormItem>
                          <FormItem>
                            <FormControl>
                              <Input
                                disabled={!isOtherAmount}
                                placeholder="Enter amount"
                                type="number"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
              </div>

              <Button onClick={form.handleSubmit(payWithVNPay)} className="w-full h-[40px]">Pay with
                VNPAY</Button>

              <Separator />

              <PayPalScriptProvider options={paypalOptions}>
                <PayPalButtons
                  style={{
                    layout: "vertical",
                    color:  'blue',
                    shape:  'pill',
                    label:  'pay',
                    height: 40
                  }}
                  createOrder={async () => {
                    await form.handleSubmit(payWithPaypal)();
                    return paypalOrderId;
                  }}
                  onApprove={async (data, actions) => {
                    try {
                      const orderData: any  = callbackPaypal(data.orderID);
                      // Three cases to handle:
                      //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                      //   (2) Other non-recoverable errors -> Show a failure message
                      //   (3) Successful transaction -> Show confirmation or thank you message
                      const errorDetail = orderData?.details?.[0];
                      if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                        // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                        // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
                        return actions.restart();
                      } else if (errorDetail) {
                        toast.error(errorDetail.description, {
                          position: "top-right",
                        });
                      } else {
                        // (3) Successful transaction -> Show confirmation or thank you message
                        // Or go to another URL:  actions.redirect('thank_you.html');
                        console.log(
                          "Capture result",
                          orderData,
                          JSON.stringify(orderData, null, 2),
                        );
                        toast.success("Payment success", {
                          position: "top-right",
                        });
                      }
                    } catch (error) {
                      console.error(error);
                      toast.error(error, {
                        position: "top-right",
                      });
                    }
                  }}
                />
              </PayPalScriptProvider>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>

  );
}
