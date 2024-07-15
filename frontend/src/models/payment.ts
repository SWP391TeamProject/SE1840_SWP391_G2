import { PaymentStatus, PaymentType } from "@/constants/enums";

export interface Payment{
    id?:number;
    paymentAmount?:number;
    date?:Date;
    type?:PaymentType;
    status?:PaymentStatus;
    accountId?:number;
}