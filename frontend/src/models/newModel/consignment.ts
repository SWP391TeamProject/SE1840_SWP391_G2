import { Account } from "@/constants/interfaces";
import { ConsignmentDetail } from "./consignmentDetail";


export interface Consignment{
    consignmentId?:number;
    status?:string;
    preferContact?:string;
    staff?:Account;
    createDate?:Date;
    updateDate?:Date;
    consignmentDetails?:[ConsignmentDetail];
}