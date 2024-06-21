import {AccountStatus, Roles} from "@/constants/enums.tsx";

export interface AuthResponse {
    id: number;
    accessToken: string;
    role: Roles;
    refreshToken: string;
    email: string;
    phone: string;
    nickname: string;
    avatar: string;
    address: string;
    redirect2fa: boolean;
    status: AccountStatus;
}
