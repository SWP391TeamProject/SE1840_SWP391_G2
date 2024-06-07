import { fetchAccountById } from "@/services/AccountsServices";
import { getCookie } from "@/utils/cookies";
import axios from "axios";
import React from "react";
import CustomerConsigmentCard from "./components/CustomerConsigmentCard";
import LoadingAnimation from "@/components/loadingAnimation/LoadingAnimation";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { useNavigate } from "react-router-dom";


const consignmentCard = (consignment: any) => {
    return (
        <div className="flex flex-col p-4 bg-white rounded-md shadow-md">
            <div className="flex justify-between">
                <h2 className="text-lg font-bold">{consignment?.title}</h2>
                <span className="text-sm font-light">{consignment?.status}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-sm font-light">{consignment?.description}</span>
                <span className="text-sm font-light">{consignment?.createdAt}</span>
            </div>
        </div>
    );
};
enum layoutType {
    CARD = "CARD",
    TABLE = "TABLE",

}

export default function CustomerConsignmentList() {
    const [account, setAccount] = React.useState<any>();
    const [consignments, setConsignments] = React.useState<any[]>([]);
    const [layout,setLayout] = React.useState<any>(consignmentCard);
    const nav = useNavigate();


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
                axios.get(`http://localhost:8080/api/consignments/user/${userData?.id}`, {
                    headers: {
                        Authorization: `Bearer ${userData.accessToken}`,
                    },

                })
                    .then((response) => {
                        console.log(response.data);
                        setConsignments(response.data.content);
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
            <div className="flex flex-col gap-5 container p-10">
                <div className="flex flex-row items-center justify-between">
                    <div>
                        <h2 className="text-4xl font-bold">Your Consignments</h2>
                        <p>We will reach you within 2 businesses days after submitting your consignments request</p>
                    </div>
                    <div>
                        <NavigationMenu className="flex items-center gap-2">
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <NavigationMenuLink asChild  className="hover:cursor-pointer rounded-full hover:bg-gray-400 ">
                                        <PlusCircleIcon className="h-6 w-6 " onClick={()=>{
                                            nav('/create-consignment');
                                        }} />
                                    </NavigationMenuLink>


                                </NavigationMenuItem>
                            </NavigationMenuList>


                        </NavigationMenu>
                    </div>
                </div>
                <div className="flex flex-row flex-wrap gap-16 ">
                    {consignments ? consignments.map((consignment) => <CustomerConsigmentCard key={consignment.consignmentId} consignment={consignment} />) : <LoadingAnimation />}
                </div>
            </div>


        </>);
}
