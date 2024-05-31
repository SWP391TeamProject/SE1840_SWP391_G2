export interface AuctionSession {
    auctionSessionId?: number;
    title?: string;
    startDate?: Date;
    endDate?: Date;
    status?: string;
    deposits?:[];
    createDate?: Date;
    updateDate?: Date;
}