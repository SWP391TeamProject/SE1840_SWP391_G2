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

const formSchema = z.object({
    amount: z.string().min(2, {
        message: "Amount must be at least 2 characters.",
    }),
});

export default function Balance() {
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
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid w-full items-center gap-1.5">
                            <label htmlFor="amount" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Amount
                            </label>
                            <Input
                                id="amount"
                                placeholder="Enter amount"
                                type="number"
                                {...form.register("amount")}
                            />
                        </div>
                        <Button type="submit">Top Up</Button>
                    </form>
                </CardContent>
            </Card>
        </>

    );
}
