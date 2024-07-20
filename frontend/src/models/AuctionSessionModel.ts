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
}

export interface auctionSessionSchema {
  auctionSessionId: Number;
  title: String;
  description: String;
  startDate: Date;
  endDate: Date;
  status: String;
  createDate: Date;
  updateDate: Date;
  attachments: Attachment[];
  auctionItems: AuctionItem[];
}
