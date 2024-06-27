import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ConsignmentDetailType, ConsignmentStatus } from "@/constants/enums";
import { acceptFinalEva, acceptInitialEva, rejectFinalEva, rejectInitialEva } from "@/services/ConsignmentService";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CustomerConsigmentCard({ consignment }) {
    const navigate = useNavigate();

    const [custConsignment, setCusConsignment] = React.useState<any>(consignment);
    console.log(custConsignment);
    if (consignment.status === ConsignmentStatus.WAITING_SELLER) {
        consignment.status = ConsignmentStatus.IN_FINAL_EVALUATION;
        setCusConsignment(consignment);
    }

    const acceptEvaluation = () => {
        if (custConsignment.status === ConsignmentStatus.IN_INITIAL_EVALUATION) {
            acceptInitialEva(custConsignment.consignmentId
            ).then((res) => {
                setCusConsignment(res.data);
                toast.success("Initial Evaluation Accepted", {
                    position: "bottom-right",
                });
            }).catch((err) => {
                toast.error("Error in accepting Initial Evaluation", {
                    position: "bottom-right",
                });
            });
        } else if (custConsignment.status === ConsignmentStatus.IN_FINAL_EVALUATION) {
            acceptFinalEva(custConsignment.consignmentId
            ).then((res) => {
                setCusConsignment(res.data);
                toast.success("Final Evaluation Accepted", {
                    position: "bottom-right",
                });
            }).catch((err) => {
                toast.error("Error in accepting Final Evaluation", {
                    position: "bottom-right",
                });
            });
        }
    }
    const rejectEvaluation = () => {
        if (custConsignment.status === ConsignmentStatus.IN_INITIAL_EVALUATION) {
            rejectInitialEva(custConsignment.consignmentId
            ).then((res) => {
                setCusConsignment(res.data);
                toast.success("Initial Evaluation Rejected", {
                    position: "bottom-right",
                });
            }).catch((err) => {
                toast.error("Error in Rejecting Initial Evaluation", {
                    position: "bottom-right",
                });
            });
        } else if (custConsignment.status === ConsignmentStatus.IN_FINAL_EVALUATION) {
            rejectFinalEva(custConsignment.consignmentId
            ).then((res) => {
                setCusConsignment(res.data);
                toast.success("Final Evaluation Rejected", {
                    position: "bottom-right",
                });
            }).catch((err) => {
                toast.error("Error in Rejecting Final Evaluation", {
                    position: "bottom-right",
                });
            });
        }
    }
    const ActionButton = () => {
        return (
            <div className="flex justify-evenly">
                <Button className="w-1/3 bg-red-500 text-foreground" onClick={rejectEvaluation}>Decline</Button>
                <Button className="w-1/3 bg-green-500 text-foreground" onClick={acceptEvaluation}>Accept</Button>
            </div>
        )
    }
    const OpenConsignmentDetail = () => {
        let custConsignmentDetail = null;
        switch (consignment.status) {
            case ConsignmentStatus.WAITING_STAFF:
                custConsignmentDetail = (custConsignment.consignmentDetails.filter((consignmentDetail) => consignmentDetail.status === ConsignmentDetailType.REQUEST)[0]);
                break;
            case ConsignmentStatus.IN_INITIAL_EVALUATION:
                custConsignmentDetail = (custConsignment.consignmentDetails.filter((consignmentDetail) => consignmentDetail.status === ConsignmentDetailType.INITIAL_EVALUATION)[0]);
                break;
            case ConsignmentStatus.IN_FINAL_EVALUATION:
                custConsignmentDetail = (custConsignment.consignmentDetails.filter((consignmentDetail) => consignmentDetail.status === ConsignmentDetailType.MANAGER_ACCEPTED)[0]);
                break;
            default:
                break;
        }
        console.log(custConsignmentDetail);

        return (
            <Dialog>
                <DialogTrigger className="w-full">
                    <Button className="w-full">View Detail</Button>
                </DialogTrigger>
                <DialogContent>
                    <AlertDialogHeader>
                        <DialogTitle className=" text-2xl font-bold text-foreground">
                            {custConsignmentDetail?.status === ConsignmentDetailType.REQUEST && "Your Consignment Request"}
                            {custConsignmentDetail?.status === ConsignmentDetailType.INITIAL_EVALUATION && "Initial Evaluation of Your Consignment"}
                            {custConsignmentDetail?.status === ConsignmentDetailType.MANAGER_ACCEPTED && "Final Evaluation of Your Consignment"}
                        </DialogTitle>
                        <DialogDescription>

                            <h1 className="block text-xl font-medium text-foreground">{custConsignmentDetail == null ? "Your consignment is in evaluation process. Please wait for the result." : "Description"}</h1>
                            {custConsignmentDetail?.description}
                            <h1 className="block text-xl font-medium text-foreground">{custConsignmentDetail == null || custConsignmentDetail.status === ConsignmentDetailType.REQUEST ? "" : "Price"}</h1>
                            {custConsignmentDetail?.price}
                            <div className="flex justify-center flex-wrap">
                                {custConsignmentDetail?.attachments?.map((attachment: any, index: number) => {
                                    return (
                                        <Link key={index} to={attachment.link} target="_blank" className="w-1/4 h-1/4 m-1 rounded-sm">
                                            <img src={attachment.link} alt="attachment" className="rounded-md" />
                                        </Link>
                                    )
                                })}
                            </div>
                            <div className="text-foreground opacity-50">
                                *Click on the image to download
                            </div>
                            {custConsignmentDetail?.status === ConsignmentDetailType.INITIAL_EVALUATION
                                || custConsignmentDetail?.status === ConsignmentDetailType.MANAGER_ACCEPTED ?
                                <ActionButton /> : null}
                        </DialogDescription>
                    </AlertDialogHeader>
                </DialogContent>
            </Dialog>
        )
    }

    const handleViewDetailsClick = (consignment: any, consignmentId: number) => {
        console.log(consignment, consignmentId);
        navigate(`${consignmentId}`, {
            state: {
                consignmentId: consignmentId,
                consignment: consignment,
            }
        });
    }

    return (
        <>
            <Card className="w-[350px]  ">
                <CardHeader className="w-full">
                    {
                        custConsignment?.consignmentDetails[0]?.attachments[0]
                            ? <img src={custConsignment?.consignmentDetails[0]?.attachments[0]?.link} alt="Auction Item" className="rounded-t-lg object-cover" height="225" style={{ aspectRatio: "400/225", objectFit: "cover" }} />

                            : <img src="https://via.placeholder.com/400x225" alt="Auction Item" className="rounded-t-lg object-cover" height="225" style={{ aspectRatio: "400/225", objectFit: "cover" }} />
                    }
                </CardHeader>
                <CardTitle className="text-lg font-semibold">{custConsignment.title}</CardTitle>
                <CardContent className="space-y-2">
                    <p className="text-lg font-semibold">{custConsignment.title}</p>
                    <p className="text-lg font-semibold">{custConsignment.description}</p>
                    <p className="text-lg font-semibold">{custConsignment.status}</p>
                    <div className="">
                        {
                            (custConsignment.status === ConsignmentStatus.WAITING_STAFF ||
                                custConsignment.status === ConsignmentStatus.IN_INITIAL_EVALUATION ||
                                custConsignment.status === ConsignmentStatus.IN_FINAL_EVALUATION
                            ) && <Button onClick={() => {handleViewDetailsClick(consignment, consignment.consignmentId)}} className="w-full">View Detail</Button>
                        }
                    </div>
                </CardContent>
            </Card>
        </>);
}
