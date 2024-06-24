import axios from "@/config/axiosConfig";
import {API_SERVER} from "@/constants/domain";

const baseUrl = API_SERVER + "/currency";

const currencyHeader = {
  headers: {
    "Content-Type": "application/json",
    // "Access-Control-Allow-Origin": "*"
  },
};

// Service methods

export const getExchangeRates = async (): Promise<any> => {
  const response = await axios.get(`${baseUrl}/exchange-rates`, currencyHeader);
  return response.data;
};
