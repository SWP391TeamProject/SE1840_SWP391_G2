import { API_SERVER, SERVER_DOMAIN_URL } from '@/constants/domain';
import { Roles } from '@/constants/enums';
import { Account } from '@/models/AccountModel';
import { Page } from '@/models/Page';
import { getCookie, removeCookie } from '@/utils/cookies';
import axios from '@/config/axiosConfig.ts';

interface GetAccountsSchema {
  page: number;
  size: number;
  sort?: string;
  search?: string;
  order?: 'asc' | 'desc';
  status?: string;
  role?: string;
}

export const fetchAccountsService = async (input: GetAccountsSchema) => {
  const { page, size, sort, order, status, role } = input;

  // Prepare query parameters
  const params: Record<string, any> = {
    page: page - 1, // Spring Boot uses 0-based page index
    size: size ? size : 10,
    sort,
    status: status ? status.toUpperCase() : undefined,
    order,
    search: input.search,
    Role: role ? role : undefined,
  };

  const response = await axios.get<Page<Account>>(API_SERVER + '/accounts/', {
    headers: {
      'Content-Type': 'application/json',

      Authorization: 'Bearer ' + JSON.parse(getCookie('user')).accessToken || '',
    },
    params: params,
  });

  return response.data;
};

export const fetchAccountsByName = async (pageNumber: number, pageSize: number, name: string) => {
  let params = {
    page: pageNumber,
    size: pageSize,
  };
  return await axios
    .get(API_SERVER + '/accounts/search/' + name, {
      headers: {
        'Content-Type': 'application/json',

        Authorization: 'Bearer ' + JSON.parse(getCookie('user')).accessToken || '',
      },
      params: params,
    })
    .catch((err) => {
      console.log(err);
      if (err?.response.status == 401) {
        removeCookie('user');
        removeCookie('token');
      }
    });
};

export const fetchAccountById = async (id: number): Promise<Account | undefined> => {
  try {
    const response = await axios.get(`${API_SERVER}/accounts/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(getCookie('user')).accessToken || ''}`,
      },
    });
    return response.data as Account;
  } catch (err) {
    console.log(err);
    if (err?.response?.status === 401) {
      removeCookie('user');
      removeCookie('token');
    }
    return undefined;
  }
};
export const createAccountService = async (data: any) => {
  return await axios.post(API_SERVER + '/accounts/', data, {
    headers: {
      'Content-Type': 'application/json',

      Authorization: 'Bearer ' + JSON.parse(getCookie('user')).accessToken || '',
    },
  });
};

export const updateAccountService = async (data: any, id: number) => {
  return await axios.put(API_SERVER + '/accounts/' + id, data, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + JSON.parse(getCookie('user')).accessToken || '',
    },
  });
};

export const deleteAccountService = async (id: string) => {
  console.log(id);
  return await axios.post(
    API_SERVER + '/accounts/' + id,
    {},
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + JSON.parse(getCookie('user')).accessToken || '',
      },
    }
  );
};

export const activateAccountService = async (id: string) => {
  return await axios.put(API_SERVER + '/accounts/activate/' + id, null, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + JSON.parse(getCookie('user')).accessToken || '',
    },
  });
};

export const exportAccounts = async () => {
  return await fetch(`${SERVER_DOMAIN_URL}/api/accounts/export`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + JSON.parse(getCookie('user')).accessToken || '',
    },
  })
    .then((response) => response.blob())
    .then((blob) => {
      // Create a blob URL and create a link element to trigger the download
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = blobUrl;
      a.download = 'accounts.xlsx'; // Set the desired file name with .xls extension
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(blobUrl);
    });
};
