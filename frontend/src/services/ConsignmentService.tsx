import { SERVER_DOMAIN_URL } from "@/constants/domain";
import { getCookie, removeCookie } from "@/utils/cookies";
import axios from "axios";
import { toast } from "react-toastify";

export const fetchAllConsignmentsService = async (pageNumber: number, pageSize: number) => {
  let params = {
    pageNumb: pageNumber,
    pageSize: pageSize,
  }
  console.log(params);
  return await axios
    .get(`${SERVER_DOMAIN_URL}/api/consignments/`, {
      headers: {
        "Content-Type": "application/json",

        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      },
      params: params
    })
    .then((res) => {
      console.log(res.data.content);
      return res
    }) // return the data here
    .catch((err) => {
      console.log(err);
      if (err?.response.status == 401) {
        removeCookie("user");
        removeCookie("token");
      }
      throw err; // make sure to throw the error so it can be caught by the query
    });
};

export const fetchConsignmentByConsignmentId = async (id: number) => {

  return await axios
    .get(`${SERVER_DOMAIN_URL}/api/consignments/${id}`, {
      headers: {
        "Content-Type": "application/json",

        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      },
    })
    .then((res) => {
      console.log(res.data);
      return res
    }) // return the data here
    .catch((err) => {
      console.log(err);
      throw err; // make sure to throw the error so it can be caught by the query
    });
}


export const updateConsignmentService = async (data: any) => {
  return await axios
    .put(`${SERVER_DOMAIN_URL}/api/consignments/`, data, {
      headers: {
        "Content-Type": "application/json",

        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      },
    })
    .catch((err) => console.log(err));
};

export const createConsignmentService = async (data: any) => {
  return await axios
    .post(`${SERVER_DOMAIN_URL}/api/consignments/create`, data, {
      headers: {
        "Content-Type": "multipart/form-data",

        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      },
    })
};
export const deleteConsignmentService = async (id: string) => {
  return await axios
    .get(`${SERVER_DOMAIN_URL}/api/consignments/take/${id}`, {
      headers: {
        "Content-Type": "application/json",

        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      },
    })
    .catch((err) => toast.error(err.response.data.message + ": you are not allow to delete this consignment", {
      position: "bottom-right",
    }));
};

//staff
export const takeConsignment = async (id: string) => {
  const data = JSON.parse(getCookie("user"))?.id;

  return await axios
    .put(`${SERVER_DOMAIN_URL}/api/consignments/take/${id}`, data, {
      headers: {
        "Content-Type": "application/json",

        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      }
    })
    .catch((err) => toast.error(err.response.data.message + ": you are not allow to take this consignment", {
      position: "bottom-right",
    }));
};
export const receivedConsignment = async (id: string) => {
  return await axios
    .get(`${SERVER_DOMAIN_URL}/api/consignments/received/${id}`, {
      headers: {
        "Content-Type": "application/json",

        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      }
    })
    .catch((err) => toast.error(err.response.data.message + ": you are not allow to take this consignment",{
      position:"bottom-right",
  }));
};

//manager
export const rejectEvaluation = async (id: string, accountId: number, reason: any) => {
  console.log({ accountId: accountId, reason: reason })
  return await axios
    .post(`${SERVER_DOMAIN_URL}/api/consignments/reject/${id}`, { accountId: accountId, reason: reason }, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",

        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      }
    })
    .catch((err) => toast.error(err.response.data.message,{
      position:"bottom-right",
  }));
};
export const acceptEvaluation = async (id: string, accountId: number) => {
  console.log({ accountId: accountId })
  return await axios
    .post(`${SERVER_DOMAIN_URL}/api/consignments/approve/${id}`, { accountId: accountId }, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",

        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      }
    })
    .catch((err) => toast.error(err.response.data.message,{
      position:"bottom-right",
  }));
};

//customer
export const acceptInitialEva = async (id: number) => {
  return await axios
    .get(`${SERVER_DOMAIN_URL}/api/consignments/acceptIniEva/` + id, {
      headers: {
        "Content-Type": "application/json",

        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      },
    })
};
export const rejectInitialEva = async (id: number) => {
  return await axios
    .get(`${SERVER_DOMAIN_URL}/api/consignments/rejectIniEva/${id}`, {
      headers: {
        "Content-Type": "application/json",

        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      },
    })
};

export const acceptFinalEva = async (id: number) => {
  return await axios
    .get(`${SERVER_DOMAIN_URL}/api/consignments/acceptFinalEva/` + id, {
      headers: {
        "Content-Type": "application/json",

        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      },
    })
};
export const rejectFinalEva = async (id: number) => {
  return await axios
    .get(`${SERVER_DOMAIN_URL}/api/consignments/rejectFinalEva/` + id, {
      headers: {
        "Content-Type": "application/json",

        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      },
    })
};
