import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckIcon } from "lucide-react";
import React from "react";

export default function CustomerConsigmentCard({ consignment }) {
    return (
        <>
            <Card className="w-[350px]  ">
                <CardHeader className="w-full">
                    {
                        consignment?.consignmentDetails[0]?.attachments[0]
                            ? <img src={consignment?.consignmentDetails[0]?.attachments[0]?.link} alt="Auction Item" className="rounded-t-lg object-cover" height="225" style={{ aspectRatio: "400/225", objectFit: "cover" }} />

                            : <img src="https://via.placeholder.com/400x225" alt="Auction Item" className="rounded-t-lg object-cover" height="225" style={{ aspectRatio: "400/225", objectFit: "cover" }} />
                    }
                </CardHeader>
                <CardTitle className="text-lg font-semibold">{consignment.title}</CardTitle>
                <CardContent className="space-y-2">
                    <p className="text-lg font-semibold">{consignment.title}</p>
                    <p className="text-lg font-semibold">{consignment.description}</p>
                    <p className="text-lg font-semibold">{consignment.status}</p>
                </CardContent>
            </Card>
        </>);
}
