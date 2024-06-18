import { getCookie, removeCookie } from "@/utils/cookies";
import axios from '@/config/axiosConfig.ts';
import { toast } from "react-toastify";
import { SERVER_DOMAIN_URL } from "@/constants/domain";

const controller = "auction-sessions";

export const fetchAllAuctionSessions = async (page?: number, size?: number) => {
    let params = {
        page: page,
        size: size,
    }

    console.log(params);

    return await axios
        .get(`${SERVER_DOMAIN_URL}/api/auction-sessions/`, {
            headers: {
                "Content-Type": "application/json",
                  
            },
            params: params
        })
        .catch((err) => {
            toast.error(err.response.data.message);
            if (err?.response.status == 401) {
                removeCookie("user");
                removeCookie("token");
            }
        });
};

export const fetchActiveAuctionSessions = async (page?: number, size?: number) => {
    let params = {
        page: page ?? 0,
        size: size ?? 10,
    }

    console.log(params);

    return await axios
        .get(`${SERVER_DOMAIN_URL}/api/auction-sessions/active`, {
            headers: {
                "Content-Type": "application/json",
                  
            },
            params: params
        })
        .catch((err) => {
            toast.error(err.response.data.message);
            if (err?.response.status == 401) {
                removeCookie("user");
                removeCookie("token");
            }
        });
};
export const fetchFeaturedAuctionSessions = async (page?: number, size?: number) => {
    let params = {
        page: page,
        size: size,
    }

    return await axios
        .get(`${SERVER_DOMAIN_URL}/api/auction-sessions/featured`, {
            headers: {
                "Content-Type": "application/json",
                  
            },
            params: params
        })
        .catch((err) => {
            toast.error(err.response.data.message);
        });
}

export const fetchPastAuctionSessions = async (page?: number, size?: number) => {
    let params = {
        pageNumb: page,
        pageSize: size,
    }

    return await axios
        .get(`${SERVER_DOMAIN_URL}/api/auction-sessions/completed`, {
            headers: {
                "Content-Type": "application/json",
                  
            },
            params: params
        })
        .catch((err) => {
            toast.error(err.response.data.message);
        });
}

export const fetchUpcomingAuctionSessions = async (page?: number, size?: number) => {
    let params = {
        pageNumb: page,
        pageSize: size,
    }

    return await axios
        .get(`${SERVER_DOMAIN_URL}/api/auction-sessions/upcoming`, {
            headers: {
                "Content-Type": "application/json",
                  
            },
            params: params
        })
        .catch((err) => {
            toast.error(err.response.data.message);
        });
}


export const fetchAuctionSessionById = async (id: number) => {
    return await axios
        .get(`${SERVER_DOMAIN_URL}/api/${controller}/${id}`, {
            headers: {
                "Content-Type": "application/json",
                  
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


export const fetchAuctionSessionByTitle = async (page?: number, size?: number,title?:string) => {
    let params = {
        page: page ?? 0,
        size: size ?? 10,
    }
    return await axios
        .get(`${SERVER_DOMAIN_URL}/api/${controller}/search/${title}`, {
            headers: {
                "Content-Type": "application/json",
                  
            },
            params: params
        })
        .catch((err) => {
            toast.error(err.response.data.message);
            if (err?.response.status == 401) {
                removeCookie("user");
                removeCookie("token");
            }
        });
}

export const createAuctionSession = async (data: any) => {
    return await axios
        .post(`${SERVER_DOMAIN_URL}/api/${controller}/`, data, {
            headers: {
                "Content-Type": "application/json",
                  
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


export const updateAuctionSession = async (data: any) => {
    return await axios
        .put(`${SERVER_DOMAIN_URL}/api/${controller}/${data.auctionSessionId}`, data, {
            headers: {
                "Content-Type": "application/json",
                  
                Authorization:
                    "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
            },
        })
}

export const registerAuctionSession = async (id: number) => {
    return await axios
        .get(`${SERVER_DOMAIN_URL}/api/auction-sessions/register/${id}`, {
            headers: {
                "Content-Type": "application/json",
                  
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