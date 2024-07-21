import { Account } from './AccountModel';
import { AuctionItemId } from './auctionItem';

export interface BidReply {
  account: Account;
  price: number;
  bidId: number;
  auctionItemId: AuctionItemId;
  createDate: Date;
}
