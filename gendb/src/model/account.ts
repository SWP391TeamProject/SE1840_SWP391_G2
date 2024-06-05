import {CitizenCard} from "./citizen_card";

export interface Account {
    id: number;
    nickname: string;
    role: Role;
    email: string;
    phone: string;
    password: string;
    status: 'ACTIVE' | 'DISABLED';
    balance: number;
    citizenCard: CitizenCard | null;
    createDate: Date;
    updateDate: Date;
}

export enum Role {
    ADMIN = 'ADMIN',
    MANAGER = 'MANAGER',
    STAFF = 'STAFF',
    MEMBER = 'MEMBER'
}