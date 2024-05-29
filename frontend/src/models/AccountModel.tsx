import { AccountStatus, RoleName } from "@/constants/enums";

export interface Account {
  accountId: number;
  // username: string;
  email: string;
  nickname?: string;
  phone: string;
  avatar?: string;
  accessToken?: string;
  balance?: number;
  role: Role[];
  createDate?: Date;
  updateDate?: Date;
  status: AccountStatus
}

export interface Role {
  roleId: number;
  roleName: string;
}

export const roles: Role[] = [
  {
    roleId: 1,
    roleName: "MEMBER"
  },
  {
    roleId: 2,
    roleName: "STAFF"
  },
  {
    roleId: 3,
    roleName: "MANAGER"
  },
  {
    roleId: 4,
    roleName: "ADMIN"
  }
];
