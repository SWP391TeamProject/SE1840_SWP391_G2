import axios from "axios";

export const registerAccountService = async (data: any) => {
  return await axios
    .post("http://localhost:8080/auth/register", data, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
    .catch((err) => console.log(err));
};
