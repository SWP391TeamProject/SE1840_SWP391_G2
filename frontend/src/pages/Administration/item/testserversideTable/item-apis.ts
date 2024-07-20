import axios from '@/config/axiosConfig.ts';
import { Item, ItemStatus } from '@/models/Item';
import { Page } from '@/models/Page';
import { API_SERVER } from '@/constants/domain';
import { getCookie } from '@/utils/cookies';

// Define the input schema for getItems
interface GetItemsSchema {
  page: number;
  size: number;
  sort?: string;
  search?: string;
  order?: 'asc' | 'desc';
  minPrice?: number;
  maxPrice?: number;
  status?: string;
}

const baseUrl = `${API_SERVER}/items`;

export const getItems = async (input: GetItemsSchema): Promise<Page<Item>> => {
  try {
    const { page = 1, size = 10, sort = 'createDate,desc', order, minPrice, maxPrice, status } = input;

    // Prepare query parameters
    const params: Record<string, any> = {
      page: page - 1, // Spring Boot uses 0-based page index
      size: size ? size : 10,
      sort: sort,
      search: input.search,
      minPrice,
      maxPrice,
      status: status ? status.toUpperCase() : undefined,
      order,
    };

    // Make the API call
    const response = await axios.get<Page<Item>>(`${baseUrl}/`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getCookie('token')}`,
      },
      params,
    });

    return response?.data;
  } catch (err) {
    console.error('Error fetching items:', err);
    throw err;
  }
};

export const getItemsByCategoryId = async (categoryId: number, input: GetItemsSchema): Promise<Page<Item>> => {
  try {
    const { page, size, sort = 'createDate', order, minPrice, maxPrice, status } = input;

    const params: Record<string, any> = {
      page: page - 1,
      size,
      sort,
      minPrice,
      maxPrice,
      status: status ? status.toUpperCase() : undefined,
      order,
    };

    const response = await axios.get<Page<Item>>(`${baseUrl}/category/${categoryId}`, {
      params,
    });

    return response.data;
  } catch (err) {
    console.error('Error fetching items by category:', err);
    throw err;
  }
};

export const getItemsByName = async (
  name: string,
  input: Omit<GetItemsSchema, 'minPrice' | 'maxPrice'>
): Promise<Page<Item>> => {
  try {
    const { page, size, sort = 'createDate', order, status } = input;

    const params: Record<string, any> = {
      page: page - 1,
      size,
      sort,
      status: status ? status.toUpperCase() : undefined,
      order,
    };

    const response = await axios.get<Page<Item>>(`${baseUrl}/search/${name}`, {
      params,
    });

    return response.data;
  } catch (err) {
    console.error('Error fetching items by name:', err);
    throw err;
  }
};

export const getItemsByStatus = async (status: ItemStatus, page: number, size: number): Promise<Page<Item>> => {
  try {
    const params = {
      page: page - 1,
      size,
    };

    const response = await axios.get<Page<Item>>(`${baseUrl}/status/${status}`, {
      params,
    });

    return response.data;
  } catch (err) {
    console.error('Error fetching items by status:', err);
    throw err;
  }
};

export const getItemsByOwnerId = async (ownerId: number, page: number, size: number): Promise<Page<Item>> => {
  try {
    const params = {
      page: page - 1,
      size,
    };

    const response = await axios.get<Page<Item>>(`${baseUrl}/owner/${ownerId}`, {
      params,
    });

    return response.data;
  } catch (err) {
    console.error('Error fetching items by owner:', err);
    throw err;
  }
};

export const getItemById = async (id: number): Promise<Item> => {
  try {
    const response = await axios.get<Item>(`${baseUrl}/detail/${id}`);
    return response.data;
  } catch (err) {
    console.error('Error fetching item by id:', err);
    throw err;
  }
};
