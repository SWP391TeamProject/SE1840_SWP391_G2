import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from '@/config/axiosConfig.ts';
import { API_SERVER } from '@/constants/domain';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useRef, useState } from 'react';
import { useAuth } from '@/AuthProvider.tsx';
import { CurrencyType, useCurrency } from '@/CurrencyProvider.tsx';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.tsx';
import { PayPalButtons, PayPalScriptProvider, ReactPayPalScriptOptions } from '@paypal/react-paypal-js';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { createSearchParams, useNavigate } from 'react-router-dom';

const amountSuggestions: { [key in CurrencyType]: number[] } = {
  [CurrencyType.USD]: [50, 100, 500, 1000, 5000, 10_000],
  [CurrencyType.VND]: [50_000, 100_000, 500_000, 1_000_000, 5_000_000, 10_000_000],
};

export default function Balance() {
  const navigate = useNavigate();
  const auth = useAuth();
  const currency = useCurrency();
  const [isOtherAmount, setIsOtherAmount] = useState(true);
  const [currencyChoice, setCurrencyChoice] = useState(CurrencyType.VND);
  const currencyChoiceRef = useRef(currencyChoice);

  const formSchema = z.object({
    amount: z
      .string()
      .min(1, { message: 'Please enter amount' })
      .refine(
        (val) => {
          const usd = currency.convert(parseInt(val), currencyChoiceRef.current, CurrencyType.USD);
          return usd >= 1 && usd <= 100_000_000;
        },
        {
          message: 'Your deposit must be at least 1 USD and not exceed 100M USD',
        }
      ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'all',
    defaultValues: {
      amount: '',
    },
  });
  const watchAmount = form.watch('amount', '0');

  function payWithVNPay(values: z.infer<typeof formSchema>) {
    axios
      .post(
        `${API_SERVER}/payments/create`,
        {
          ...values,
          paymentId: '',
          type: 'DEPOSIT',
          status: 'PENDING',
          accountId: auth.user.accountId,
          ipAddr: '',
          orderInfoType: 'DEPOSIT',
          method: 'VNPAY',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + auth.user.accessToken,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        window.location.href = response.data;
      })
      .catch((error) => {
        console.log(error);
        toast.error(error, {
          position: 'top-right',
        });
      });
  }

  const handleOtherCheckbox = (temp: boolean) => {
    if (temp != isOtherAmount) {
      setIsOtherAmount(temp);
    }
  };

  const paypalOptions: ReactPayPalScriptOptions = {
    clientId: 'AUuzOvcO_ZxY-14aIgdYphbahknD9ndApYxIEQL-wuejdH37dQrF2gkyHEhHIEa2cj1Trz9x21y2_0j3',
    'data-sdk-integration-source': 'integrationbuilder_sc',
  };

  const paypalOrderIdRef = useRef('');

  async function payWithPaypal(values: z.infer<typeof formSchema>) {
    await axios
      .post(
        `${API_SERVER}/payments/create`,
        {
          ...values,
          paymentId: '',
          type: 'DEPOSIT',
          status: 'PENDING',
          accountId: auth.user.accountId,
          ipAddr: '',
          orderInfoType: 'DEPOSIT',
          method: 'PAYPAL',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + auth.user.accessToken,
          },
        }
      )
      .then((response) => {
        paypalOrderIdRef.current = response.data;
      })
      .catch((error) => {
        navigate({
          pathname: '/payment-status',
          search: createSearchParams({
            status: 'error',
            error: error,
          }).toString(),
        });
      });
  }

  async function callbackPaypal(orderId: string) {
    return axios
      .post(
        `${API_SERVER}/payments/capture`,
        {
          orderId: orderId,
          method: 'PAYPAL',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + auth.user.accessToken,
          },
        }
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
        toast.error(error, {
          position: 'top-right',
        });
      });
  }

  return (
    <>
      <div className="w-full lg:w-3/4 xl:w-1/2 flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-2xl">{currency.format(auth.user.balance)}</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Top Up Your Balance</CardTitle>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form className="space-y-4">
                <Tabs
                  defaultValue="VND"
                  onValueChange={async (v) => {
                    handleOtherCheckbox(true);
                    form.reset({ amount: undefined });
                    setCurrencyChoice(CurrencyType[v]);
                    currencyChoiceRef.current = CurrencyType[v];
                  }}
                >
                  <TabsList>
                    <TabsTrigger value="VND">Pay in VND</TabsTrigger>
                    <TabsTrigger value="USD">Pay in USD</TabsTrigger>
                  </TabsList>

                  <div className="flex flex-col gap-8 p-15 my-10">
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              {amountSuggestions[currencyChoice].map((v) => (
                                <FormItem key={v} className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem onClick={() => handleOtherCheckbox(false)} value={v.toString()} />
                                  </FormControl>
                                  <FormLabel className="text-base font-normal peer-checked:font-semibold peer-checked:text-primary">
                                    {currency.format(v, {
                                      baseCurrency: currencyChoice,
                                      exchangeMoney: false,
                                    })}
                                  </FormLabel>
                                </FormItem>
                              ))}
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem onClick={() => handleOtherCheckbox(true)} value="" />
                                </FormControl>
                                <FormLabel className="text-base font-medium peer-checked:font-semibold peer-checked:text-primary">
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <TabsContent value="VND">
                    <Table className="pointer-events-none">
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Total</TableCell>
                          <TableCell className="text-right">
                            <p>
                              {currency.format(watchAmount.length === 0 ? '0' : watchAmount, {
                                baseCurrency: currencyChoice,
                                exchangeMoney: false,
                              })}
                            </p>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Exchanged</TableCell>
                          <TableCell className="text-right">
                            <p>
                              {currency.format(watchAmount.length === 0 ? '0' : watchAmount, {
                                baseCurrency: currencyChoice,
                              })}
                            </p>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>

                    <Alert variant="destructive" className="my-5">
                      <ExclamationTriangleIcon className="h-4 w-4" />
                      <AlertTitle>NOTE</AlertTitle>
                      <AlertDescription>
                        If you are going to pay with VNPAY, your fund will be exchanged to USD automatically at the
                        exchange rate of 1 USD =&nbsp;
                        {currency.format(1, {
                          baseCurrency: CurrencyType.USD,
                          currency: CurrencyType.VND,
                        })}
                      </AlertDescription>
                    </Alert>

                    <Button onClick={form.handleSubmit(payWithVNPay)} className="w-full h-[40px]">
                      Pay with VNPAY
                    </Button>
                  </TabsContent>
                  <TabsContent value="USD">
                    <Table className="pointer-events-none">
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Total</TableCell>
                          <TableCell className="text-right">
                            <p>{currency.format(watchAmount.length === 0 ? 0 : watchAmount)}</p>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>

                    <PayPalScriptProvider options={paypalOptions}>
                      <PayPalButtons
                        style={{
                          layout: 'vertical',
                          color: 'blue',
                          shape: 'pill',
                          label: 'pay',
                          height: 40,
                        }}
                        createOrder={async () => {
                          await form.handleSubmit(payWithPaypal)();
                          return paypalOrderIdRef.current;
                        }}
                        onApprove={async (data, actions) => {
                          try {
                            const orderData: any = await callbackPaypal(data.orderID);
                            // Three cases to handle:
                            //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                            //   (2) Other non-recoverable errors -> Show a failure message
                            //   (3) Successful transaction -> Show confirmation or thank you message
                            const errorDetail = orderData?.details?.[0];
                            if (errorDetail?.issue === 'INSTRUMENT_DECLINED') {
                              // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                              // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
                              return actions.restart();
                            } else if (errorDetail) {
                              navigate({
                                pathname: '/payment-status',
                                search: createSearchParams({
                                  status: 'error',
                                  error: errorDetail.description,
                                }).toString(),
                              });
                            } else {
                              // (3) Successful transaction -> Show confirmation or thank you message
                              // Or go to another URL:  actions.redirect('thank_you.html');
                              console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
                              toast.success('Payment success', {
                                position: 'top-right',
                              });
                              navigate({
                                pathname: '/payment-status',
                                search: createSearchParams({
                                  amount: orderData['purchase_units'][0]['payments']['captures'][0]['amount']['value'],
                                  status: 'success',
                                  currency: 'USD',
                                }).toString(),
                              });
                            }
                          } catch (error) {
                            console.error(error);
                            navigate({
                              pathname: '/payment-status',
                              search: createSearchParams({
                                status: 'error',
                                error: error,
                              }).toString(),
                            });
                          }
                        }}
                      />
                    </PayPalScriptProvider>
                  </TabsContent>
                </Tabs>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
