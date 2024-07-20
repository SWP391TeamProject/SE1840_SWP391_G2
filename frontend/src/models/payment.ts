import { PaymentStatus, PaymentType } from '@/constants/enums';

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
  method?: method;
}
