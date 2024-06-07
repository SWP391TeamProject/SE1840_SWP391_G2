export interface Notification{
    notificationId?:number;
    userId?:number;
    message?:string;
    type?:string;
    isRead?:boolean;
    createDate?:Date;
    updateDate?:Date;
}