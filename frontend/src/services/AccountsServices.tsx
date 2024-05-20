import axios from "axios";
const m: string = "https://fakestoreapi.com/users";
export const fetchAccountsService = async () => {
  return await axios
    .get("http://localhost:8080/api/accounts")
    .catch((err) => console.log(err));
};
