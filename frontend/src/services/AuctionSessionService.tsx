import { getCookie, removeCookie } from '@/utils/cookies';
import axios from '@/config/axiosConfig.ts';
import { SERVER_DOMAIN_URL } from '@/constants/domain';
import { showErrorToast } from '@/lib/handle-error';
import { AuctionSession } from '@/models/AuctionSessionModel.tsx';
import { Page } from '@/models/Page.ts';
import {formatDateToISO} from "@/lib/utils.ts";

const controller = 'auction-sessions';

interface getAuctionsSchema {
  page: number;
  size: number;
  sort?: string;
  status?: string | string[];
  fromDate?: Date;
  toDate?: Date;
  search?: string;
}

export const getAuctions = async (input: getAuctionsSchema) => {
    const { page, size, sort, status, fromDate, toDate, search } = input;
    let statusSet = status;

    if (Array.isArray(status)) {
      statusSet = status.join(',');
    }

    let params = {
      page: page && page - 1, // Spring Boot uses 0-based page index
      size: size ? size : 10,
      sort: sort ? sort : 'auctionSessionId,desc',
      status: statusSet ? String(statusSet).toUpperCase() : undefined,
      fromDate: formatDateToISO(fromDate),
      toDate: formatDateToISO(toDate),
      search
    };

    return await axios.get<Page<AuctionSession>>(`${SERVER_DOMAIN_URL}/api/auction-sessions/`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + JSON.parse(getCookie('user')).accessToken || '',
      },
      params: params,
    });
};

export const fetchActiveAuctionSessions = async (page?: number, size?: number) => {
  let params = {
    page: page ?? 0,
    size: size ?? 10,
  };

  return await axios
    .get(`${SERVER_DOMAIN_URL}/api/auction-sessions/active`, {
      headers: {
        'Content-Type': 'application/json',
      },
      params: params,
    })
    .catch((err) => {
      showErrorToast(err);

      if (err?.response.status == 401) {
        removeCookie('user');
        removeCookie('token');
      }
    });
};

export const getActiveAuction = async (input: getAuctionsSchema) => {
  try {
    const { page, size, sort, order, status } = input;

    // Prepare query parameters
    const params: Record<string, any> = {
      page: page && page - 1, // Spring Boot uses 0-based page index
      size: size ? size : 10,
      sort,
      status: status ? status.toUpperCase() : undefined,
      order,
    };

    const response = await axios.get(`${SERVER_DOMAIN_URL}/api/auction-sessions/active`, {
      headers: {
        'Content-Type': 'application/json',
      },
      params: params,
    });

    return response;
  } catch (err) {
    console.log(err);
    if (err?.response.status == 401) {
      removeCookie('user');
      removeCookie('token');
    }
  }
};

export const fetchFeaturedAuctionSessions = async (page?: number, size?: number) => {
  let params = {
    page: page,
    size: size,
  };

  return await axios
    .get(`${SERVER_DOMAIN_URL}/api/auction-sessions/featured`, {
      headers: {
        'Content-Type': 'application/json',
      },
      params: params,
    })
    .catch((err) => {});
};

export const fetchPastAuctionSessions = async (page?: number, size?: number) => {
  let params = {
    pageNumb: page,
    pageSize: size ? size : 10,
  };

  return await axios
    .get(`${SERVER_DOMAIN_URL}/api/auction-sessions/completed`, {
      headers: {
        'Content-Type': 'application/json',
      },
      params: params,
    })
    .catch((err) => {});
};

export const getPastAuction = async (input: getAuctionsSchema) => {
  try {
    const { page, size, sort, order, status } = input;

    // Prepare query parameters
    const params: Record<string, any> = {
      page: page && page - 1, // Spring Boot uses 0-based page index
      size: size ? size : 10,
      sort,
      status: status ? status.toUpperCase() : undefined,
      order,
    };

    const response = await axios.get(`${SERVER_DOMAIN_URL}/api/auction-sessions/completed`, {
      headers: {
        'Content-Type': 'application/json',
      },
      params: params,
    });

    return response;
  } catch (err) {
    console.log(err);
    if (err?.response.status == 401) {
      removeCookie('user');
      removeCookie('token');
    }
  }
};

export const fetchUpcomingAuctionSessions = async (page?: number, size?: number) => {
  let params = {
    pageNumb: page,
    pageSize: size ? size : 10,
  };

  return await axios
    .get(`${SERVER_DOMAIN_URL}/api/auction-sessions/upcoming`, {
      headers: {
        'Content-Type': 'application/json',
      },
      params: params,
    })
    .catch((err) => {});
};

