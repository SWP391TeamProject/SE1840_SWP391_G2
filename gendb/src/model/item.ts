export interface Item {
    id: number,
    categoryId: number,
    name: string,
    description: string,
    reservePrice: number,
    buyInPrice: number,
    status: ItemStatus,
    imageURLs: string[],
    createDate: Date,
    updateDate: Date,
    ownerId?: number,
    orderId?: number
}

export enum ItemStatus {
    QUEUE = "QUEUE",
    IN_AUCTION = "IN_AUCTION",
    SOLD = "SOLD",
    UNSOLD = "UNSOLD"
}