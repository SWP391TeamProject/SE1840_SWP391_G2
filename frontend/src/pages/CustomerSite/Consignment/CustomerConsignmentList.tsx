import { fetchAccountById } from "@/services/AccountsServices";
import { getCookie } from "@/utils/cookies";
import axios from "axios";
import React from "react";


const consignmentCard = (consignment: any) => {
    return (
        <div className="flex flex-col p-4 bg-white rounded-md shadow-md">
            <div className="flex justify-between">
                <h2 className="text-lg font-bold">{consignment.title}</h2>
                <span className="text-sm font-light">{consignment.status}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-sm font-light">{consignment.description}</span>
                <span className="text-sm font-light">{consignment.createdAt}</span>
            </div>
        </div>
    );
};

export default function CustomerConsignmentList() {
    const [account, setAccount] = React.useState<any>();
    const [consignments, setConsignments] = React.useState<any[]>([]);



    React.useEffect(() => {
        const userCookie = getCookie("user");
        if (userCookie) {
            try {
                const userData = JSON.parse(userCookie);
                fetchAccountById(userData?.id).then((res) => {
                    console.log(res.data)
                    setAccount(res.data)
                }).catch((err) => {
                    console.log(err);
                });
                axios.get(`http://localhost:8080/api/consignments/user/${userData?.id}`,{
                    headers: {
                        Authorization: `Bearer ${userData.accessToken}`,
                    },
                
                })
                    .then((response) => {
                        console.log(response.data);
                        setConsignments(response.data);
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            } catch (err) {
                console.error("Failed to parse user cookie:", err);
            }


        }


    }, []);
    return (
        <>
            <div className="flex container p-10">
                <h2 className="text-2xl font-bold">Welcome Back {account?.nickname}</h2>


            </div>
        </>);
}
