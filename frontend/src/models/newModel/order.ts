import { Payment } from '@/constants/interfaces';
import { Item } from '@/models/Item.ts';

interface OrderDetail {
  itemId: number;
  orderId: number;
  soldPrice: number;
  createDate: string; // Changed to string to match the provided format
}

export interface Order {
  orderId?: number;
  createDate: string; // Changed to string to match the provided format
  shippingAddress?: string;
  shippingNote?: string | null; // Explicitly allowing null
  shippingStatus?: ShippingStatus | null; // Explicitly allowing null
  payment?: Payment;
  itemDTOS: Item[];
  fee: number; // Added field
  orderDetails: OrderDetail[]; // Added field
  subtotal: number; // Added field
}

export enum ShippingStatus {
  PACKAGING = 'PACKAGING',
  DELIVERING = 'DELIVERING',
  DELIVERED = 'DELIVERED',
}
