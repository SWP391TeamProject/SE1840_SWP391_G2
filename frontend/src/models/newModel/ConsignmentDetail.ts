import { ConsignmentDetailType } from "@/constants/enums";
import { Account, Attachment } from "@/constants/interfaces";


export interface ConsignmentDetail{
    consignmentDetailId?:number;
    desciprtion?:string;
    status?: ConsignmentDetailType;
    price?:number;
    conisgnmentId?:number;
    account?:Account;
    attachments?:[Attachment];
}