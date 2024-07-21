import { ItemCategory } from '@/models/ItemCategory.ts';
import { Account } from '@/models/AccountModel.tsx';
import { Attachment } from '@/models/Attachment.ts';

export interface Item {
  itemId: number;
  category: ItemCategory;
  name: string;
  description: string;
  reservePrice: number;
  buyInPrice: number;
  status: ItemStatus;
  createDate: string;
  updateDate: string;
  owner: Account;
  color: string;
  weight: number;
  metal: string;
  gemstone: string;
  measurement: string;
  condition: string;
  stamped: string;
  attachments: Attachment[];
}

export enum ItemStatus {
  QUEUE = 'QUEUE',
  IN_AUCTION = 'IN_AUCTION',
  SOLD = 'SOLD',
  REMOVED = 'REMOVED',
}

type StatusMap = {
  [key in ItemStatus]: Set<ItemStatus>;
};

const VALID_TRANSITIONS: StatusMap = {
  [ItemStatus.QUEUE]: new Set([ItemStatus.QUEUE, ItemStatus.REMOVED]),
  [ItemStatus.IN_AUCTION]: new Set([ItemStatus.IN_AUCTION]),
  [ItemStatus.SOLD]: new Set([ItemStatus.SOLD]),
  [ItemStatus.REMOVED]: new Set([ItemStatus.REMOVED]),
};

export function isValidTransition(oldStatus: ItemStatus, newStatus: ItemStatus): boolean {
  const validTransitions = VALID_TRANSITIONS[oldStatus];
  return validTransitions.has(newStatus);
}
