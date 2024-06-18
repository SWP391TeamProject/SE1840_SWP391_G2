import axios from "axios";

import { getCookie } from "../utils/cookies";
import { API_SERVER } from "../constants/domain";
import { ItemCategory } from "@/models/newModel/itemCategory";
import { Page } from "@/models/Page";



export interface ItemCategoryRequestDTO {
    itemCategoryId?: number; // Optional for creation, required for updates
    name: string;
}

// Service methods
const baseUrl = API_SERVER + "/item-categories"; 
const authHeader = {
  headers: {
    "Content-Type": "application/json",
      
    "Authorization": "Bearer " + JSON.parse(getCookie("user") || "{}").accessToken || "",
  },
};

export const createItemCategory = async (itemCategory: ItemCategoryRequestDTO) => {
  return await axios.post<ItemCategory>(`${baseUrl}/create`, itemCategory, authHeader);
};

export const updateItemCategory = async (itemCategory: ItemCategoryRequestDTO) => {
  if (!itemCategory.itemCategoryId) {
    throw new Error("ItemCategory id cannot be null");
  }
  return await axios.post<ItemCategory>(`${baseUrl}/update`, itemCategory, authHeader);
};

export const deleteItemCategory = async (id: number) => {
  return await axios.post<void>(`${baseUrl}/delete/${id}`, null, authHeader);
};

export const getItemCategoryById = async (id: number) => {
  return await axios.get<ItemCategory>(`${baseUrl}/${id}`, authHeader);
};

export const getAllItemCategories = async (page: number, size: number) => {
  return await axios.get<Page<ItemCategory>>(`${baseUrl}/`, {
    params: { page, size },
  });
};
