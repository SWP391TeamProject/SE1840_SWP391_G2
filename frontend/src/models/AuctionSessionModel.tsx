export interface AuctionSession {
    auctionSessionId?: number;
    title?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    auctionItems?: [];
    deposits?:[];
    createDate?: string;
    updateDate?: string;
    attachments?: [];
}