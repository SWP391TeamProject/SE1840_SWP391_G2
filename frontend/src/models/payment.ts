import { PaymentStatus, PaymentType } from '@/constants/enums';
import { Account } from '@/constants/interfaces.ts';

export enum method {
  VNPAY = 'VNPAY',
  PAYPAL = 'PAYPAL',
  MANUAL = 'MANUAL',
}

export interface Payment {
  id?: number;
  paymentAmount?: number;
  createDate?: Date;
  type?: PaymentType;
  status?: PaymentStatus;
  accountId?: number;
  account?: Account;
  method?: method;
  consignmentRewardItemId?: number;
  depositAuctionId?: number;
  failedReason?: string;
}
