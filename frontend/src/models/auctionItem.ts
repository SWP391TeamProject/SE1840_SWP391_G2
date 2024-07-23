import {Item} from "@/models/Item.ts";

export interface AuctionItemId {
  auctionSessionId?: number;
  itemId?: number;
}

export interface AuctionItem {
  id?: AuctionItemId;
  itemDTO?: Item;
  currentPrice: number,
  numberOfBids: number,
  participantCount: number,
  sold: boolean;
}
