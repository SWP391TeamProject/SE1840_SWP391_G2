export interface AuthResponse {
    id: number;
    accessToken: string;
    role: string;
    refreshToken: string;
    email: string;
    phone: string;
    nickname: string;
    avatar: string;
    address: string;
}
