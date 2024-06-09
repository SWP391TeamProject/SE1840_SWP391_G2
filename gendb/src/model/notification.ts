export interface Notification {
    notificationId: number;
    accountId: number;
    message: string;
    type: string;
    read: boolean;
    createDate: Date;
    updateDate: Date;
}
