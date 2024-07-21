import { Item } from './newModel/item';

export interface AuctionItemId {
  auctionSessionId?: number;
  itemId?: number;
}

export interface AuctionItem {
  id?: AuctionItemId;
  itemDTO?: Item;
  currentPrice?: number;
}
