
import { Item } from '@/models/Item.ts';
import {Payment} from "@/models/payment.ts";

interface OrderDetail {
  itemId: number;
  orderId: number;
  soldPrice: number;
  createDate: string; // Changed to string to match the provided format
  item?: Item;
}

export interface Order {
  orderId?: number;
  createDate: string; // Changed to string to match the provided format
  updateDate: string; // Changed to string to match the provided format
  shippingAddress?: string;
  shippingNote?: string | null; // Explicitly allowing null
  shippingStatus?: ShippingStatus | null; // Explicitly allowing null
  payment?: Payment;
  fee: number; // Added field
  orderDetails: OrderDetail[]; // Added field
  subtotal: number; // Added field
}

export enum ShippingStatus {
  PACKAGING = 'PACKAGING',
  DELIVERING = 'DELIVERING',
  DELIVERED = 'DELIVERED',
}
