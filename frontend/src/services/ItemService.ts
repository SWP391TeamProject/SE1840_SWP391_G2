import axios from "axios";
import {Item, ItemStatus} from "@/models/Item.ts";
import {Page} from "@/models/Page.ts";
import { getCookie } from "@/utils/cookies";

// Service methods
const baseUrl = "http://localhost:8080/api/items";
const authHeader = {
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
    },
};

export const getItems = async (page: number, size: number) => {
    return await axios.get<Page<Item>>(`${baseUrl}/`, {
        ...authHeader,
        params: { page, size },
    });
};

export const getItemsByCategoryId = async (categoryId: number, page: number, size: number) => {
    return await axios.get<Page<Item>>(`${baseUrl}/category/${categoryId}`, {
        ...authHeader,
        params: { page, size },
    });
};

export const getItemsByStatus = async (status: ItemStatus, page: number, size: number) => {
    return await axios.get<Page<Item>>(`${baseUrl}/status/${status}`, {
        ...authHeader,
        params: { page, size },
    });
};

export const getItemsByOwnerId = async (ownerId: number, page: number, size: number) => {
    return await axios.get<Page<Item>>(`${baseUrl}/owner/${ownerId}`, {
        ...authHeader,
        params: { page, size },
    });
};

export const getItemById = async (id: number) => {
    return await axios.get<Item>(`${baseUrl}/detail/${id}`, authHeader);
};

export const createItem = async (itemDTO: Item) => {
    return await axios.post<Item>(`${baseUrl}/create`, itemDTO, authHeader);
};

export const updateItem = async (itemDTO: Item) => {
    if (!itemDTO.itemId) {
        throw new Error("Item id cannot be null");
    }
    return await axios.put<Item>(`${baseUrl}/update`, itemDTO, authHeader);
};
