import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {AuctionSession} from "@/models/AuctionSessionModel.ts";
import {
  BadgeDollarSign,
  BoxIcon, ClockIcon,
  GavelIcon,
  Hourglass,
  UsersIcon
} from "lucide-react";
import {useCurrency} from "@/CurrencyProvider.tsx";
import AuctionStatusBadge from "@/components/AuctionStatusBadge.tsx";
import {AuctionSessionStatus} from "@/constants/enums.tsx";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {Link} from "react-router-dom";

function formatDuration(startDate: Date, endDate: Date, negative?: string): string {
  const duration = endDate.getTime() - startDate.getTime();

  if (duration <= 0) return negative || '';

  const days = Math.floor(duration / (1000 * 60 * 60 * 24));
  const hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((duration % (1000 * 60)) / 1000);

  const pad = (num: number) => num.toString().padStart(2, '0');

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  } else {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
}

export const AuctionStateCard: React.FC<{ auction: AuctionSession }> = ({ auction }) => {
  const currency = useCurrency();
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row items-center justify-start gap-3">
          {auction.title}
          <AuctionStatusBadge status={auction.status} />
          <Button className="ml-auto" size="sm" asChild>
            <Link to={`/auctions/${auction.auctionSessionId}`} target="_blank">
              View auction
            </Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-6">
          {auction.status !== AuctionSessionStatus.SCHEDULED && <div className="flex items-center gap-4">
            <div className="bg-muted rounded-md flex items-center justify-center aspect-square w-10 md:w-12">
              <UsersIcon className="w-5 h-5" />
            </div>
            <div className="grid gap-1">
              <div className="text-lg font-medium">{auction.participantCount}</div>
              <div className="text-sm text-muted-foreground">Participants</div>
            </div>
          </div>}
          <div className="flex items-center gap-4">
            <div className="bg-muted rounded-md flex items-center justify-center aspect-square w-10 md:w-12">
              <BoxIcon className="w-5 h-5" />
            </div>
            <div className="grid gap-1">
              <div className="text-lg font-medium">{auction.auctionItems.length}</div>
              <div className="text-sm text-muted-foreground">Items</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-muted rounded-md flex items-center justify-center aspect-square w-10 md:w-12">
              <Hourglass className="w-5 h-5" />
            </div>
            <div className="grid gap-1">
              <div className="text-lg font-medium">{formatDuration(new Date(auction.startDate), new Date(auction.endDate))}</div>
              <div className="text-sm text-muted-foreground">Duration</div>
            </div>
          </div>
          {auction.status !== AuctionSessionStatus.SCHEDULED && <div className="flex items-center gap-4">
            <div className="bg-muted rounded-md flex items-center justify-center aspect-square w-10 md:w-12">
              <GavelIcon className="w-5 h-5" />
            </div>
            <div className="grid gap-1">
              <div className="text-lg font-medium">{auction.auctionItems
                .reduce((total, item) => total + item.numberOfBids, 0)}</div>
              <div className="text-sm text-muted-foreground">Total Bid</div>
            </div>
          </div>}
          {auction.status !== AuctionSessionStatus.SCHEDULED && <div className="flex items-center gap-4">
            <div className="bg-muted rounded-md flex items-center justify-center aspect-square w-10 md:w-12">
              <BadgeDollarSign className="w-5 h-5" />
            </div>
            <div className="grid gap-1">
              <div className="text-lg font-medium">{currency.format(auction.auctionItems
                .reduce((total, item) => total + item.currentPrice, 0))}</div>
              <div className="text-sm text-muted-foreground">Total Worth</div>
            </div>
          </div>}
          {auction.status === AuctionSessionStatus.SCHEDULED &&
            <div className="flex items-center gap-4">
              <div className="bg-muted rounded-md flex items-center justify-center aspect-square w-10 md:w-12">
                <ClockIcon className="w-5 h-5" />
              </div>
              <div className="grid gap-1">
                <div className="text-lg font-medium">{formatDuration(currentDate, new Date(auction.startDate), 'Started')}</div>
                <div className="text-sm text-muted-foreground">Start In</div>
              </div>
            </div>}
          {auction.status === AuctionSessionStatus.PROGRESSING &&
            <div className="flex items-center gap-4">
              <div className="bg-muted rounded-md flex items-center justify-center aspect-square w-10 md:w-12">
                <ClockIcon className="w-5 h-5" />
              </div>
              <div className="grid gap-1">
                <div className="text-lg font-medium">{formatDuration(currentDate, new Date(auction.endDate), 'Ended')}</div>
                <div className="text-sm text-muted-foreground">Time Left</div>
              </div>
            </div>}
        </div>
      </CardContent>
    </Card>
  );
}
