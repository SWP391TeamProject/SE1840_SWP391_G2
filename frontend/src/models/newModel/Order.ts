import { Payment } from "../payment";
import { AuctionItem } from "./auctionItem";

export interface Order {
    orderId?: number;
    createDate?: Date;
    shippingAddress?: string;
    payment?:Payment;
    auctionItemDTOS: AuctionItem[];
  }