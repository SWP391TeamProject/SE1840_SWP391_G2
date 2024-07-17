import {ItemCategory} from "@/models/ItemCategory.ts";
import {Account} from "@/models/AccountModel.tsx";
import {Attachment} from "@/models/Attachment.ts";

export interface Item {
  itemId?: number;
  category?: ItemCategory;
  name?: string;
  description?: string;
  reservePrice?: number;
  buyInPrice?: number;
  soldPrice?: number;
  status?: ItemStatus;
  createDate?: Date;
  updateDate?: Date;
  owner?: Account;
  color?: string;
  size?: string;
  weight?: string;
  brand?: string;
  age?: number;
  material?: string;
  orderId?: number;
  attachments?: Attachment[];
}

export enum ItemStatus {
  QUEUE = "QUEUE",
  IN_AUCTION = "IN_AUCTION",
  SOLD = "SOLD",
  UNSOLD = "UNSOLD",
  REMOVED = "REMOVED"
}