import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fetchBidsByAccount } from '@/services/BidsService';
import { getCookie } from '@/utils/cookies';
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const Bids = () => {
    const [bids, setBids] = useState([]);
    var nav = useNavigate();
    useEffect(() => {
        console.log("abc " + bids);
        fetchBidsByAccount(parseInt(JSON.parse(getCookie("user"))?.id)).then((res) => {
            console.log(res.data);
            setBids(res.data.content);
        }).catch((err) => {
            toast.error(err);
        })
    }, [])
    const handleViewItemDetailsClick = (id: any) => {
        nav("/item/" + id);
    }
    const handleViewAuctionDetailsClick = (id: any) => {
        nav("/Auctions/" + id);
    }
    return (
        <div className='w-full dark:bg-black'>
            <div className="w-full max-w-6xl mx-auto p-4 md:p-6 text-foreground">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Bid History</h1>
                    <Button variant="outline" size="sm">
                        Export
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    {bids.length != 0 ? <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Auction</TableHead>
                                <TableHead>Item</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bids.map((bid: any) => (
                                <TableRow key={bid.bidId}>
                                    <TableCell>{bid.bidId}</TableCell>
                                    <TableCell>{bid.payment.amount}</TableCell>
                                    <TableCell>{bid.payment.date}</TableCell>
                                    {/* <TableCell>{bid.auctionItemId.auctionId}</TableCell>
                            <TableCell>{bid.auctionItemId.itemId}</TableCell> */}
                                    <TableCell>
                                        <Button variant="outline" size="sm" onClick={() => handleViewAuctionDetailsClick(bid.auctionItemId.auctionSessionId)}>
                                            Details
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="sm">
                                            {/* onClick={() => handleViewItemDetailsClick(bid.auctionItemId.itemId)}> */}
                                            Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                            }
                        </TableBody>
                    </Table>
                        :
                        <div className=' w-full h-full flex justify-center items-center'>
                            No Bids Found
                        </div>}
                </div>
            </div>
        </div>
    )
}
