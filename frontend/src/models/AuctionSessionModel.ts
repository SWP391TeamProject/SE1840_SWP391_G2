import { AuctionItem } from './auctionItem';

export interface AuctionSession {
  auctionSessionId?: number;
  title?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  auctionItems?: AuctionItem[];
  deposits?: [];
  createDate?: string;
  updateDate?: string;
  attachments?: [];
  hasDeposited?: boolean;
  participantCount?: number;
  description?: string;
}
