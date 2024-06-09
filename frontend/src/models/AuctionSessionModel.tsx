export interface AuctionSession {
    auctionSessionId?: number;
    title?: string;
    startDate?: Date;
    endDate?: Date;
    status?: string;
    auctionItems?: [];
    deposits?:[];
    createDate?: Date;
    updateDate?: Date;
    attachments?: [];
}