import { API_SERVER } from "@/constants/domain";
import { getCookie, removeCookie } from "@/utils/cookies";
import axios from "axios";

export const fetchAccountsService = async () => {
  return await axios
    .get(API_SERVER + "/accounts/", {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      },
    })
    .catch((err) => {
      console.log(err);
      if(err?.response.status == 401) {
        removeCookie("user");
        removeCookie("token");
      }
    });
};

export const updateAccountService = async (data: any, id: number) => {
  return await axios
    .put(API_SERVER + "/accounts/" + id, data, {
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
    .post(API_SERVER + "/accounts", data, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      },
    })
    .catch((err) => console.log(err));
};

export const deleteAccountService = async (id: string) => {
  return await axios
    .delete(API_SERVER + "/accounts/" + id, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      },
    })
    .catch((err) => console.log(err));
};