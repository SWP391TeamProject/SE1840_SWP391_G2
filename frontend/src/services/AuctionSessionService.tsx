import { getCookie, removeCookie } from "@/utils/cookies";
import axios from '@/config/axiosConfig.ts';
import { toast } from "react-toastify";
import { SERVER_DOMAIN_URL } from "@/constants/domain";

const controller = "auction-sessions";

interface getAuctionsSchema {
    page: number;
    size: number;
    sort?: string;
    order?: 'asc' | 'desc';
    status?: string;
  }

export const fetchAllAuctionSessions = async (page?: number, size?: number) => {
    let params = {
        page: page ? page - 1 : 0,
        size: size ? size : 10,
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
            toast.error(err.response.data.message, {
                position: "bottom-right",
            });
            if (err?.response.status == 401) {
                removeCookie("user");
                removeCookie("token");
            }
        });
};

export const getAuctions = async (input: getAuctionsSchema) => {
    try {
        const {
            page,
            size,
            sort,
            order,
            status,
        } = input;

        // Prepare query parameters
        // const params: Record<string, any> = {
        //     page: page - 1, // Spring Boot uses 0-based page index
        //     size: size ? size : 10,
        //     sort,
        //     status: status ? status.toUpperCase() : undefined,
        //     order,
        // };

        switch (status) {
            case "Upcoming": {
                let params = {
                    pageNumb: page - 1,
                    pageSize: size ? size : 10,
                }

                return await axios
                    .get(`${SERVER_DOMAIN_URL}/api/auction-sessions/upcoming`, {
                        headers: {
                            "Content-Type": "application/json",

                        },
                        params: params
                    })
            }
            case "Past":
                {
                    let params = {
                        pageNumb: page - 1,
                        pageSize: size ? size : 10,
                    }

                    return await axios
                        .get(`${SERVER_DOMAIN_URL}/api/auction-sessions/completed`, {
                            headers: {
                                "Content-Type": "application/json",

                            },
                            params: params
                        })
                }
            case "Acive":
                {
                    let params = {
                        page: page ? page - 1 : 0,
                        size: size ?? 10,
                    }

                    return await axios
                        .get(`${SERVER_DOMAIN_URL}/api/auction-sessions/active`, {
                            headers: {
                                "Content-Type": "application/json",
                            },
                            params: params
                        })
                }
            default:
                {
                    let params: Record<string, any> = {
                        page: page - 1, // Spring Boot uses 0-based page index
                        size: size ? size : 10,
                        sort,
                        status: status ? status.toUpperCase() : undefined,
                        order,
                    };

                    return await axios
                        .get(`${SERVER_DOMAIN_URL}/api/auction-sessions/`, {
                            headers: {
                                "Content-Type": "application/json",
                            },
                            params: params
                        })
                }
        }
    }
    catch (err) {
        console.log(err);
        if (err?.response.status == 401) {
            removeCookie("user");
            removeCookie("token");
        }
    };
};

export const fetchActiveAuctionSessions = async (page?: number, size?: number) => {
    let params = {
        page: page ?? 0,
        size: size ?? 10,
    }

    return await axios
        .get(`${SERVER_DOMAIN_URL}/api/auction-sessions/active`, {
            headers: {
                "Content-Type": "application/json",

            },
            params: params
        })
        .catch((err) => {
            toast.error(err.response.data.message, {
                position: "bottom-right",
            });
            if (err?.response.status == 401) {
                removeCookie("user");
                removeCookie("token");
            }
        });
};

export const getActiveAuction = async (input: getAuctionsSchema) => {
    try {
        const {
            page,
            size,
            sort,
            order,
            status,
        } = input;

        // Prepare query parameters
        const params: Record<string, any> = {
            page: page - 1, // Spring Boot uses 0-based page index
            size: size ? size : 10,
            sort,
            status: status ? status.toUpperCase() : undefined,
            order,
        };

        const response = await axios
        .get(`${SERVER_DOMAIN_URL}/api/auction-sessions/active`, {
            headers: {
                "Content-Type": "application/json",

            },
            params: params
        })

        return response;
    }
    catch (err) {
        console.log(err);
        if (err?.response.status == 401) {
            removeCookie("user");
            removeCookie("token");
        }
    };
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

        });
}

