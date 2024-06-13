import {AccountStatus, Roles} from "@/constants/enums";

export interface Account {
  accountId: number;
  // username: string;
  email: string;
  nickname: string;
  phone: string;
  avatar?: {
    link?: string
  };
  accessToken?: string;
  balance?: number;
  role: Roles;
  createDate?: Date;
  updateDate?: Date;
  status: AccountStatus
}
