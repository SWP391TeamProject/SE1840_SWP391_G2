import { fetchAccountById } from "@/services/AccountsServices";
import { getCookie } from "@/utils/cookies";
import axios from "axios";
import React from "react";
import CustomerConsigmentCard from "./components/CustomerConsigmentCard";
import { Grid2x2Icon, PlusCircleIcon, WalletCards } from "lucide-react";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ConsignmentStatus } from "@/constants/enums";
import { SERVER_DOMAIN_URL } from "@/constants/domain";


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
    const [layout, setLayout] = React.useState<any>(layoutType.CARD);
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
                axios.get(`${SERVER_DOMAIN_URL}/api/consignments/user/${userData?.id}`, {
                    headers: {
                        Authorization: `Bearer ${userData.accessToken}`,
                    },

                })
                    .then((response) => {
                        console.log(response.data);
                        setConsignments(response.data.content);
                        consignments.sort((a, b) => { return b.consignmentId - a.consignmentId });
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            } catch (err) {
                console.error("Failed to parse user cookie:", err);
            }
            consignments.sort((a, b) => { return b.consignmentId - a.consignmentId });

        }


    }, []);
    return (
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
                                <NavigationMenuLink asChild className="hover:cursor-pointer rounded-full hover:bg-gray-400 ">
                                    <div className="h-8 w-8 rounded-full flex items-center justify-center">
                                        <PlusCircleIcon className="h-6 w-6 " onClick={() => {
                                            nav('/create-consignment');
                                        }} />
                                    </div>
                                </NavigationMenuLink>


                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className="hover:cursor-pointer rounded-full hover:bg-gray-400 " onClick={() => {
                                    setLayout(prev => {
                                        return prev === layoutType.CARD ? layoutType.TABLE : layoutType.CARD;
                                    });
                                }}>
                                    {layout === layoutType.CARD ?
                                        <div className="h-8 w-8 rounded-full flex items-center justify-center">
                                            <Grid2x2Icon className="sad" />
                                        </div>
                                        :
                                        <WalletCards className="h-8 w-8 rounded-full flex items-center justify-center" />

                                    }
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>


                    </NavigationMenu>
                </div>
            </div>
            {layout === layoutType.TABLE && consignments && consignments.length > 0 &&
                <Table data={consignments} >
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                Id
                            </TableHead>
                            <TableHead>
                                Create Date
                            </TableHead>
                            <TableHead>
                                Status
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {consignments.map((consignment) => (
                            <TableRow key={consignment.consignmentId}>
                                <TableCell >{consignment.consignmentId}</TableCell >
                                <TableCell >{consignment.createDate}</TableCell >
                                <TableCell >{consignment.status == ConsignmentStatus.WAITING_STAFF ? 'Evaluating' : 'Terminated'}</TableCell >
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

            }
            <div className={`flex flex-row flex-wrap gap-16 ${layout === layoutType.CARD ? 'block' : 'hidden'}`}>
                {layout === layoutType.CARD && consignments &&
                    consignments.sort((a, b) => { return b.consignmentId - a.consignmentId })
                        .map((consignment) =>
                            <CustomerConsigmentCard key={consignment.consignmentId} consignment={consignment} />)}
            </div>
        </div >


    );
}
