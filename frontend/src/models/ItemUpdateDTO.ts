import { ItemStatus } from '@/models/Item.ts';

export interface ItemUpdateDTO {
  itemId?: number;
  categoryId?: number;
  name?: string;
  description?: string;
  reservePrice?: number;
  buyInPrice?: number;
  status?: ItemStatus;
  ownerId?: number;
  color?: string;
  weight?: number;
  metal?: string;
  gemstone?: string;
  measurement?: string;
  condition?: string;
  stamped?: string;
  consignmentId?: number;
}
