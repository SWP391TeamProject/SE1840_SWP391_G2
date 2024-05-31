export interface Item {
  itemId: number;
  categoryId: number;
  name: string;
  description: string;
  reservePrice: number;
  buyInPrice: number;
  status: string;
  createDate: Date;
  updateDate: Date;
  ownerId: number;
  orderId: number;
}
