import { API_SERVER } from "@/constants/domain";
import { PaymentType } from "@/constants/enums";
import { getCookie, removeCookie } from "@/utils/cookies";
import axios from "axios";

export const fetchPaymentssService = async (pageNumber: number, pageSize: number,type:PaymentType) => {
  let params = {
    page: pageNumber,
    size: pageSize,
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