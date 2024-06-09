import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams } from "react-router-dom";
import { CheckCircleIcon, Expand } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentStatus() {
    const [searchParams] = useSearchParams();
    const status = searchParams.get("vnp_TransactionStatus");
    const amount = searchParams.get("vnp_Amount");

    const isSuccess = status === "00";
    const title = isSuccess ? "Payment Successful!" : "Payment Failed";
    const icon = isSuccess ? (
        <CheckCircleIcon className="h-10 w-10 text-green-500" />
    ) : (
        <Expand className="h-10 w-10 text-red-500" />
    );

    return (
        <div className="w-full min-h-screen flex justify-center items-center">
            <Card className="w-[360px]">
                <CardHeader className="flex flex-row items-center justify-center space-x-4">
                    {icon}
                    <CardTitle className="text-2xl">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>
                        {isSuccess
                            ? "Thank you for your purchase. We have deposited " + amount + " VND into your account."
                            : "We're sorry, there was a problem processing your payment. Please try again or contact customer support."}
                    </p>
                    <Button className="mt-4" onClick={() => window.location.href = "/profile/balance"}>Back to Balance</Button>
                    
                </CardContent>
            </Card>
        </div>

    );
}
