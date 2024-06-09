import { getCookie } from "@/utils/cookies";
import axios from "axios";
import { toast } from "react-toastify";

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
    .get(`http://localhost:8080/api/consignments/take/${id}`, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      },
    })
    .catch((err) => toast.error(err.response.data.message+": you are not allow to delete this consignment"));
};

//staff
export const takeConsignment = async (id: string) => {
  const data=JSON.parse(getCookie("user"))?.id;
  
  return await axios
    .put(`http://localhost:8080/api/consignments/take/${id}`, data,{
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      }
    })
    .catch((err) => toast.error(err.response.data.message+": you are not allow to take this consignment"));
};
export const receivedConsignment = async (id: string) => {  
  return await axios
    .get(`http://localhost:8080/api/consignments/received/${id}`,{
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      }
    })
    .catch((err) => toast.error(err.response.data.message+": you are not allow to take this consignment"));
};

//manager
export const rejectEvaluation = async (id: string,accountId:number,reason:any) => {  
  console.log({accountId: accountId,reason:reason})
  return await axios
    .post(`http://localhost:8080/api/consignments/reject/${id}`,{accountId: accountId,reason:reason},{
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Access-Control-Allow-Origin": "*",
        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      }
    })
    .catch((err) => toast.error(err.response.data.message));
};
export const acceptEvaluation = async (id: string,accountId:number) => {  
  console.log({accountId: accountId})
  return await axios
    .post(`http://localhost:8080/api/consignments/approve/${id}`,{accountId: accountId},{
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Access-Control-Allow-Origin": "*",
        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      }
    })
    .catch((err) => toast.error(err.response.data.message));
};

//customer
export const acceptInitialEva = async (id: number) => {
  return await axios
    .get("http://localhost:8080/api/consignments/acceptIniEva/"+id, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      },
    })
};
export const rejectInitialEva = async (id: number) => {
  return await axios
    .get("http://localhost:8080/api/consignments/rejectIniEva/"+id, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      },
    })
};

export const acceptFinalEva = async (id: number) => {
  return await axios
    .get("http://localhost:8080/api/consignments/acceptFinalEva/"+id, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      },
    })
};
export const rejectFinalEva = async (id: number) => {
  return await axios
    .get("http://localhost:8080/api/consignments/rejectFinalEva/"+id, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      },
    })
};
