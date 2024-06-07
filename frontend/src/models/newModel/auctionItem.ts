import { Item } from "@/constants/interfaces";

interface AuctionItemId{
    auctionSessionId?: number;
    itemId?: number;
}

export interface AuctionItem{
    id?: AuctionItemId;
    itemDTO?: Item;
    currentPrice?: number;
}