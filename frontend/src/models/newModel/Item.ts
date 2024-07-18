import { ItemStatus } from "@/constants/enums";
import { Account, Attachment } from "@/constants/interfaces";
import { ItemCategory } from "./itemCategory";

export interface Item{
    itemId?:number;
    category?:ItemCategory;
    name?:string;
    description?:string;
    reservePrice?:number;
    buyInPrice?:number;
    status?:ItemStatus;
    createDate?:Date;
    updateDate?:Date;
    ownner?:Account;
    orderId?:number;
    attachments?:[Attachment];
}