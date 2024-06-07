import { AuctionItem, Payment } from "@/constants/interfaces";

export interface Bid{
    bidId?:number;
    auctionItemId?:AuctionItem;
    payment?:Payment;
}