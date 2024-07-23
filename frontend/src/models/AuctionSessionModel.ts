import { AuctionSessionStatus } from '@/constants/enums.tsx';
import { AuctionItem } from '@/models/auctionItem.ts';

export interface AuctionSession {
  auctionSessionId?: number;
  title?: string;
  startDate?: string;
  endDate?: string;
  status?: AuctionSessionStatus;
  auctionItems?: AuctionItem[];
  createDate?: string;
  updateDate?: string;
  suspendDate?: string;
  attachments?: [];
  hasDeposited?: boolean;
  participantCount?: number;
  description?: string;
}
