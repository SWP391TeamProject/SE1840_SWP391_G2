import { Payment } from "@/constants/interfaces";

export interface Order{
    orderId?:number;
    itemId?:number;
    payment?:Payment;
}