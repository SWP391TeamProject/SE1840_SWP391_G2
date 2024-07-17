import { Payment } from "../payment";
import {Item} from "@/models/Item.ts";

export interface Order {
    orderId?: number;
    createDate?: Date;
    shippingAddress?: string;
    shippingNote?: string;
    shippingStatus?: ShippingStatus;
    payment?:Payment;
    itemDTOS: Item[];
  }

export enum ShippingStatus {
    PACKAGING = "PACKAGING",
    DELIVERING = "DELIVERING",
    DELIVERED = "DELIVERED"
}