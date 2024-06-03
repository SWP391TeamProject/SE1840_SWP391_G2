import { getCookie } from "@/utils/cookies";
import axios from "axios";

export const fetchAllConsignmentsService = async () => {
  return await axios
    .get("http://localhost:8080/api/consignments/", {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      },
    })
    .then((res) => {
      console.log(res.data.content);
      return res
    }) // return the data here
    .catch((err) => {
      console.log(err);
      throw err; // make sure to throw the error so it can be caught by the query
    });
};

export const fetchConsignmentByConsignmentId = async (id: number) => {

  return await axios
    .get(`http://localhost:8080/api/consignments/${id}`, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
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
    .put("http://localhost:8080/api/consignments/", data, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      },
    })
    .catch((err) => console.log(err));
};

export const createConsignmentService = async (data: any) => {
  return await axios
    .post("http://localhost:8080/api/consignments/create", data, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Access-Control-Allow-Origin": "*",
        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      },
    })
    .catch((err) => console.log(err));
};
export const deleteConsignmentService = async (id: string) => {
  return await axios
    .delete(`http://localhost:8080/api/consignments/${id}`, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      },
    })
    .catch((err) => console.log(err));
};


