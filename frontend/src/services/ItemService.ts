import axios from '@/config/axiosConfig.ts';
import { Item, ItemStatus } from '@/models/Item.ts';
import { Page } from '@/models/Page.ts';
import { getCookie, getBearerToken, removeCookie } from '@/utils/cookies';
import { API_SERVER } from '@/constants/domain';
import { Attachment } from '@/models/Attachment.ts';
import { ItemUpdateDTO } from '@/models/ItemUpdateDTO.ts';

// Service methods
const baseUrl = API_SERVER + '/items';

interface GetItemsSchema {
  page: number;
  size: number;
  sort?: string;
  order?: 'asc' | 'desc';
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  categoryId?: number;
}

export const getItems = async (input: GetItemsSchema) => {
  const { page, size, sort, status, minPrice, maxPrice, search, categoryId } = input;

  let params = {
    page: page && page - 1, // Spring Boot uses 0-based page index
    size: size ? size : 10,
    sort: sort ? sort : 'itemId,desc',
    status: status ? status.toUpperCase() : undefined,
    categoryId,
    search,
    minPrice,
    maxPrice,
  };
  return await axios.get<Page<Item>>(`${baseUrl}/`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: getBearerToken(),
    },
    params: params,
  });
};

export const getOwnedItems = async (pageNumber: number, pageSize?: number) => {
  let params = {
    page: pageNumber,
    size: pageSize,
  };
  return await axios.get<Page<Item>>(`${baseUrl}/inventory`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: getBearerToken(),
    },
    params: params,
  });
};

export const getItemsByCategoryId = async (
  page: number,
  size: number,
  categoryId: number,
  minPrice?: number,
  maxPrice?: number,
  sort?: string,
  order?: string,
  status?: ItemStatus
) => {
  return await axios.get<Page<Item>>(`${baseUrl}/category/${categoryId}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    params: { page, size, minPrice, maxPrice, sort, order, status },
  });
};
export const getItemsByName = async (
  page: number,
  size: number,
  name: string,
  sort?: string,
  order?: string,
  status?: ItemStatus
) => {
  return await axios.get<Page<Item>>(`${baseUrl}/search/${name}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    params: { page, size, sort, order, status },
  });
};

export const getItemsByStatus = async (status: ItemStatus, page: number, size: number) => {
  return await axios
    .get<Page<Item>>(`${baseUrl}/status/${status}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      params: { page, size },
    });
};

export const getItemsByOwnerId = async (ownerId: number, page: number, size: number) => {
  return await axios.get<Page<Item>>(`${baseUrl}/owner/${ownerId}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    params: { page, size },
  });
};

export const getItemById = async (id: number): Promise<Item | undefined> => {
  const response = await axios.get<Item>(`${baseUrl}/detail/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const createItem = async (itemDTO: ItemUpdateDTO) => {
  return await axios.post<Item>(`${baseUrl}/create`, itemDTO, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: getBearerToken(),
    },
  });
};

export const updateItem = async (itemDTO: ItemUpdateDTO) => {
  if (!itemDTO.itemId) {
    throw new Error('Item id cannot be null');
  }
  return await axios.post<Item>(`${baseUrl}/update`, itemDTO, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: getBearerToken(),
    },
  });
};

export const uploadItemAttachment = async (itemId: number, data: { files: File[] }) => {
  return await axios.put<Attachment[]>(`${baseUrl}/attachment/${itemId}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: getBearerToken(),
    },
  });
};

export const deleteItemAttachment = async (itemId: number, attachmentId: number) => {
  return await axios.delete<Attachment[]>(`${baseUrl}/attachment/${itemId}/${attachmentId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: getBearerToken(),
    },
  });
};
