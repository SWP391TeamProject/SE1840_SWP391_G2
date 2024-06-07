import { Attachment } from "@/constants/interfaces";

export interface AuthResponse{
    id?:number;
    accessToken?:string;
    role?:AccountStatus;
    email?:string;
    phone?:string;
    nickname?:string;
    attachment?:Attachment;
    address?:string;
    status?:AccountStatus;
    balance?:number;
}

export enum AccountStatus {
    ACTIVE = "ACTIVE",
    DISABLED = "DISABLED",
    
  }