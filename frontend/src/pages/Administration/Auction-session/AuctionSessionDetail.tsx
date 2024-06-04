import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuctionSession } from "@/models/AuctionSessionModel";
import { useAppSelector } from "@/redux/hooks";
import { Separator } from "@radix-ui/react-dropdown-menu";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export default function AuctionSessionDetail() {

    const auctionSession: AuctionSession | undefined = useAppSelector((state) => state.auctionSessions.currentAuctionSession);
    console.log(auctionSession);
    useEffect(() => {
        console.log(auctionSession);
    }, [auctionSession]);
    return <div>
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-bold">{auctionSession?.title}</CardTitle>
                <CardDescription>
                    Start Date: {new Date(auctionSession?.startDate).toLocaleDateString('en-US')} <br />
                    End Date: {new Date(auctionSession?.endDate).toLocaleDateString('en-US')}
                </CardDescription>
                <Button>
                    <Link to={`/admin/auction-sessions/${auctionSession?.auctionSessionId}/add-auction-items`}>Add Items</Link>
                </Button>
            </CardHeader>

            <Separator />

            <CardContent>
                <p className="text-sm text-muted-foreground">
                    Number of items: {auctionSession?.auctionItems.length}
                </p>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {auctionSession?.auctionItems.map((item) => (
                        <Card key={item.id} className="shadow-md">
                            <CardHeader>
                                <CardTitle>{item.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>{item.description}</CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>

    </div>;
}
