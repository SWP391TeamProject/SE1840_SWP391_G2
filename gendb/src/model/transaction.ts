export interface Transaction {
    id: number,
    amount: number,
    type: PaymentType,
    status: PaymentStatus,
    accountId: number,
    createDate: Date,
    auctionItem: {
        itemId: number,
        auctionId: number,
    } | null
}

export enum PaymentStatus {
    PENDING = "PENDING", SUCCESS = "SUCCESS", FAILED = "FAILED"
}

export enum PaymentType {
    DEPOSIT = "DEPOSIT",
    WITHDRAW = "WITHDRAW",
    AUCTION_DEPOSIT = "AUCTION_DEPOSIT",
    AUCTION_BID = "AUCTION_BID",
    AUCTION_ORDER = "AUCTION_ORDER",
    AUCTION_DEPOSIT_REFUND = "AUCTION_DEPOSIT_REFUND"
}