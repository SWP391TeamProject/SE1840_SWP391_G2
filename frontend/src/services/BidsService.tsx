import { getCookie } from "@/utils/cookies";
import axios from "axios";

export const fetchBidsByAccount = async (id:number) => {
  return await axios
    .get("http://localhost:8080/api/bids/"+id, {
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


export const fetchBidsByAuctionItemId = async (auctionId:number,itemId:number) => {
  return await axios
    .get("http://localhost:8080/api/bids/"+auctionId+"/"+itemId, {
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



