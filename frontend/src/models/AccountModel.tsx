export interface Account {
    id: number,
    username: string,
    email: string,
    nickname?: string,
    phone: string,
    avatar?: string,
    accessToken?: string,
    role: string,
}