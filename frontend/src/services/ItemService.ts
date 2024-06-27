import axios from "axios";
import { Item, ItemStatus } from "@/models/Item.ts";
import { Page } from "@/models/Page.ts";
import { getCookie, removeCookie } from "@/utils/cookies";
import { API_SERVER } from "@/constants/domain";

// Service methods
const baseUrl = API_SERVER + "/items";


export const getItems = async (pageNumber: number, pageSize?: number, minPrice?: number, maxPrice?: number, sort? : string, order?:string,status?:ItemStatus) => {
    let params = {
        page: pageNumber,
        size: pageSize,
        minPrice: minPrice,
        maxPrice: maxPrice,
        sort: sort,
        order: order,
        status: status
    }
    return await axios.get<Page<Item>>(`${baseUrl}/`, {
        headers: {
            "Content-Type": "application/json",

        },
        params: params,
    });
};

export const getItemsByCategoryId = async (page: number, size: number, categoryId: number, minPrice?: number, maxPrice?: number, sort? : string, order?:string,status?:ItemStatus) => {
    return await axios.get<Page<Item>>(`${baseUrl}/category/${categoryId}`, {
        headers: {
            "Content-Type": "application/json",

        },
        params: { page, size, minPrice, maxPrice , sort, order, status},
    });
};
export const getItemsByName = async (page: number, size: number, name: string, sort? : string, order?:string,status?:ItemStatus) => {
    return await axios.get<Page<Item>>(`${baseUrl}/search/${name}`, {
        headers: {
            "Content-Type": "application/json",

        },
        params: { page, size, sort, order, status},
    });
};

export const getItemsByStatus = async (status: ItemStatus, page: number, size: number) => {
    return await axios.get<Page<Item>>(`${baseUrl}/status/${status}`, {
        headers: {
            "Content-Type": "application/json",

        },
        params: { page, size },
    })
        .catch((err) => {
            console.log(err);
            if (err?.response.status == 401) {
                removeCookie("user");
                removeCookie("token");
            }
        });;
};

export const getItemsByOwnerId = async (ownerId: number, page: number, size: number) => {
    return await axios.get<Page<Item>>(`${baseUrl}/owner/${ownerId}`, {
        headers: {
            "Content-Type": "application/json",
            
        },
        params: { page, size },
    });
};

export const getItemById = async (id: number) => {
    return await axios.get<Item>(`${baseUrl}/detail/${id}`, {
        headers: {
            "Content-Type": "application/json",

        },
    });
};

export const createItem = async (itemDTO: any) => {
    return await axios.post<Item>(`${baseUrl}/create`, itemDTO, {
        headers: {
            "Content-Type": "multipart/form-data",

            "Authorization": "Bearer " + JSON.parse(getCookie("user") || "{}").accessToken || "",
        }
    });
};

export const updateItem = async (itemDTO: Item) => {
    if (!itemDTO.itemId) {
        throw new Error("Item id cannot be null");
    }
    return await axios.put<Item>(`${baseUrl}/update`, itemDTO, {
        headers: {
            "Content-Type": "application/json",

            "Authorization": "Bearer " + JSON.parse(getCookie("user") || "{}").accessToken || "",
        },
    });
};