export const getUpcomingAuction = async (input: getAuctionsSchema) => {
  try {
    const { page, size, sort, order, status } = input;

    // Prepare query parameters
    const params: Record<string, any> = {
      page: page && page - 1, // Spring Boot uses 0-based page index
      size: size ? size : 10,
      sort,
      status: status ? status.toUpperCase() : undefined,
      order,
    };

    const response = await axios.get(`${SERVER_DOMAIN_URL}/api/auction-sessions/upcoming`, {
      headers: {
        'Content-Type': 'application/json',
      },
      params: params,
    });

    return response;
  } catch (err) {
    console.log(err);
    if (err?.response.status == 401) {
      removeCookie('user');
      removeCookie('token');
    }
  }
};

export const fetchAuctionSessionById = async (id: number): Promise<AuctionSession> => {
  const res = await axios.get<AuctionSession>(`${SERVER_DOMAIN_URL}/api/${controller}/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + JSON.parse(getCookie('user')).accessToken || '',
    },
  });
  return res.data;
};

export const fetchAuctionSessionByTitle = async (page?: number, size?: number, title?: string) => {
  let params = {
    page: page ?? 0,
    size: size ?? 10,
  };
  return await axios
    .get(`${SERVER_DOMAIN_URL}/api/${controller}/search/${title}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      params: params,
    })
    .catch((err) => {
      if (err?.response.status == 401) {
        removeCookie('user');
        removeCookie('token');
      }
    });
};

export const createAuctionSession = async (data: any) => {
  return await axios.post(`${SERVER_DOMAIN_URL}/api/${controller}/`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',

      Authorization: 'Bearer ' + JSON.parse(getCookie('user')).accessToken || '',
    },
  });
};

export const updateAuctionSession = async (data: any) => {
  return await axios.put(`${SERVER_DOMAIN_URL}/api/${controller}/${data.auctionSessionId}`, data, {
    headers: {
      'Content-Type': 'application/json',

      Authorization: 'Bearer ' + JSON.parse(getCookie('user')).accessToken || '',
    },
  });
};

export const registerAuctionSession = async (id: number) => {
  return await axios.get(`${SERVER_DOMAIN_URL}/api/auction-sessions/register/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + JSON.parse(getCookie('user')).accessToken || '',
    },
  });
};
export const assignItem = async (id: number, assignItem: any) => {
  console.log(assignItem);
  console.log(id);
  let formattedItem = assignItem.map((item: any) => {
    return item.itemId;
  });
  console.log('formatted data:', formattedItem);

  return await axios.post(
    `${SERVER_DOMAIN_URL}/api/auction-sessions/assign-auction-session`,
    {
      auctionSessionId: id,
      item: formattedItem,
    },
    {
      headers: {
        'Content-Type': 'application/json',

        Authorization: 'Bearer ' + JSON.parse(getCookie('user')).accessToken || '',
      },
    }
  );
};

export const finishAuctionSession = async (auctionSessionID: number) => {
  return await axios.get(`${SERVER_DOMAIN_URL}/api/${controller}/finish/${auctionSessionID}`, {
    headers: {
      'Content-Type': 'application/json',

      Authorization: 'Bearer ' + JSON.parse(getCookie('user')).accessToken || '',
    },
  });
};
export const terminateAuctionSession = async (auctionSessionId: number) => {
  return await axios.get(`${SERVER_DOMAIN_URL}/api/${controller}/terminate/${auctionSessionId}`, {
    headers: {
      'Content-Type': 'application/json',

      Authorization: 'Bearer ' + JSON.parse(getCookie('user')).accessToken || '',
    },
  });
};

export const fetchAuctionSessionHistoryOfItem = async (itemId?: number, page: number = 0, size: number = 10) => {
  return await axios.get<Page<AuctionSession>>(`${SERVER_DOMAIN_URL}/api/${controller}/history-item/${itemId}`, {
    headers: { 'Content-Type': 'application/json' },
    params: { page, size },
  });
};

export const removeAuctionItem = async (auctionItemId: any) => {
  // let params = {
  //     auctionSessionId: auctionItemId.auctionSessionId,
  //     itemId: auctionItemId.itemId
  // }

  return await axios.post(`${SERVER_DOMAIN_URL}/api/auction-items/delete`, auctionItemId, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + JSON.parse(getCookie('user')).accessToken || '',
    },
  });
};
