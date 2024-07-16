export interface Item {
  itemId?: number;
  categoryId?: number;
  name: string;
  description: string;
  reservePrice: number;
  buyInPrice: number;
  status: ItemStatus;
  createDate?: Date;
  updateDate?: Date;
  ownerId?: number;
  orderId?: number;
  attachments: {
    link: string
  }[];
}

export enum ItemStatus {
  VALUATING = "VALUATING",
  QUEUE = "QUEUE",
  IN_AUCTION = "IN_AUCTION",
  SOLD = "SOLD",
  UNSOLD = "UNSOLD"
}