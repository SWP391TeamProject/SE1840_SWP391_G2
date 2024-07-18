import { API_SERVER } from "@/constants/domain";
import { PaymentStatus } from "@/constants/enums";
import { Page } from "@/models/Page";
import {Order, ShippingStatus} from "@/models/newModel/order";
import { getCookie } from "@/utils/cookies";
import axios from "@/config/axiosConfig.ts";

// Service methods
const baseUrl = API_SERVER + "/orders";


export const getOrders = async (pageNumber: number, pageSize?: number, sort?: string, order?: string, status?: PaymentStatus) => {
    let params = {
        page: pageNumber,
        size: pageSize | 10,
        sort: sort,
        order: order,
        status: status
    }
    return await axios.get<Page<Order>>(`${baseUrl}`, {
        headers: {
            "Content-Type": "application/json",

            Authorization: "Bearer " + JSON.parse(getCookie("user"))?.accessToken,
        },
        params: params,
    });
};

export const getOrdersByUserId = async (pageNumber: number, pageSize?: number, sort?: string, order?: string, status?: PaymentStatus) => {
    let params = {
        page: pageNumber,
        size: pageSize,
        sort: sort,
        order: order,
        status: status
    }
    return await axios.get<Page<Order>>(`${baseUrl}/user/${JSON.parse(getCookie("user"))?.id}`, {
        headers: {
            "Content-Type": "application/json",

            Authorization: "Bearer " + JSON.parse(getCookie("user"))?.accessToken,
        },
        params: params,
    });
};

export const getOrderById = async (id: number) => {
    return await axios.get<Order>(`${baseUrl}/${id}`, {
        headers: {
            "Content-Type": "application/json",

            Authorization: "Bearer " + JSON.parse(getCookie("user"))?.accessToken,
        },
    });
};


export const payOrder = async (id: number, dto : {
    shippingAddress?: string,
    shippingNote?: string
}) => {
    console.log(JSON.parse(getCookie("user") || "{}").accessToken || "")
    return await axios.post<Order>(`${baseUrl}/pay/${id}`, dto, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + JSON.parse(getCookie("user") || "{}").accessToken || "",
        },
    });
}
export const updateOrder = async (id: number, dto : {
    shippingAddress?: string,
    shippingNote?: string,
    shippingStatus?: ShippingStatus
}) => {
    return await axios.post<Order>(`${baseUrl}/${id}`, dto, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + JSON.parse(getCookie("user") || "{}").accessToken || "",
        },
    });
}