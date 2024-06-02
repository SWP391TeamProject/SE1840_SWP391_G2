import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHeader, TableRow } from "@/components/ui/table";
import Consignment from "@/models/consignment";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCurrentConsignment } from "@/redux/reducers/Consignments";
import { RootState } from "@/redux/store";
import { fetchConsigntmentDetailByConsignmentId } from "@/services/ConsignmentDetailService";
import { fetchConsignmentByConsignmentId } from "@/services/ConsignmentService";
import { UploadIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

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
            <div className="flex justify-center items-center w-full"> 
                {/* this is consignment detail */}
                <Card className="basis-2/3">
                    <CardHeader>
                        <CardTitle>Consignment #{consignment?.consignmentId}</CardTitle>
                        <CardDescription>
                            Status: {consignment?.status}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="font-semibold">Description:</p>
                            <p>{consignment?.description}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Preferred Contact:</p>
                            <p>{consignment?.preferContact}</p>
                        </div>
                        {/* ... (other consignment details) */}
                        <div>
                            <p className="font-semibold">Consignment Details:</p>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        {/* ... (your table headers based on IConsignmentDetail) */}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {consignment?.consignmentDetails?.map((detail, index) => (
                                        <TableRow key={index}>
                                            {/* ... (your table cells based on IConsignmentDetail) */}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* this is consignment attachment */}
                <Card className="overflow-hidden basis-1/3">
                    <CardHeader>
                        <CardTitle>Attachment</CardTitle>
                        <CardDescription>Lipsum dolor sit amet, consectetur adipiscing elit</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-2">
                            {/* ... (your attachment list) */}
                          {consignment?.files?.map((file, index) => (
                                <button key={index}>
                                    <img
                                        alt="Product image"
                                        className="aspect-square w-full rounded-md object-cover"
                                        height="84"
                                        src={file}
                                        width="84"
                                    />
                                </button>
                            ))}
                                <button className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
                                    <UploadIcon className="h-4 w-4 text-muted-foreground" />
                                    <span className="sr-only">Upload</span>
                                </button>
                        </div>
                    </CardContent>
                </Card>
            </div>

        </>
    )
}
