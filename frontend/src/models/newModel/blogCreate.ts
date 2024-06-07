export interface BlogCreate{
    postId?:number;
    categoryId?:number;
    userId?:number;
    title?:string;
    content?:string;
    images?:[];
    createDate?:Date;
    updateDate?:Date;
}