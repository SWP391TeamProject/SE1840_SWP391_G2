import { API_SERVER } from "@/constants/domain";
import { getCookie, removeCookie } from "@/utils/cookies";
import axios from "axios";

export const getNewUsersByYear = async (year: number) => {
  let params = {
    year: year
  }
  return await axios
    .get(API_SERVER + "/statistics/users/filter-by-year", {
      headers: {
        "Content-Type": "application/json",
         
        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      },
      params: params
    })
    .catch((err) => {
      console.log(err);
      if (err?.response.status == 401) {
        removeCookie("user");
        removeCookie("token");
      }
    });
};
export const getUserThisMonth = async () => {
  return await axios
    .get(API_SERVER + "/statistics/users/filter-by-month", {
      headers: {
        "Content-Type": "application/json",
         
        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      },
    })
    .catch((err) => {
      console.log(err);
      if (err?.response.status == 401) {
        removeCookie("user");
        removeCookie("token");
      }
    });
};

export const getTotalOrder = async () => {
  return await axios
    .get(API_SERVER + "/statistics/totals/order", {
      headers: {
        "Content-Type": "application/json",
         
        Authorization
          : "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      },
    })
    .catch((err) => {
      console.log(err);
      if (err?.response.status == 401) {
        removeCookie("user");
        removeCookie("token");
      }
    });
};

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based, pad single digits with leading zero
  const day = String(date.getDate()).padStart(2, '0'); // Pad single digits with leading zero
  return `${year}/${month}/${day}`;
};

export const getPaymentByStatus = async (type?: string) => {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1); // Start of current year
  const endOfYear = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999); // End of current year

  // Default parameters if not provided
  type = type;

  // Format the dates to yyyy/MM/dd
  const formattedStartDate = formatDate(startOfYear);
  const formattedEndDate = formatDate(endOfYear);

  // Adjust the URL to include query parameters for GET request
  const url = `${API_SERVER}/statistics/payments/filter-by-status?startDate=${formattedStartDate}&endDate=${formattedEndDate}&type=${type}`;

  try {
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(getCookie("user"))?.accessToken || "",
      },
    });
    return response.data; // Return response data
  } catch (err) {
    console.error("Error fetching revenue data:", err);
    if (err?.response?.status === 401) {
      removeCookie("user");
      removeCookie("token");
    }
    throw err; // Re-throw error for handling elsewhere if needed
  }
};

export const getTotalItemSold = async () => {
  return await axios
    .get(API_SERVER + "/statistics/totals/item_sold", {
      headers: {
        "Content-Type": "application/json",
         

        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      },
    })
    .catch((err) => {
      console.log(err);
      if (err?.response.status == 401) {
        removeCookie("user");
        removeCookie("token");
      }
    });
};




export const getTotalSale = async () => {
  return await axios
    .get(API_SERVER + "/statistics/total/sales", {
      headers: {
        "Content-Type": "application/json",
         
        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      },
    })
    .catch((err) => {
      console.log(err);
      if (err?.response.status == 401) {
        removeCookie("user");
        removeCookie("token");
      }
    });
};

export const getTotalRevenueByPastAuction = async (year: number) => {
  let params = {
    year: year
  }
  return await axios
    .get(API_SERVER + "/statistics/auctions/filter-by-year", {
      headers: {
        "Content-Type": "application/json",
         
        Authorization:
          "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
      },
      params: params
    })
    .catch((err) => {
      console.log(err);
      if (err?.response.status == 401) {
        removeCookie("user");
        removeCookie("token");
      }
    });
};