import { Attachment, AuctionItem } from "@/constants/interfaces";


export interface AuctionSession{
    auctionSessionId?: number;
    title?: string;
    startDate?: Date;
    endDate?: Date;
    status?: AuctionSessionStatus;
    createDate?:Date;
    updateDate?:Date;
    attachments?: [Attachment];
    auctionItems?: [AuctionItem];
}

export enum AuctionSessionStatus {
    TERMINATED = "TERMINATED",
    FINISHED = "FINISHED",
    PROGRESSING = "PROGRESSING",
    SCHEDULED = "SCHEDULED",
}