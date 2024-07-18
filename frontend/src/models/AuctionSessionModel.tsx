import { AuctionItem } from "./newModel/auctionItem";
import { Item } from "./newModel/item";

export interface AuctionSession {
    auctionSessionId?: number;
    title?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    auctionItems?: AuctionItem[];
    deposits?:[];
    createDate?: string;
    updateDate?: string;
    attachments?: [];
}