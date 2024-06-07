import axios from "axios";
import { Page } from "@/models/Page";
import { Notification } from "@/models/Notification";
import { getCookie } from "@/utils/cookies";
import { API_SERVER } from "@/constants/domain";

const baseUrl = `${API_SERVER}/notification`;
const authHeader = {
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Authorization": "Bearer " + JSON.parse(getCookie("user") || "{}").accessToken || "",
    },
};

export const getNotifications = async (page: number = 0, size: number = 50) => {
    return await axios.get<Page<Notification>>(`${baseUrl}/`, {
        ...authHeader,
        params: { page, size },
    });
};

export const markNotificationRead = async (id: number) => {
    return await axios.post<void>(`${baseUrl}/read/${id}`, null, authHeader);
};


export const countUnreadNotifications = async () => {
    return await axios.get<number>(`${baseUrl}/unread/`,{
        ...authHeader
    });
};
