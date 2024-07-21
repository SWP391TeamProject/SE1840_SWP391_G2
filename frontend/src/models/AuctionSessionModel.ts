import { AuctionItem } from './auctionItem';
import { Item } from './newModel/item';
import { Attachment } from '@/models/Attachment.ts';

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
