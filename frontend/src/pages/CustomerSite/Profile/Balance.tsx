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
import {getCookie} from "@/utils/cookies";
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

    function onSubmit(values: z.infer<typeof formSchema>) {
        axios.post(`${API_SERVER}/payments/create`, {
            ...values,
            paymentId: "",
            type: "DEPOSIT",
            status: "PENDING",
            accountId: JSON.parse(getCookie("user"))?.id,
            ipAddr: "",
            orderInfoType: "DEPOSIT",
        }, {
            headers: {
                "Content-Type": "application/json",

                Authorization: "Bearer " + JSON.parse(getCookie("user"))?.accessToken,
            },
        }).then(response => {
            console.log(response.data);
            window.location.href = response.data;
        }).catch(error => {
            console.log(error);
        });
    }

    const handleOtherCheckbox = (temp: boolean) => {
        if (temp != isOtherAmount) {
            setIsOtherAmount(temp);
        }
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
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid w-full items-center gap-8">
                                <Alert variant="destructive">
                                    <ExclamationTriangleIcon className="h-4 w-4" />
                                    <AlertTitle>NOTE</AlertTitle>
                                    <AlertDescription>
                                        Currently, we only support depositing VND through our payment provider VNPAY.
                                        Your fund will be exchanged to USD automatically.
                                    </AlertDescription>
                                </Alert>
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
                                                    {
                                                        [5000, 10000, 100000, 500000, 1000000, 5000000].map((v) =>
                                                            (<FormItem key={v}  className="flex items-center space-x-3 space-y-0">
                                                              <FormControl>
                                                                  <RadioGroupItem onClick={() => handleOtherCheckbox(false)} value={v.toString()} />
                                                              </FormControl>
                                                              <FormLabel className="text-base font-normal peer-checked:font-semibold peer-checked:text-primary">
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
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem
                                                                onClick={() => handleOtherCheckbox(true)}
                                                                value=""
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="text-base font-medium peer-checked:font-semibold peer-checked:text-primary">
                                                            Other Amount
                                                        </FormLabel>
                                                    </FormItem>
                                                    <FormItem>
                                                        <FormControl>
                                                            {/* <Input
                                                                // id="amount"
                                                                placeholder="Enter amount"
                                                                type="number"
                                                                {...form.register("amount")}
                                                            /> */}
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
                            <Button type="submit">Top Up</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </>

    );
}
