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
import { acceptEvaluation, fetchConsignmentByConsignmentId, receivedConsignment, rejectEvaluation, takeConsignment } from "@/services/ConsignmentService";
import { Label } from "@radix-ui/react-dropdown-menu";
import { UploadIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ConsignmentDetailDialog from "./ConsignmentDetailDialog";
import SendEvaluationForm from "./SendEvaluation";
import { ConsignmentDetailType, ConsignmentStatus, Roles } from "@/constants/enums";
import { getCookie } from "@/utils/cookies";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { set } from "react-hook-form";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ConsignmentDetail() {
    const param = useParams();

    const dispatch = useAppDispatch();

    const [consignment, setConsignment] = useState<Consignment | undefined>(undefined);
    const [state, setState] = useState(false);
    useEffect(() => {
        console.log(param);
        // dispatch(setCurrentConsignment(param.id));
        fetchConsignmentByConsignmentId(param.id).then((res) => {
            console.log(res.data.content);
            setConsignment(res.data);
        }).catch((error) => {
            console.log(error);
            toast.error(error.response.data.message);
        })
    }, [state]);

    const ConfirmReceive = (consignmentId: any) => {
        return (
            <AlertDialog>
                <AlertDialogTrigger>
                    <Button variant="default">Confirm item received</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            account and remove your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleRecieve(consignmentId)}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )

    }

    const ConfirmTake = (consignmentId: any) => {
        return (
            <AlertDialog>
                <AlertDialogTrigger>
                    <Button variant="default">Take this consignment</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            account and remove your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleTake(consignmentId)}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )

    }

    const handleRecieve = (consignmentId: any) => {
        receivedConsignment(consignmentId?.consignmentId).then((res) => {
            console.log(res);
            setConsignment(res.data);
            toast.success("Received consignment successfully");
            setState(!state);
        }).catch((error) => {
            console.log(error);
            toast.error(error.response.data.message);
        })
    }
    const handleTake = (consignmentId: any) => {
        takeConsignment(consignmentId?.consignmentId).then((res) => {
            console.log(res);
            setConsignment(res.data);
            toast.success("Take consignment successfully");
            setState(!state);
        }).catch((error) => {
            console.log(error);
            toast.error(error.response.data.message);
        })
    }


    const rejectConsignment = (consignmentId: number, reasonInput: any) => {
        console.log(consignmentId);

        const accountId = JSON.parse(getCookie('user')).id;
        const reason = reasonInput == null ? "reject by manager" : reasonInput;
        rejectEvaluation(consignmentId.toString(), accountId, reason).then((res) => {
            console.log(res);
            toast.success("Reject consignment successfully");
            setState(!state);
        }).catch((error) => {
            console.log(error);
            toast.error(error.response.data.message);
        })
    }
    const acceptConsignment = (consignmentId: number) => {
        console.log(consignmentId);

        const accountId = JSON.parse(getCookie('user')).id;
        acceptEvaluation(consignmentId.toString(), accountId).then((res) => {
            console.log(res);
            toast.success("Accept consignment successfully");
            setState(!state);
        }).catch((error) => {
            console.log(error);
            toast.error(error.response.data.message);
        })
    }

    const Action = () => {
        const length = consignment?.consignmentDetails?.length;
        if (JSON.parse(getCookie('user')).role === Roles.STAFF) {
            if (consignment?.status === ConsignmentStatus.IN_INITIAL_EVALUATION) {
                if (!consignment?.consignmentDetails?.some(detail => detail?.status === 'INITIAL_EVALUATION')) {
                    return <SendEvaluationForm consignmentParent={consignment} />;
                } else {
                    return <Badge className="bg-amber-400">Waiting Seller Accept</Badge>;
                }
            }
            if (consignment?.status === ConsignmentStatus.IN_FINAL_EVALUATION) {
                if (consignment?.consignmentDetails?.some(detail => detail?.status === 'MANAGER_ACCEPTED')) {
                    return <Badge className="bg-green-300">Success</Badge>;
                } else if (consignment?.consignmentDetails[length - 1]?.status === 'FINAL_EVALUATION') {
                    return <Badge className="bg-amber-400">Waiting Manager Accept</Badge>;
                } else {
                    return <SendEvaluationForm consignmentParent={consignment} />;
                }
            }
            if (consignment?.status === ConsignmentStatus.SENDING) {
                return <ConfirmReceive consignmentId={consignment?.consignmentId} />;
            }
            if (consignment?.status === ConsignmentStatus.WAITING_STAFF) {
                return <ConfirmTake consignmentId={consignment?.consignmentId} />;
            }
        } else if (JSON.parse(getCookie('user')).role === Roles.MANAGER) {
            if (consignment?.status === ConsignmentStatus.IN_FINAL_EVALUATION) {
                if (consignment?.consignmentDetails[length - 1]?.status === 'FINAL_EVALUATION') {
                    return <><Button className="bg-red-400 mr-16 w-24" onClick={() => rejectConsignment(consignment.consignmentId, null)}>Reject</Button>
                        <Button className="bg-green-400  mr-16 w-24" onClick={() => acceptConsignment(consignment.consignmentId)}>Accept</Button></>;
                }
            }
        }
    }



    return (
        <div className="flex flex-col justify-start w-full h-full m-0 p-3">
            <div className="w-full h-fit p-3  mb-3 drop-shadow-lg flex justify-start flex-row  flex-wrap gap-2 overflow-hidden ">
                <Card className="basis-3/6">
                    <CardHeader>
                        <CardTitle>Consignment #{consignment?.consignmentId}</CardTitle>
                        <CardDescription className="flex gap-3">Status: 
                        {(() => {
                            switch (consignment?.status) {
                                case ConsignmentStatus.WAITING_STAFF:
                                    return <Badge variant="default" className="bg-yellow-500 w-[150px] text-center flex justify-center items-center">Waiting for Staff</Badge>;
                                case ConsignmentStatus.FINISHED:
                                    return <Badge variant="default" className="bg-green-500 w-[150px] text-center flex justify-center items-center">Finished</Badge>;
                                case ConsignmentStatus.IN_INITIAL_EVALUATION:
                                    return <Badge variant="default" className="bg-blue-500 w-[150px] text-center flex justify-center items-center">In Initial Evaluation</Badge>;
                                case ConsignmentStatus.IN_FINAL_EVALUATION:
                                    return <Badge variant="default" className="bg-indigo-500 w-[150px] text-center flex justify-center items-center">In Final Evaluation</Badge>;
                                case ConsignmentStatus.SENDING:
                                    return <Badge variant="default" className="bg-purple-500 w-[150px] text-center flex justify-center items-center">Sending</Badge>;
                                case ConsignmentStatus.TERMINATED:
                                    return <Badge variant="default" className="bg-red-500 w-[150px] text-center flex justify-center items-center">Terminated</Badge>;
                                default:
                                    return <Badge variant="destructive">Unknown Status</Badge>;
                            }
                        })()}
                        </CardDescription>


                    </CardHeader>
                    <CardContent>
                        <p>Create Date: {new Date(consignment?.createDate).toLocaleDateString('en-US')}</p>
                        <p>Prefer contact: {consignment?.preferContact}</p>

                    </CardContent>
                    <CardFooter>
                        {Action()}
                    </CardFooter>
                </Card>
                <Card className="basis-2/6 h-fit  ">
                    <CardHeader>

                        <CardTitle className="flex flex-row justify-between items-center">

                            <h3>Customer information</h3>
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
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


                        </div>

                    </CardContent>
                </Card>
            </div>
            <div className="flex justify-start flex-row w-full mt-1 gap-2">
                <div className="basis-2/3">
                    <ScrollArea className="w-full h-96 border rounded-xl ">
                        {Array.isArray(consignment?.consignmentDetails) ? consignment.consignmentDetails.reverse().map((item, index) => {
                            return (
                                <Card key={index} className="w-full">
                                    <CardHeader>
                                        <CardTitle>Consignment Detail #{index + 1} <ConsignmentDetailDialog consignmentDetail={item} /></CardTitle>
                                        <CardDescription>
                                            {(() => {
                                                switch (item.status) {
                                                    case ConsignmentDetailType.MANAGER_REJECTED:
                                                        return <Badge variant="default" className="bg-yellow-500 w-[150px] text-center flex justify-center items-center">Manager Rejected</Badge>;
                                                    case ConsignmentDetailType.INITIAL_EVALUATION:
                                                        return <Badge variant="default" className="bg-green-500 w-[150px] text-center flex justify-center items-center">Initial Evaluation</Badge>;
                                                    case ConsignmentDetailType.FINAL_EVALUATION:
                                                        return <Badge variant="default" className="bg-blue-500 w-[150px] text-center flex justify-center items-center">Final Evaluation</Badge>;
                                                    case ConsignmentDetailType.MANAGER_ACCEPTED:
                                                        return <Badge variant="default" className="bg-indigo-500 w-[150px] text-center flex justify-center items-center">Manager Accepted</Badge>;
                                                    case ConsignmentDetailType.REQUEST:
                                                        return <Badge variant="default" className="bg-purple-500 w-[150px] text-center flex justify-center items-center">Request</Badge>;
                                                    default:
                                                        return <Badge variant="destructive">Unknown Status</Badge>;
                                                }
                                            })()}</CardDescription>
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
                    </ScrollArea>

                </div>



            </div>
        </div >



    )
}
