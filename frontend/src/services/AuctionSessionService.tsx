import { getCookie, removeCookie } from "@/utils/cookies";
import axios from '@/config/axiosConfig.ts';
import { toast } from "react-toastify";

const controller = "auction-sessions";

export const fetchAllAuctionSessions = async () => {
    return await axios
        .get("http://localhost:8080/api/auction-sessions/", {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        })
        .catch((err) => {
            toast.error(err.response.data.message);
            if (err?.response.status == 401) {
                removeCookie("user");
                removeCookie("token");
            }
        });
};

export const createAuctionSession = async (data: any) => {
    return await axios
        .post(`http://localhost:8080/api/${controller}/`, data, {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization:
                    "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
            },
        })
        .catch((err) => {
            toast.error(err.response.data.message);
            if (err?.response.status == 401) {
                removeCookie("user");
                removeCookie("token");
            }
        });
}
export const registerAuctionSession = async (id: number) => {
    return await axios
        .get(`http://localhost:8080/api/auction-sessions/register/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization:
                    "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
            },
        })
        .catch((err) => {
            toast.error(err.response.data.message);
            if (err?.response.status == 401) {
                removeCookie("user");
                removeCookie("token");
            }
        });
}