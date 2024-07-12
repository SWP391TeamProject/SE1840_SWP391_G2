import { API_SERVER } from "@/constants/domain";
import { PaymentStatus } from "@/constants/enums";
import { Page } from "@/models/Page";
import { Order } from "@/models/newModel/order";
import { getCookie } from "@/utils/cookies";
import axios from "axios";

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

export const getOrdersById = async (id: number) => {
    return await axios.get<Page<Order>>(`${baseUrl}/${id}`, {
        headers: {
            "Content-Type": "application/json",

            Authorization: "Bearer " + JSON.parse(getCookie("user"))?.accessToken,
        },
    });
};

export const updateShippingAddress = async (id: number, address: string) => {
    return await axios.get<void>(`${baseUrl}/update/${id}?address=${address}`, {
        headers: {
            "Content-Type": "application/json",

            Authorization: "Bearer " + JSON.parse(getCookie("user"))?.accessToken,
        },
    });
}