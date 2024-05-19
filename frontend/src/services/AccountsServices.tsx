import axios from 'axios';

export const fetchAccountsService = async () => {
    return await axios.get("https://fakestoreapi.com/users").catch((err) => console.log(err));
}