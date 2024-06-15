import { Account } from "../AccountModel";
import { BlogCategory } from "./blogCategory";

export interface BlogPost{
    postId?:number;
    category?:BlogCategory;
    author?: Account;
    title?:string;
    content?:string;
    createDate?:Date;
    updateDate?:Date;
}