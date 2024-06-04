import { Card } from "@/components/ui/card";
import { AuctionSession } from "@/models/AuctionSessionModel";
import { useAppSelector } from "@/redux/hooks";
import React, { useEffect } from "react";

export default function AuctionSessionDetail() {

    const auctionSession: AuctionSession | undefined = useAppSelector((state) => state.auctionSessions.currentAuctionSession);
    console.log(auctionSession);
    useEffect(() => {
        console.log(auctionSession);
    }, [auctionSession]);
    return <div>
        <h1 className="font-medium text-5xl">
            {auctionSession?.title}
        </h1>
        <p>
            Start Date: {new Date(auctionSession?.startDate).toLocaleDateString('en-US')}
        </p>
        <p>
            End Date: {new Date(auctionSession?.endDate).toLocaleDateString('en-US')}
        </p>

        <p>
            number of items: {auctionSession?.auctionItems.length}
        </p>

        {auctionSession?.auctionItems.map((item) => {
            <Card>
                <h1>{item.title}</h1>
                <p>{item.description}</p>
            </Card>
        })}

    </div>;
}
