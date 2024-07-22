import { Account } from '@/constants/interfaces';
import { ConsignmentDetail } from './ConsignmentDetail';
import { Attachment } from './attachment';

export interface Consignment {
  consignmentId?: number;
  status?: string;
  preferContact?: string;
  description?: string;
  color?: string;
  size?: string;
  weight?: string;
  brand?: string;
  age?: number;
  material?: string;
  user?: Account;
  staff?: Account;
  createDate?: Date;
  updateDate?: Date;
  consignmentDetails?: [ConsignmentDetail];
  attachments?: Attachment[];
}
