import { getCookie } from "@/utils/cookies";
import axios from "axios";
const m: string = "https://fakestoreapi.com/users";
export const fetchAccountsService = async () => {
  return await axios
    .get("http://localhost:8080/api/accounts/", {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      },
    })
    .catch((err) => console.log(err));
};

export const updateAccountService = async (data: any) => {
  return await axios
    .put("http://localhost:8080/api/accounts/", data, {
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
    .post("http://localhost:8080/api/accounts/", data, {
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
    .delete(`http://localhost:8080/api/accounts/${id}`, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      },
    })
    .catch((err) => console.log(err));
};