export const fetchPastAuctionSessions = async (page?: number, size?: number) => {
    let params = {
        pageNumb: page,
        pageSize: size ? size : 10,
    }

    return await axios
        .get(`${SERVER_DOMAIN_URL}/api/auction-sessions/completed`, {
            headers: {
                "Content-Type": "application/json",

            },
            params: params
        })
        .catch((err) => {

        });
}

export const getPastAuction = async (input: getAuctionsSchema) => {
    try {
        const {
            page,
            size,
            sort,
            order,
            status,
        } = input;

        // Prepare query parameters
        const params: Record<string, any> = {
            page: page - 1, // Spring Boot uses 0-based page index
            size: size ? size : 10,
            sort,
            status: status ? status.toUpperCase() : undefined,
            order,
        };

        const response = await axios
        .get(`${SERVER_DOMAIN_URL}/api/auction-sessions/completed`, {
            headers: {
                "Content-Type": "application/json",

            },
            params: params
        })

        return response;
    }
    catch (err) {
        console.log(err);
        if (err?.response.status == 401) {
            removeCookie("user");
            removeCookie("token");
        }
    };
};

export const fetchUpcomingAuctionSessions = async (page?: number, size?: number) => {
    let params = {
        pageNumb: page,
        pageSize: size ? size : 10,
    }

    return await axios
        .get(`${SERVER_DOMAIN_URL}/api/auction-sessions/upcoming`, {
            headers: {
                "Content-Type": "application/json",

            },
            params: params
        })
        .catch((err) => {

        });
}

export const getUpcomingAuction = async (input: getAuctionsSchema) => {
    try {
        const {
            page,
            size,
            sort,
            order,
            status,
        } = input;

        // Prepare query parameters
        const params: Record<string, any> = {
            page: page - 1, // Spring Boot uses 0-based page index
            size: size ? size : 10,
            sort,
            status: status ? status.toUpperCase() : undefined,
            order,
        };

        const response = await axios
        .get(`${SERVER_DOMAIN_URL}/api/auction-sessions/upcoming`, {
            headers: {
                "Content-Type": "application/json",

            },
            params: params
        })

        return response;
    }
    catch (err) {
        console.log(err);
        if (err?.response.status == 401) {
            removeCookie("user");
            removeCookie("token");
        }
    };
};


export const fetchAuctionSessionById = async (id: number) => {
    return await axios
        .get(`${SERVER_DOMAIN_URL}/api/${controller}/${id}`, {
            headers: {
                "Content-Type": "application/json",

            },
        })
        .catch((err) => {

            if (err?.response.status == 401) {
                removeCookie("user");
                removeCookie("token");
            }
        });
}


export const fetchAuctionSessionByTitle = async (page?: number, size?: number, title?: string) => {
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
        });
}
export const assignItem = async (id: number, assignItem: any) => {
    console.log(assignItem);
    console.log(id);
    return await axios
        .post(`${SERVER_DOMAIN_URL}/api/auction-sessions/assign-auction-session`, {
            auctionSessionId: id,
            item: assignItem
        }, {
            headers: {
                "Content-Type": "application/json",

                Authorization:
                    "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
            }
        });
}

export const finishAuctionSession = async (auctionSessionID: number) => {
    return await axios
        .get(`${SERVER_DOMAIN_URL}/api/${controller}/finish/${auctionSessionID}`, {
            headers: {
                "Content-Type": "application/json",

                Authorization:
                    "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
            },
        })
}
export const terminateAuctionSession = async (auctionSessionId: number) => {
    return await axios
        .get(`${SERVER_DOMAIN_URL}/api/${controller}/terminate/${auctionSessionId}`, {
            headers: {
                "Content-Type": "application/json",

                Authorization:
                    "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
            },
        })
}
