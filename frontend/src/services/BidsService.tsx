import { SERVER_DOMAIN_URL } from "@/constants/domain";
import { getCookie } from "@/utils/cookies";
import axios from "axios";


export const fetchBidsByAccount = async (id: number) => {
  return await axios
    .get(`${SERVER_DOMAIN_URL}/api/bids/` + id, {
      headers: {
        "Content-Type": "application/json",

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

export const exportBids = async () => {
  return await fetch(`${SERVER_DOMAIN_URL}/api/bids/export`, {
    method: 'GET',
    headers: {
      Authorization:
        "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
    },
  }).then((response) => response.blob())
    .then((blob) => {
      // Create a blob URL and create a link element to trigger the download
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = blobUrl;
      a.download = 'bids.xlsx'; // Set the desired file name with .xls extension
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(blobUrl);
    })
    .catch((error) => {
      console.error('Error fetching Excel file:', error);
    });;
};


export const fetchBidsByAuctionItemId = async (auctionId: number, itemId: number) => {
  return await axios
    .get(`${SERVER_DOMAIN_URL}/api/bids/` + auctionId + `/` + itemId, {
      headers: {
        "Content-Type": "application/json",

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



