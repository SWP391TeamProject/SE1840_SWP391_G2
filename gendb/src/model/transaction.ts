export interface Transaction {
    id: number,
    amount: number,
    type: PaymentType,
    status: PaymentStatus,
    accountId: number,
    createDate: Date,
    orderAddress?: string,
    auctionItem: {
        itemId?: number,
        auctionId?: number,
    } | null
}

export enum PaymentStatus {
    PENDING = "PENDING", SUCCESS = "SUCCESS", FAILED = "FAILED"
}

export enum PaymentType {
    DEPOSIT = "DEPOSIT",
    WITHDRAW = "WITHDRAW",
    AUCTION_DEPOSIT = "AUCTION_DEPOSIT",
    AUCTION_ORDER = "AUCTION_ORDER",
    CONSIGNMENT_REWARD = "CONSIGNMENT_REWARD"
}