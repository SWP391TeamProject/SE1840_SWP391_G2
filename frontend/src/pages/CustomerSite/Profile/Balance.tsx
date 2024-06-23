import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { getCookie } from "@/utils/cookies";
import { API_SERVER } from "@/constants/domain";
import { useQuery } from "@tanstack/react-query";
import LoadingAnimation from "@/components/loadingAnimation/LoadingAnimation";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

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
    const [isOtherAmount, setIsOtherAmount] = useState(true);
    const { data: account, isLoading } = useQuery({
        queryKey: ["balance"],
        queryFn: async () => {
            const userId = JSON.parse(getCookie("user"))?.id;
            const response = await fetch(`${API_SERVER}/accounts/${userId}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getCookie("token")}`,
                },
            });
            const data = await response.json();
            return data;
        },
    });

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

    if (isLoading) return <div className="w-full h-full"><LoadingAnimation /></div>;

    return (
        <>
            <Card className="mb-4">
                <CardHeader>
                    <CardTitle className="text-2xl">Current Balance</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription className="text-2xl">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(account?.balance || 0)}
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
                            <div className="grid w-full items-center gap-1.5">
                                <label htmlFor="amount" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Amount
                                </label>
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
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem onClick={() => handleOtherCheckbox(false)} value="5000" />
                                                        </FormControl>
                                                        <FormLabel className="text-base font-medium peer-checked:font-semibold peer-checked:text-primary">
                                                            5.000
                                                        </FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem onClick={() => handleOtherCheckbox(false)} value="10000" />
                                                        </FormControl>
                                                        <FormLabel className="text-base font-medium peer-checked:font-semibold peer-checked:text-primary">
                                                            10.000
                                                        </FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem onClick={() => handleOtherCheckbox(false)} value="100000" />
                                                        </FormControl>
                                                        <FormLabel className="text-base font-medium peer-checked:font-semibold peer-checked:text-primary">
                                                            100.000
                                                        </FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem onClick={() => handleOtherCheckbox(false)} value="500000" />
                                                        </FormControl>
                                                        <FormLabel className="text-base font-medium peer-checked:font-semibold peer-checked:text-primary">
                                                            500.000
                                                        </FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem onClick={() => handleOtherCheckbox(false)} value="1000000" />
                                                        </FormControl>
                                                        <FormLabel className="text-base font-medium peer-checked:font-semibold peer-checked:text-primary">
                                                            1.000.000
                                                        </FormLabel>
                                                    </FormItem>
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
