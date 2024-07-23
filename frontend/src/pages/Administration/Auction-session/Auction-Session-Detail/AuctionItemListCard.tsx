import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {useCurrency} from '@/CurrencyProvider.tsx';
import {AuctionSession} from "@/models/AuctionSessionModel.ts";
import {UsersIcon} from "lucide-react";
import {Link} from "react-router-dom";

export const AuctionItemListCard: React.FC<{ auction: AuctionSession }> = ({ auction }) => {
  const currency = useCurrency();

  return (
    <Card>
      <CardHeader className="px-7">
        <CardTitle>Lots</CardTitle>
        <CardDescription>All the lots appeared in this auction</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Reserve Price</TableHead>
              <TableHead>Top Bid</TableHead>
              <TableHead>Bids</TableHead>
              <TableHead>Participants</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auction.auctionItems?.map((item): any => (
              <TableRow className="bg-accent" key={item?.id.itemId}>
                <TableCell>
                  <Link to={`/admin/items/${item.itemDTO.itemId}`} target="_blank">
                    {item.itemDTO.name}
                  </Link>
                </TableCell>
                <TableCell>{currency.format(item.itemDTO.reservePrice)}</TableCell>
                <TableCell>{currency.format(item.currentPrice)}</TableCell>
                <TableCell>{item.numberOfBids}</TableCell>
                <TableCell className="flex flex-row justify-center items-center gap-3">
                  <UsersIcon className="w-5 h-5" />
                  {item.participantCount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
