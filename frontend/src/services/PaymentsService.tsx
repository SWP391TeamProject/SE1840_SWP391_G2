import { API_SERVER } from "@/constants/domain";
import { PaymentType } from "@/constants/enums";
import { showErrorToast } from "@/lib/handle-error";
import { getCookie, removeCookie } from "@/utils/cookies";
import axios from "axios";

interface GetPaymentsSchema {
  page: number;
  size: number;
  sort?: string;
  order?: 'asc' | 'desc';
  status?: string;
  type?: string
}

export const getPayments = async (input: GetPaymentsSchema) => {

  try {
    const {
      page,
      size,
      sort,
      order,
      status,
      type
    } = input;

    // Prepare query parameters
    const params: Record<string, any> = {
      page: page - 1, // Spring Boot uses 0-based page index
      size: size ? size : 10,
      sort,
      status: status ? status.toUpperCase() : undefined,
      order,
      type
    };

    const response = await axios
      .get(API_SERVER + "/payments", {
        headers: {
          "Content-Type": "application/json",

          Authorization:
            "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
        },
        params: params
      })

    return response.data;
  } 
  catch (err) {
    console.log(err);
    if (err?.response.status == 401) {
      removeCookie("user");
      removeCookie("token");
    }
  };
};

export const fetchPaymentssService = async (pageNumber: number, pageSize: number,sort?:string,type?:PaymentType) => {
  let params = {
    page: pageNumber,
    size: pageSize | 10,
    sort:sort,
    type:type
  }
  return await axios
    .get(API_SERVER + "/payments", {
      headers: {
        "Content-Type": "application/json",
         
        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      },
      params: params
    })
    .catch((err) => {
      console.log(err);
      if (err?.response.status == 401) {
        removeCookie("user");
        removeCookie("token");
      }
    });
};
export const fetchPaymentssByName = async (pageNumber: number, pageSize: number, name: string) => {
  let params = {
    page: pageNumber,
    size: pageSize,
  }
  return await axios
    .get(API_SERVER + "/payments/search/"+name, {
      headers: {
        "Content-Type": "application/json",
         
        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      },
      params: params
    })
    .catch((err) => {
      console.log(err);
      if (err?.response.status == 401) {
        removeCookie("user");
        removeCookie("token");
      }
    });
};

export const fetchPaymentsById = async (id: number) => {
  return await axios
    .get(API_SERVER + "/payments/" + id, {
      headers: {
        "Content-Type": "application/json",
         
        Authorization
          : "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      },
    })
    .catch((err) => {
      console.log(err);
      if (err?.response.status == 401) {
        removeCookie("user");
        removeCookie("token");
      }
    });
};

export const createPaymentsService = async (data: any) => {
  return await axios
    .post(API_SERVER + "/payments/", data, {
      headers: {
        "Content-Type": "application/json",
         
        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      },
    })
    .catch((err) => {
      console.log(err);
      if (err?.response.status == 401) {
        removeCookie("user");
        removeCookie("token");
      }
    });
};

export const updatePaymentsService = async (data: any, id: number) => {
  return await axios
    .put(API_SERVER + "/payments/" + id, data, {
      headers: {
        "Content-Type": "application/json",
         

        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      },
    })
    .catch((err) => {
      console.log(err);
      if (err?.response.status == 401) {
        removeCookie("user");
        removeCookie("token");
      }
    });
};




export const deletePaymentsService = async (id: string) => {
  return await axios
    .post(API_SERVER + "/payments/" + id, {
      headers: {
        "Content-Type": "application/json",
         
        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      },
    })
    .catch((err) => console.log(err));
};

export const activatePaymentsService = async (id: string) => {
  return await axios
    .put(API_SERVER + "/payments/activate/" + id, null ,{
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      },
    })
    .catch((err) => console.log(err));
};

export const createPaymentWithVNPAY = async (values: any) => {
  return await axios.post(`${API_SERVER}/payments/create`, {
    ...values,
    paymentId: "",
    type: "DEPOSIT",
    status: "PENDING",
    accountId: JSON.parse(getCookie("user")).id || 0,
    ipAddr: "",
    orderInfoType: "DEPOSIT",
    method: "VNPAY"
  }, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
    },
  });
};

export const createPaymentWithPAYPAL = (values: any) => {
  return axios.post(`${API_SERVER}/payments/create`, {
    ...values,
    paymentId: "",
    type: "DEPOSIT",
    status: "PENDING",
    accountId: JSON.parse(getCookie("user")).id || 0,
    ipAddr: "",
    orderInfoType: "DEPOSIT",
    method: "PAYPAL"
  }, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
    },
  });
};