import { Account } from "../AccountModel";
import { Attachment } from "./attachment";
import { BlogCategory } from "./blogCategory";

export interface BlogPost{
    postId?:number;
    category?:BlogCategory;
    author?: Account;
    title?:string;
    content?:string;
    attachments?:Attachment[];
    createDate?:Date;
    updateDate?:Date;
}