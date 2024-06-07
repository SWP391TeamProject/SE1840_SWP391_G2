import { Account, ConsignmentDetail } from "@/constants/interfaces";

export interface Consignment{
    consignmentId?:number;
    status?:string;
    preferContact?:string;
    staff?:Account;
    createDate?:Date;
    updateDate?:Date;
    consignmentDetails?:[ConsignmentDetail];
}