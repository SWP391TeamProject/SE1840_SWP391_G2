import { ItemStatus } from "@/constants/enums";
import { Account, Attachment, ItemCategory } from "@/constants/interfaces";

export interface Item{
    itemId?:number;
    category?:ItemCategory;
    name?:string;
    description?:string;
    reversePrice?:number;
    buyInPrice?:number;
    status?:ItemStatus;
    createDate?:Date;
    updateDate?:Date;
    ownner?:Account;
    orderId?:number;
    attachments?:[Attachment];
}