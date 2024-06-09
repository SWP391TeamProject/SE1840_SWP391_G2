import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ConsignmentDetailType, ConsignmentStatus } from "@/constants/enums";
import { acceptFinalEva, acceptInitialEva, rejectFinalEva, rejectInitialEva } from "@/services/ConsignmentService";
import { Description, Dialog } from "@radix-ui/react-dialog";
import { CheckIcon } from "lucide-react";
import React from "react";
import { set } from "react-hook-form";
import { toast } from "react-toastify";

export default function CustomerConsigmentCard({ consignment }) {

    const [custConsignment, setCusConsignment] = React.useState<any>(consignment);
    console.log(custConsignment);
    if(consignment.status === ConsignmentStatus.WAITING_SELLER){
        consignment.status = ConsignmentStatus.IN_FINAL_EVALUATION;
        setCusConsignment(consignment);
    }

    const acceptEvaluation = () => {
        if (custConsignment.status === ConsignmentStatus.IN_INITIAL_EVALUATION) {
            acceptInitialEva(custConsignment.consignmentId
            ).then((res) => {
                setCusConsignment(res.data);
                toast.success("Initial Evaluation Accepted");
            }).catch((err) => {
                toast.error("Error in accepting Initial Evaluation");
            });
        } else if (custConsignment.status === ConsignmentStatus.IN_FINAL_EVALUATION) {
            acceptFinalEva(custConsignment.consignmentId
            ).then((res) => {
                setCusConsignment(res.data);
                toast.success("Final Evaluation Accepted");
            }).catch((err) => {
                toast.error("Error in accepting Final Evaluation");
            });
        }
    }
    const rejectEvaluation = () => {
        if (custConsignment.status === ConsignmentStatus.IN_INITIAL_EVALUATION) {
            rejectInitialEva(custConsignment.consignmentId
            ).then((res) => {
                setCusConsignment(res.data);
                toast.success("Initial Evaluation Rejected");
            }).catch((err) => {
                toast.error("Error in Rejecting Initial Evaluation");
            });
        } else if (custConsignment.status === ConsignmentStatus.IN_FINAL_EVALUATION) {
            rejectFinalEva(custConsignment.consignmentId
            ).then((res) => {
                setCusConsignment(res.data);
                toast.success("Final Evaluation Rejected");
            }).catch((err) => {
                toast.error("Error in Rejecting Final Evaluation");
            });
        }
    }
    const ActionButton = () => {
        return (
            <div className="flex justify-evenly">
                <Button className="w-1/3 bg-red-500" onClick={rejectEvaluation}>Decline</Button>
                <Button className="w-1/3 bg-green-500" onClick={acceptEvaluation}>Accept</Button>
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
                        <DialogTitle className=" text-2xl font-bold text-black">
                            {custConsignmentDetail?.status === ConsignmentDetailType.REQUEST && "Your Consignment Request"}
                            {custConsignmentDetail?.status === ConsignmentDetailType.INITIAL_EVALUATION && "Initial Evaluation of Your Consignment"}
                            {custConsignmentDetail?.status === ConsignmentDetailType.MANAGER_ACCEPTED && "Final Evaluation of Your Consignment"}
                        </DialogTitle>
                        <DialogDescription>

                            <h1 className="block text-xl font-medium text-black">{custConsignmentDetail == null ? "Your consignment is in evaluation process. Please wait for the result." : "Description"}</h1>
                            {custConsignmentDetail?.description}
                            <h1 className="block text-xl font-medium text-black">{custConsignmentDetail == null ? "" : "Price"}</h1>
                            {custConsignmentDetail?.price}
                            <div className="flex justify-end">
                                {custConsignmentDetail?.attachments?.map((attachment: any, index: number) => {
                                    return (
                                        <img key={index} src={attachment.link} alt="attachment" className="w-1/4 h-1/4" />
                                    )
                                })}
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
                            ) && <OpenConsignmentDetail />
                        }
                    </div>
                </CardContent>
            </Card>
        </>);
}
