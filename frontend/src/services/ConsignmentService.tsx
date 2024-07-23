import { SERVER_DOMAIN_URL } from '@/constants/domain';
import { showErrorToast } from '@/lib/handle-error';
import { getCookie } from '@/utils/cookies';
import axios from '@/config/axiosConfig.ts';
import {Page} from "@/models/Page.ts";
import {formatDateToISO} from "@/lib/utils.ts";
import Consignment from "@/models/consignment.ts";

interface GetConsignmentSchema {
  page: number;
  size: number;
  sort?: string;
  status?: string;
  from?: Date;
  to?: Date;
  customer?: number;
  search?: string;
}

export const fetchAllConsignmentsService = async (input: GetConsignmentSchema) => {
  const { page, size, sort, status, from, to, customer, search } = input;

  let params = {
    page: page && page - 1, // Spring Boot uses 0-based page index
    size: size ? size : 10,
    sort: sort ? sort : 'itemId,desc',
    status: status ? status.toUpperCase() : undefined,
    customer,
    search,
    from: formatDateToISO(from),
    to: formatDateToISO(to),
  };
  return await axios.get<Page<Consignment>>(`${SERVER_DOMAIN_URL}/api/consignments/`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + JSON.parse(getCookie('user'))?.accessToken,
    },
    params: params,
  });
};

export const fetchConsignmentByConsignmentId = async (id: number) => {
  return await axios
    .get<Consignment>(`${SERVER_DOMAIN_URL}/api/consignments/${id}`, {
      headers: {
        'Content-Type': 'application/json',

        Authorization: 'Bearer ' + JSON.parse(getCookie('user')).accessToken || '',
      },
    });
};

export const fetchConsignmentBySecretCode = async (code: string) => {
  return await axios
    .get<Consignment>(`${SERVER_DOMAIN_URL}/api/consignments/secret/${code}`, {
      headers: {
        'Content-Type': 'application/json',

        Authorization: 'Bearer ' + JSON.parse(getCookie('user')).accessToken || '',
      },
    });
};

export const updateConsignmentService = async (data: any) => {
  return await axios
    .put(`${SERVER_DOMAIN_URL}/api/consignments/`, data, {
      headers: {
        'Content-Type': 'application/json',

        Authorization: 'Bearer ' + JSON.parse(getCookie('user')).accessToken || '',
      },
    })
    .catch((err) => console.log(err));
};

export const createConsignmentService = async (data: any) => {
  return await axios.post(`${SERVER_DOMAIN_URL}/api/consignments/create`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',

      Authorization: 'Bearer ' + JSON.parse(getCookie('user')).accessToken || '',
    },
  });
};
export const deleteConsignmentService = async (id: string) => {
  return await axios
    .get(`${SERVER_DOMAIN_URL}/api/consignments/take/${id}`, {
      headers: {
        'Content-Type': 'application/json',

        Authorization: 'Bearer ' + JSON.parse(getCookie('user')).accessToken || '',
      },
    })
    .catch((err) => showErrorToast(err));
};

//staff
export const takeConsignment = async (id: number) => {
  const data = JSON.parse(getCookie('user'))?.id;

  return await axios
    .put<Consignment>(`${SERVER_DOMAIN_URL}/api/consignments/take/${id}`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + JSON.parse(getCookie('user')).accessToken || '',
      },
    });
};
export const receivedConsignment = async (id: number) => {
  return await axios
    .get<Consignment>(`${SERVER_DOMAIN_URL}/api/consignments/received/${id}`, {
      headers: {
        'Content-Type': 'application/json',

        Authorization: 'Bearer ' + JSON.parse(getCookie('user')).accessToken || '',
      },
    });
};

//manager
export const rejectStaffEvaluation = async (id: number, accountId: number, reason: any) => {
  console.log({ accountId: accountId, reason: reason });
  return await axios
    .post(
      `${SERVER_DOMAIN_URL}/api/consignments/reject/${id}`,
      { accountId: accountId, reason: reason },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Bearer ' + JSON.parse(getCookie('user')).accessToken || '',
        },
      }
    );
};

export const acceptStaffEvaluation = async (id: number, accountId: number) => {
  return await axios
    .post(
      `${SERVER_DOMAIN_URL}/api/consignments/approve/${id}`,
      { accountId: accountId },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',

          Authorization: 'Bearer ' + JSON.parse(getCookie('user')).accessToken || '',
        },
      }
    );
};

//customer
export const acceptInitialEva = async (id: number) => {
  return await axios.get(`${SERVER_DOMAIN_URL}/api/consignments/acceptIniEva/` + id, {
    headers: {
      'Content-Type': 'application/json',

      Authorization: 'Bearer ' + JSON.parse(getCookie('user')).accessToken || '',
    },
  });
};
export const rejectInitialEva = async (id: number) => {
  return await axios.get(`${SERVER_DOMAIN_URL}/api/consignments/rejectIniEva/${id}`, {
    headers: {
      'Content-Type': 'application/json',

      Authorization: 'Bearer ' + JSON.parse(getCookie('user')).accessToken || '',
    },
  });
};

export const acceptFinalEva = async (id: number) => {
  return await axios.get(`${SERVER_DOMAIN_URL}/api/consignments/acceptFinalEva/` + id, {
    headers: {
      'Content-Type': 'application/json',

      Authorization: 'Bearer ' + JSON.parse(getCookie('user')).accessToken || '',
    },
  });
};
export const rejectFinalEva = async (id: number) => {
  return await axios.get(`${SERVER_DOMAIN_URL}/api/consignments/rejectFinalEva/` + id, {
    headers: {
      'Content-Type': 'application/json',

      Authorization: 'Bearer ' + JSON.parse(getCookie('user')).accessToken || '',
    },
  });
};

export const exportConsignments = async () => {
  return await fetch(`${SERVER_DOMAIN_URL}/api/consignments/export`, {
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
      a.download = 'consignments.xlsx'; // Set the desired file name with .xls extension
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(blobUrl);
    })
    .catch((error) => {
      console.error('Error fetching Excel file:', error);
    });
};
