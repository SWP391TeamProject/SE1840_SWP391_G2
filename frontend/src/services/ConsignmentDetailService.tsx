 import { SERVER_DOMAIN_URL } from "@/constants/domain";
import { getCookie } from "@/utils/cookies";
import axios from "axios";

const URL = `${SERVER_DOMAIN_URL}/api/consignmentDetails/`;

export const fetchConsigntmentDetailByConsignmentId = async (id:number) => {
  return await axios
    .get(URL+id, {
      headers: {
        "Content-Type": "application/json",
          
        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      },
    })
    .then((res) => {
      console.log(res.data);
      return res}) // return the data here
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
            
          Authorization:
            "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
        },
      })
      .then((res) => {
        
        return res.data}) // return the data here
      .catch((err) => {
        console.log(err);
        throw err; // make sure to throw the error so it can be caught by the query
      });
  };
export const updateConsignmentDetailService = async (data: any,id :number) => {
  return await axios
    .put(URL+"update/"+id, data, {
      headers: {
        "Content-Type": "application/json",
          
        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      },
    })
    .catch((err) => console.log(err));
};

export const createInitialEvaluation = async (data: any) => {
  return await axios
    .post(URL+"createInitialEvaluation", data, {
      headers: {
        "Content-Type": "multipart/form-data",
          
        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      },
    })
};
export const createFinalEvaluation = async (data: any) => {
  return await axios
    .post(URL+"createFinalEvaluation", data, {
      headers: {
        "Content-Type": "multipart/form-data",
          
        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      },
    })
};

