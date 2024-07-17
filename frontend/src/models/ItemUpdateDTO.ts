import {ItemStatus} from "@/models/Item.ts";

export interface ItemUpdateDTO {
  itemId?: number;
  categoryId?: number;
  name?: string;
  description?: string;
  reservePrice?: number;
  buyInPrice?: number;
  soldPrice?: number;
  status?: ItemStatus;
  ownerId?: number;
  color?: string;
  size?: string;
  weight?: string;
  brand?: string;
  age?: number;
  material?: string;
  consignmentId?: number;
}