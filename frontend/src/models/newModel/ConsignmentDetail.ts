import { ConsignmentDetailType } from '@/constants/enums';
import { Attachment } from '@/constants/interfaces';
import { Account } from '@/models/AccountModel.tsx';

export interface ConsignmentDetail {
  consignmentDetailId?: number;
  description?: string;
  type?: ConsignmentDetailType;
  price?: number;
  consignmentId?: number;
  account?: Account;
  attachments?: Attachment[];
  createDate?: Date;
}
