import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableHeader, TableRow } from "@/components/ui/table";
import Consignment from "@/models/consignment";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCurrentConsignment } from "@/redux/reducers/Consignments";
import { RootState } from "@/redux/store";
import { fetchConsigntmentDetailByConsignmentId } from "@/services/ConsignmentDetailService";
import { fetchConsignmentByConsignmentId } from "@/services/ConsignmentService";
import { Label } from "@radix-ui/react-dropdown-menu";
import { UploadIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ConsignmentDetailDialog from "./ConsignmentDetailDialog";

export default function ConsignmentDetail() {
    const param = useParams();

    const dispatch = useAppDispatch();


    const [consignment, setConsignment] = useState<Consignment | undefined>(undefined);

    useEffect(() => {
        console.log(param);
        // dispatch(setCurrentConsignment(param.id));
        fetchConsignmentByConsignmentId(param.id).then((res) => {
            console.log(res.data.content);
            setConsignment(res.data.content[0]);
        }).catch((error) => {
            console.log(error);
            toast.error(error.response.data.message);
        })
    }, []);

    return (
        <>
            <div className="flex flex-col justify-start w-full h-full m-0 p-3">
                <section className="w-full h-1/3 p-3  mb-3 drop-shadow-lg">
                    <Card>
                        <CardHeader>
                            <CardTitle>Consignment #{consignment?.consignmentId}</CardTitle>
                            <CardDescription>Status: {consignment?.status}  </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Create Date: {new Date(consignment?.createDate).toLocaleDateString('en-US')}</p>
                        </CardContent>
                        <CardFooter>
                            <p>Prefer contact: {consignment?.preferContact}</p>
                        </CardFooter>
                    </Card>
                </section>
                <div className="flex justify-start flex-row w-full gap-2">
                    <div className="basis-2/3">
                        {Array.isArray(consignment?.consignmentDetails) ? consignment.consignmentDetails.reverse().map((item, index) => {
                            return (
                                <Card key={index} className="w-full">
                                    <CardHeader>
                                        <CardTitle>Consignment Detail #{index + 1} <ConsignmentDetailDialog consignmentDetail={item} /></CardTitle>
                                        <CardDescription>{item.status}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p>description:{item.description}</p>
                                        <p>price:{item.price ? item.price : "not specified"}</p>
                                        <div className="w-ful flex justify-between">
                                            <p>Initiator: {item.account.nickname}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )

                        }
                        ) : null}
                    </div>

                    <Card className="basis-1/3">
                        <CardHeader>
                            <CardTitle>Customer information


                            </CardTitle>
                            <CardDescription>{Array.isArray(consignment?.consignmentDetails) ? consignment.consignmentDetails.reverse()[0].account.email : null}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col w-full">
                                    <p>
                                        Name:  {Array.isArray(consignment?.consignmentDetails) ? consignment.consignmentDetails.reverse()[0].account.nickname : null}

                                    </p>
                                    <p>
                                        Email:    {Array.isArray(consignment?.consignmentDetails) ? consignment.consignmentDetails.reverse()[0].account.email : null}
                                    </p>
                                    <p>
                                        Phone:  {Array.isArray(consignment?.consignmentDetails) ? consignment.consignmentDetails.reverse()[0].account.phone : 'not provided'}

                                    </p>
                                </div>

                                <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </div>

                        </CardContent>
                    </Card>

                </div>
            </div>



        </>
    )
}
