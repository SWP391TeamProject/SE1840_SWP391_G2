import { getCookie, removeCookie } from "@/utils/cookies";
import axios from "axios";
import { toast } from "react-toastify";
import { SERVER_DOMAIN_URL } from "@/constants/domain";

export const fetchAccountsService = async () => {
  return await axios
    .get(`${SERVER_DOMAIN_URL}/api/accounts/`, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      },
    })
    .catch((err) => {
      toast.error(err.response.data.message);
    });
};

export const updateAccountService = async (data: any) => {
  return await axios
    .put(`${SERVER_DOMAIN_URL}/api/accounts/`, data, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      },
    })
    .catch((err) => console.log(err));
};

export const createAccountService = async (data: any) => {
  return await axios
    .post(`${SERVER_DOMAIN_URL}/api/accounts/`, data, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      },
    })
    .catch((err) => toast.error(err.response.data.message));
};

export const deleteAccountService = async (id: string) => {
  return await axios
    .delete(`${SERVER_DOMAIN_URL}/api/accounts/${id}`, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      },
    })
    .catch((err) => console.log(err));
};