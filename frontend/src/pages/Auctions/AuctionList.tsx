import { Card } from "@/components/ui/card";
import { fetchAllAuctionSessions } from "@/services/AuctionSessionService";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function AuctionList() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ['auctions'],
    queryFn: fetchAllAuctionSessions,
  });

  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const countdown = setInterval(() => {
      if (data && data[0]) {
        const now = new Date();
        const endDate = new Date(data[0].endDate);
        const diff = endDate.getTime() - now.getTime();

        if (diff >= 0) {
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);

          setTimeLeft({
            hours: hours,
            minutes: minutes,
            seconds: seconds
          });
        }
      }
    }, 1000);

    return () => clearInterval(countdown);
  }, [data]);

  if (isPending) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  // We can assume by this point that `isSuccess === true`
  return (
    <ul className="space-y-4">
      {data.map((auction) => (
        <li key={auction.auctionSessionId}>
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">
                {auction.title || `Auction Session #${auction.auctionSessionId}`}
              </h3> 
              <Badge fontVariant="outline" className="uppercase">
                {auction.status}
              </Badge>
            </div>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Start Date:</span>{" "}
                {new Date(auction.startDate).toLocaleString()}
              </p>
              <p>
                <span className="font-medium">End Date:</span>{" "}
                {new Date(auction.endDate).toLocaleString()}
              </p>
              <p>
                <span className="font-medium">Time Left:</span>{" "}
                {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
              </p>
            </div>
          </Card>
        </li>
      ))}
    </ul>
  )
}