import { SERVER_DOMAIN_URL } from '@/constants/domain';
import { ConsignmentStatus } from '@/constants/enums';
import { showErrorToast } from '@/lib/handle-error';
import { getCookie, removeCookie } from '@/utils/cookies';
import axios from '@/config/axiosConfig.ts';
import { toast } from 'sonner';
import { Search } from 'lucide-react';

export const fetchAllConsignmentsService = async (pageNumber: number, pageSize: number) => {
  let params = {
    page: pageNumber || 0,
    size: pageSize || 50,
  };
  console.log(params);
  return await axios
    .get(`${SERVER_DOMAIN_URL}/api/consignments/`, {
      headers: {
        'Content-Type': 'application/json',

        Authorization: 'Bearer ' + JSON.parse(getCookie('user')).accessToken || '',
      },
      params: params,
    })
    .then((res) => {
      console.log(res.data.content);
      return res;
    }) // return the data here
    .catch((err) => {
      console.log(err);
      if (err?.response.status == 401) {
        removeCookie('user');
        removeCookie('token');
      }
      throw err; // make sure to throw the error so it can be caught by the query
    });
};

interface GetConsignmentsSchema {
  page: number;
  size: number;
  sort?: string;
  order?: 'asc' | 'desc';
  status?: string;
  role?: string;
  search?: string;
}

export const getConsignments = async (input: GetConsignmentsSchema) => {
  try {
    const { page, size, sort, order, status } = input;

    // Prepare query parameters
    if (status === '') {
      const params: Record<string, any> = {
        page: page - 1, // Spring Boot uses 0-based page index
        size: size ? size : 10,
        sort,
        order,
        search:input.search
      };

      return await axios.get(`${SERVER_DOMAIN_URL}/api/consignments/`, {
        headers: {
          'Content-Type': 'application/json',

          Authorization: 'Bearer ' + JSON.parse(getCookie('user')).accessToken || '',
        },
        params: params,
      });
    } else {
      let params = {
        status: status,
        page: page - 1,
        size: size ? size : 10,
        sort,
        order: order,
      };
      console.log(params);
      return await axios.get(`${SERVER_DOMAIN_URL}/api/consignments/filter-by-status`, {
        headers: {
          'Content-Type': 'application/json',

          Authorization: 'Bearer ' + JSON.parse(getCookie('user')).accessToken || '',
        },
        params: params,
      });
    }
    // return response.data;
  } catch (err) {
    console.log(err);
    if (err?.response.status == 401) {
      removeCookie('user');
      removeCookie('token');
    }
  }
};

export const fetchConsignmentsByStatusService = async (
  pageNumber: number,
  pageSize: number,
  status: ConsignmentStatus
) => {
  let params = {
    status: status,
    pageNumb: pageNumber,
    pageSize: pageSize,
  };
  console.log(params);
  return await axios
    .get(`${SERVER_DOMAIN_URL}/api/consignments/filter-by-status`, {
      headers: {
        'Content-Type': 'application/json',

        Authorization: 'Bearer ' + JSON.parse(getCookie('user')).accessToken || '',
      },
      params: params,
    })
    .then((res) => {
      console.log(res.data.content);
      return res;
    }) // return the data here
    .catch((err) => {
      console.log(err);
      if (err?.response.status == 401) {
        removeCookie('user');
        removeCookie('token');
      }
      throw err; // make sure to throw the error so it can be caught by the query
    });
};

export const fetchConsignmentByConsignmentId = async (id: number) => {
  return await axios
    .get(`${SERVER_DOMAIN_URL}/api/consignments/${id}`, {
      headers: {
        'Content-Type': 'application/json',

        Authorization: 'Bearer ' + JSON.parse(getCookie('user')).accessToken || '',
      },
    })
    .then((res) => {
      console.log(res.data);
      return res;
    }) // return the data here
    .catch((err) => {
      console.log(err);
      throw err; // make sure to throw the error so it can be caught by the query
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
export const takeConsignment = async (id: string) => {
  const data = JSON.parse(getCookie('user'))?.id;

  return await axios
    .put(`${SERVER_DOMAIN_URL}/api/consignments/take/${id}`, data, {
      headers: {
        'Content-Type': 'application/json',

        Authorization: 'Bearer ' + JSON.parse(getCookie('user')).accessToken || '',
      },
    })
    .catch((err) => toast.error(err.response.data.message + ': you are not allow to take this consignment', {}));
};
export const receivedConsignment = async (id: string) => {
  return await axios
    .get(`${SERVER_DOMAIN_URL}/api/consignments/received/${id}`, {
      headers: {
        'Content-Type': 'application/json',

        Authorization: 'Bearer ' + JSON.parse(getCookie('user')).accessToken || '',
      },
    })
    .catch((err) => toast.error(err.response.data.message + ': you are not allow to take this consignment', {}));
};

//manager
export const rejectEvaluation = async (id: string, accountId: number, reason: any) => {
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
    )
    .catch((err) => toast.error(err.response.data.message, {}));
};
export const acceptEvaluation = async (id: string, accountId: number) => {
  console.log({ accountId: accountId });
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
    )
    .catch((err) => toast.error(err.response.data.message, {}));
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
