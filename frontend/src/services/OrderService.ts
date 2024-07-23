import { API_SERVER } from '@/constants/domain';
import { PaymentStatus } from '@/constants/enums';
import { Page } from '@/models/Page';
import { Order, ShippingStatus } from '@/models/newModel/order';
import {getCookie, getBearerToken} from '@/utils/cookies';
import axios from '@/config/axiosConfig.ts';
import {formatDateToISO} from "@/lib/utils.ts";

// Service methods
const baseUrl = API_SERVER + '/orders';

interface GetOrdersSchema {
  page: number;
  size: number;
  sort?: string;
  order?: 'asc' | 'desc';
  status?: string;
  shippingStatus?: string;
  from?: Date;
  to?: Date;
  search?: string;
  user?: number;
}

export const getOrders = async (input: GetOrdersSchema) => {
  const { page, size, sort,
    status, shippingStatus, from, to, search, user } = input;

  let params = {
    page: page && page - 1, // Spring Boot uses 0-based page index
    size: size ? size : 10,
    sort: sort ? sort : 'orderId,desc',
    status: status ? status.toUpperCase() : undefined,
    shippingStatus: shippingStatus ? shippingStatus.toUpperCase() : undefined,
    from: formatDateToISO(from),
    to: formatDateToISO(to),
    search,
    user
  };
  return await axios.get<Page<Order>>(`${baseUrl}`, {
    headers: {
      'Content-Type': 'application/json',

      Authorization: getBearerToken(),
    },
    params: params,
  });
};

export const getOrdersByUserId = async (
  pageNumber: number,
  pageSize?: number,
  sort?: string,
  order?: string,
  status?: PaymentStatus
) => {
  let params = {
    page: pageNumber,
    size: pageSize,
    sort: sort,
    order: order,
    status: status,
  };
  return await axios.get<Page<Order>>(`${baseUrl}/user/${JSON.parse(getCookie('user'))?.id}`, {
    headers: {
      'Content-Type': 'application/json',

      Authorization: getBearerToken(),
    },
    params: params,
  });
};

export const getOrderById = async (id: number) => {
  return await axios.get<Order>(`${baseUrl}/${id}`, {
    headers: {
      'Content-Type': 'application/json',

      Authorization: getBearerToken(),
    },
  });
};

export const payOrder = async (
  id: number,
  dto: {
    shippingAddress?: string;
    shippingNote?: string;
  }
) => {
  return await axios.post<Order>(`${baseUrl}/pay/${id}`, dto, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: getBearerToken(),
    },
  });
};
export const updateOrder = async (
  id: number,
  dto: {
    shippingAddress?: string;
    shippingNote?: string;
    shippingStatus?: ShippingStatus;
  }
) => {
  return await axios.post<Order>(`${baseUrl}/${id}`, dto, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: getBearerToken(),
    },
  });
};
