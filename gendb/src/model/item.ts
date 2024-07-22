export interface Item {
    id: number,
    categoryId: number,
    name: string,
    color: string,
    measurement: string,
    weight: number,
    condition: string,
    stamped: string,
    metal: string;
    gemstone: string;
    description: string,
    reservePrice: number,
    buyInPrice: number,
    status: ItemStatus,
    imageURLs: string[],
    createDate: Date,
    updateDate: Date,
    ownerId?: number,
    orderId?: number,
    consignmentId?: number
}

export enum ItemStatus {
    QUEUE = "QUEUE",
    IN_AUCTION = "IN_AUCTION",
    SOLD = "SOLD"
}