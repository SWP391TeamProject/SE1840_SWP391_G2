export interface BlogPost{
    postId?:number;
    categoryId?:number;
    authorId?:number;
    title?:string;
    content?:string;
    createDate?:Date;
    updateDate?:Date;
}