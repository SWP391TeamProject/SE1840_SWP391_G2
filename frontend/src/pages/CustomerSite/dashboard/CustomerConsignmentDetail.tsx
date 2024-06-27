import { ConsignmentDetailType, ConsignmentStatus } from '@/constants/enums';
import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { acceptFinalEva, acceptInitialEva, rejectFinalEva, rejectInitialEva } from '@/services/ConsignmentService';
import { toast } from "react-toastify";

export default function CustomerConsignmentDetail() {
    const location = useLocation();
    const consignment = location.state.consignment;
    const consignmentId = location.state.consignmentId;
    const [custConsignment, setCusConsignment] = useState(consignment);
    const [custConsignmentDetail, setCustConsignmentDetail] = useState(null);

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


    useEffect(() => {
        switch (consignment.status) {
            case ConsignmentStatus.WAITING_STAFF:
                setCustConsignmentDetail(custConsignment.consignmentDetails.filter((consignmentDetail) => consignmentDetail.status === ConsignmentDetailType.REQUEST)[0]);
                break;
            case ConsignmentStatus.IN_INITIAL_EVALUATION:
                setCustConsignmentDetail(custConsignment.consignmentDetails.filter((consignmentDetail) => consignmentDetail.status === ConsignmentDetailType.INITIAL_EVALUATION)[0]);
                break;
            case ConsignmentStatus.IN_FINAL_EVALUATION:
                setCustConsignmentDetail(custConsignment.consignmentDetails.filter((consignmentDetail) => consignmentDetail.status === ConsignmentDetailType.MANAGER_ACCEPTED)[0]);
                break;
            default:
                break;
        }
    }, []);

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                <div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                        {custConsignmentDetail?.status === ConsignmentDetailType.REQUEST ? "Your Consignment Request" : ""}
                        {custConsignmentDetail?.status === ConsignmentDetailType.INITIAL_EVALUATION && "Initial Evaluation of Your Consignment"}
                        {custConsignmentDetail?.status === ConsignmentDetailType.MANAGER_ACCEPTED && "Final Evaluation of Your Consignment"}
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        {custConsignmentDetail?.description}
                    </p>
                    <p className="text-base font-medium">{custConsignmentDetail?.price}</p>
                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Status</p>
                            <p className="text-base font-medium">{consignment.status}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Submitted Date</p>
                            <p className="text-base font-medium">{consignment.createDate ? new Date(consignment.createDate).toLocaleString() : ""}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Owner</p>
                            <p className="text-base font-medium">{consignment.consignmentDetails[0].account.nickname}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Updated Date</p>
                            <p className="text-base font-medium">{consignment.updateDate ? new Date(consignment.updateDate).toLocaleString() : ""}</p>
                        </div>
                    </div>
                    <div className='pt-10 -ml-12 mr-10'>
                        {custConsignmentDetail?.status === ConsignmentDetailType.INITIAL_EVALUATION
                            || custConsignmentDetail?.status === ConsignmentDetailType.MANAGER_ACCEPTED ?
                            <ActionButton /> : null}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                    {custConsignmentDetail?.attachments?.map((attachment: any, index: number) => {
                        return (
                            <Link key={index} to={attachment.link} target="_blank" className="m-1 rounded-sm">
                                <img
                                    src={attachment.link}
                                    alt="Consignment Image"
                                    width={400}
                                    height={400}
                                    className="rounded-lg object-cover aspect-square"
                                />
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
