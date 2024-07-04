import { AuctionItem } from "./auctionItem";
import { Payment } from "./payment";

export interface Order {
    orderId?: number;
    createDate?: Date;
    shipAddress?: string;
    payment?:Payment;
    auctionItemDTOS: AuctionItem[];
  }