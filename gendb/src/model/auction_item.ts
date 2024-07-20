export interface AuctionItem {
    id: number,
    itemId: number,
    currentPrice: number,
    bidCount: number,
    participantCount: number,
    createDate: Date,
    updateDate: Date
}