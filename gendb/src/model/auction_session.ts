import {AuctionItem} from "./auction_item";

export interface AuctionSession {
    id: number,
    title: string,
    description: string,
    startDate: Date,
    endDate: Date,
    status: AuctionStatus,
    createDate: Date,
    updateDate: Date,
    imageURLs: string[],
    items: AuctionItem[],
    participantCount: number
}

export enum AuctionStatus {
    SCHEDULED = "SCHEDULED", PROGRESSING = "PROGRESSING", FINISHED = "FINISHED"
}