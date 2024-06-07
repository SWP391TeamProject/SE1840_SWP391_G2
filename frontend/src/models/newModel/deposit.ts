import { AuctionItem, Payment } from "@/constants/interfaces";

export interface Deposit{
    depositId?:number;
    auctionItemId?:AuctionItem;
    payment?:Payment;
}