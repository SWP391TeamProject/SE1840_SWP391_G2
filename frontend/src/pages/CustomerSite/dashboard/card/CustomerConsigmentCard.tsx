import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckIcon } from "lucide-react";
import React from "react";

export default function CustomerConsigmentCard() {
    return (
        <>
            <Card className="w-[200px] h-[200px] aspect-square">
                <CardHeader>
                    <img src="https://source.unsplash.com/random/400x225" alt="Auction Item" className="rounded-t-lg object-cover" height="225" style={{ aspectRatio: "400/225", objectFit: "cover" }} />
                </CardHeader>
                <CardTitle>
                    <h2 className="text-lg font-semibold">Verify your email address</h2>
                </CardTitle>
                <CardContent className="space-y-2">
                    <div className="flex items-center justify-between">
                        <CheckIcon color="green" className="h-6 w-6" />
                    </div>
                </CardContent>
            </Card>
        </>);
}
