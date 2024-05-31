import axios from "axios";

export const fetchAllItems = async () => {
  return await axios
    .get("http://localhost:8080/api/items/", {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
    .then((res) => res.data) // return the data instead of logging it
    .catch((err) => console.log(err));
};
