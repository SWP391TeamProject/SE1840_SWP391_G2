import { PaymentStatus, PaymentType } from "@/constants/enums";

export interface Payment{
    id?:number;
    amount?:number;
    date?:Date;
    type?:PaymentType;
    status?:PaymentStatus;
    accountId?:number;
}