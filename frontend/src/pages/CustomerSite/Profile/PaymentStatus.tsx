import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams } from "react-router-dom";
import { CheckCircleIcon, Expand } from "lucide-react";
import { Button } from "@/components/ui/button";
import {CurrencyType, useCurrency} from "@/CurrencyProvider.tsx";
import {useEffect} from "react";
import {useAuth} from "@/AuthProvider.tsx";

export default function PaymentStatus() {
    const auth = useAuth();
    const currencyUtils = useCurrency();
    const [searchParams] = useSearchParams();
    let status = searchParams.get("status");
    let error = searchParams.get("error");
    let amount = searchParams.get("amount");
    let currency = searchParams.get("currency");

    useEffect(() => {
        auth.fetchProfile();
    }, []);

    if (status === null || status.length === 0) {
        status = searchParams.get("vnp_TransactionStatus") === "00" ? "success" : "error";
    }
    if (amount === null || amount.length === 0) {
        amount = (parseInt(searchParams.get("vnp_Amount")) / 100).toString();
    }
    if (currency === null || currency.length === 0) {
        currency = "VND";
    }

    const isSuccess = status === "success";
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
                            ? "Thank you for your purchase. We have deposited " + currencyUtils.format(amount, {
                                baseCurrency: CurrencyType[currency],
                                fractionDigits: "always",
                                minFractionDigits: 2,
                                maxFractionDigits: 2,
                            }) + " into your account. Please wait up to 5 minutes for the payment to be processed."
                            : "We're sorry, there was a problem processing your payment. Please try again or contact customer support."}
                    </p>
                    {error && error.length > 0 && <p>ERROR: {error}</p>}
                    <Button className="mt-4" onClick={() => window.location.href = "/profile/balance"}>Back to Balance</Button>
                </CardContent>
            </Card>
        </div>

    );
}
