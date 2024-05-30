import { getCookie } from "@/utils/cookies";
import axios from "axios";

const controller = "auction-sessions";

export const fetchAllAuctionSessions = async () => {
    return await axios
        .get("http://localhost:8080/api/auction-sessions/", {
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        })
        .then((res) => {console.log(res.data.content)
            return res.data.content
        } ) // return the data instead of logging it
        .catch((err) => console.log(err));
    };