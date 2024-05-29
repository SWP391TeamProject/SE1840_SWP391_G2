import { getCookie } from "@/utils/cookies";
import axios from "axios";

const URL = "http://localhost:8080/api/consignmentDetails/";

export const fetchConsigntmentDetailByConsignmentId = async (id:number) => {
  return await axios
    .get(URL+id, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      },
    })
    .then((res) => {
      console.log(res.data);
      return res.data}) // return the data here
    .catch((err) => {
      console.log(err);
      throw err; // make sure to throw the error so it can be caught by the query
    });
};
export const fetchConsigntmentDetailByConsignmentDetailId = async (id:number) => {
    return await axios
      .get(URL+"detail/"+id, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization:
            "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
        },
      })
      .then((res) => {
        console.log(res.data);
        return res.data}) // return the data here
      .catch((err) => {
        console.log(err);
        throw err; // make sure to throw the error so it can be caught by the query
      });
  };
export const updateConsignmentService = async (data: any,id :number) => {
  return await axios
    .put(URL+"update/"+id, data, {
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
    .post(URL+"create", data, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Access-Control-Allow-Origin": "*",
        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      },
    })
    .catch((err) => console.log(err));
};

