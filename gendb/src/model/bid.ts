export interface Bid {
  bidId: number,
  auctionItem: {
    auctionId: number,
    itemId: number
  },
  status: BidStatus,
  amount: number,
  createdDate: Date,
  accountId: number
}

export enum BidStatus {
  PENDING = "PENDING", SUCCESS = "SUCCESS", FAILED = "FAILED"
}