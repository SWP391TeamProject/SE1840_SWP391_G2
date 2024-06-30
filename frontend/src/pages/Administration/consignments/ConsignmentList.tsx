import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import {
    PlusCircle,
    MoreHorizontal,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConsignmentContactPreference, ConsignmentStatus } from "@/constants/enums";
import { fetchAllConsignmentsService, fetchConsignmentsByStatusService, takeConsignment } from "@/services/ConsignmentService";
import { setCurrentConsignment, setCurrentPageList, setCurrentPageNumber } from "@/redux/reducers/Consignments";
import PagingIndexes from "@/components/pagination/PagingIndexes";
import LoadingAnimation from "@/components/loadingAnimation/LoadingAnimation";

export default function ConsignmentList() {
    const consignmentsList = useAppSelector((state) => state.consignments);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [statusFilter, setStatusFilter] = useState("all");
    const [isLoading, setIsLoading] = useState(true);

    const fetchConsignments = async (pageNumber: number, status?: ConsignmentStatus) => {
        try {
            let res;
            setIsLoading(true);
            if (status) {
                res = await fetchConsignmentsByStatusService(pageNumber, 10, status);
            } else {
                res = await fetchAllConsignmentsService(pageNumber, 10);
            }
            if (res) {
                console.log(res);

                dispatch(setCurrentPageList(res.data.content)); // Update currentPageList here
                let paging: any = {
                    pageNumber: res.data.number,
                    totalPages: res.data.totalPages
                }
                dispatch(setCurrentPageNumber(paging));
                setIsLoading(false);
            }
        } catch (error) {
            setIsLoading(false)
            console.log(error);
        }
    };

    const handlePageSelect = (pageNumber: number) => {
        
        if(statusFilter === "all"){
            console.log(pageNumber);
            fetchConsignments(pageNumber);
        } else {
            console.log("here");
            fetchConsignments(pageNumber, statusFilter as ConsignmentStatus);
        }
    }

    const handleEditClick = (consignmentId: number) => {
        let consignment = consignmentsList.value.find(consignment => consignment.consignmentId == consignmentId);
        console.log(consignment);
        // return (<EditAcc consignment={consignment!} key={consignment!.consignmentId} hidden={false} />);
        dispatch(setCurrentConsignment(consignment));
        navigate("/admin/consignments/edit");
    }

    const handleCreateClick = () => {
        // let consignment = consignmentsList.value.find(consignment => consignment.consignmentId == consignmentId);
        // console.log(consignment);
        // // return (<EditAcc consignment={consignment!} key={consignment!.consignmentId} hidden={false} />);
        // dispatch(setCurrentConsignment(consignment));
        navigate("/admin/consignments/create");
    }

    const handleDetailClick = (consignmentId: number) => {
        // console.log(consignment);
        // return (<EditAcc consignment={consignment!} key={consignment!.consignmentId} hidden={false} />);
        // dispatch(setCurrentConsignment(consignment));
        // navigate("/admin/consignments/edit");
        navigate(`/admin/consignments/${consignmentId}`);
    }

    const handleFilterClick = (status: ConsignmentStatus[], filter: string) => {
        if (filter !== statusFilter) {
            if(filter === "all"){
                fetchConsignments(0);
            } else {
                fetchConsignments(0, status[0]);
            }
            setStatusFilter(filter);
        }

    }

    const handleEvaluateClick = (consignmentId: number) => {
        navigate(`/admin/consignments/${consignmentId}/sendEvaluation`);
    }
    useEffect(() => { }, [consignmentsList]);

    useEffect(() => {
        fetchConsignments(consignmentsList.currentPageNumber);
        dispatch(setCurrentPageList(consignmentsList.value));
        setStatusFilter("all");
    }, []);

    const handleTakeClick = (consignmentId: number) => {
        takeConsignment(consignmentId.toString()).then((res) => {
            console.log(res);
            fetchConsignments();
        });
    }
    return (
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Tabs defaultValue="all">
                <div className="flex items-center">
                    <TabsList>
                        {/* {JSON.parse(getCookie('user').role) } */}
                        <TabsTrigger onClick={() => handleFilterClick([ConsignmentStatus.FINISHED, ConsignmentStatus.IN_FINAL_EVALUATION, ConsignmentStatus.IN_INITIAL_EVALUATION, ConsignmentStatus.SENDING, ConsignmentStatus.WAITING_STAFF, ConsignmentStatus.TERMINATED], "all")} value="all">All</TabsTrigger>
                        <TabsTrigger onClick={() => handleFilterClick([ConsignmentStatus.IN_INITIAL_EVALUATION], "IN_INITIAL_EVALUATION")} value="IN_INITIAL_EVALUATION">initial evaluation</TabsTrigger>
                        <TabsTrigger onClick={() => handleFilterClick([ConsignmentStatus.IN_FINAL_EVALUATION], "IN_FINAL_EVALUATION")} value="IN_FINAL_EVALUATION">final evaluation</TabsTrigger>
                        <TabsTrigger onClick={() => handleFilterClick([ConsignmentStatus.SENDING], "SENDING")} value="SENDING">sending</TabsTrigger>
                        <TabsTrigger onClick={() => handleFilterClick([ConsignmentStatus.WAITING_STAFF], "WAITING_STAFF")} value="WAITING_STAFF">waiting staff</TabsTrigger>
                        <TabsTrigger onClick={() => handleFilterClick([ConsignmentStatus.TERMINATED], "TERMINATED")} value="TERMINATED">inactive</TabsTrigger>
                    </TabsList>
                    <div className="ml-auto flex items-center gap-2">
                        {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filter
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>
                  Active
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
                        {/* <Button size="sm" variant="outline" className="h-8 gap-1">
                                    <File className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                        Export
                                    </span>
                                </Button> */}
                        <Button size="sm" className="h-8 gap-1" onClick={() => { handleCreateClick() }}>
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Add Consignment
                            </span>
                        </Button>
                    </div>
                </div>
                <TabsContent value={statusFilter}>
                    {isLoading ?
                        <LoadingAnimation />
                        : <Card x-chunk="dashboard-06-chunk-0">
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center">
                                    Consignments
                                    <div className="w-full basis-1/2">
                                        <PagingIndexes pageNumber={consignmentsList.currentPageNumber ? consignmentsList.currentPageNumber : 0} totalPages={consignmentsList.totalPages} pageSelectCallback={handlePageSelect}></PagingIndexes>
                                    </div>
                                </CardTitle>
                                <CardDescription>
                                    Manage consignments and view their details.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Id</TableHead>
                                            <TableHead>preferContact</TableHead>
                                            <TableHead className="md:table-cell">
                                                create Date
                                            </TableHead>
                                            <TableHead className="md:table-cell">
                                                Assigned Staff
                                            </TableHead>
                                            <TableHead className="md:table-cell">
                                                Phone
                                            </TableHead>
                                            <TableHead className="md:table-cell">
                                                Status
                                            </TableHead>
                                            {/* <TableHead className="md:table-cell">
                                                    Created at
                                                </TableHead> */}
                                            <TableHead className="md:table-cell">
                                                Action
                                            </TableHead>
                                            <TableHead>
                                                <span className="sr-only">More Actions</span>
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {consignmentsList.currentPageList.map((consignment) => (
                                            <TableRow key={consignment.consignmentId}>
                                                <TableCell className="font-medium">
                                                    {consignment.consignmentId}
                                                </TableCell>
                                                {/* <TableCell>
                                                    <Badge variant="outline">Draft</Badge>
                                                </TableCell> */}
                                                <TableCell className="md:table-cell">
                                                    {(() => {
                                                        switch (consignment.preferContact) {
                                                            case ConsignmentContactPreference.EMAIL:
                                                                return "Email"
                                                            case ConsignmentContactPreference.PHONE:
                                                                return "Phone"
                                                            case ConsignmentContactPreference.TEXT_MESSAGE:
                                                                return "Text"
                                                            default:
                                                                return "Any of the above"
                                                        }
                                                    })()}
                                                </TableCell>
                                                <TableCell className="md:table-cell">
                                                    {new Date(consignment.createDate).toLocaleDateString('en-US')}
                                                </TableCell>
                                                <TableCell className="md:table-cell">
                                                    {consignment.staff ? consignment.staff.nickname : "Not assigned"}
                                                </TableCell>
                                                <TableCell className="md:table-cell">
                                                    {consignment.staffId}
                                                </TableCell>
                                                <TableCell>
                                                    {(() => {
                                                        switch (consignment.status) {
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
                                                </TableCell>

                                                <TableCell>
                                                    <Button variant="outline" size="sm" onClick={() => { handleDetailClick(consignment.consignmentId) }}>
                                                        Detail
                                                    </Button>
                                                </TableCell>
                                            </TableRow>

                                        ))}
                                    </TableBody>
                                </Table>

                            </CardContent>
                            <CardFooter>
                                {/* <div className="text-xs text-muted-foreground">
                                        Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                                        products
                                    </div> */}
                            </CardFooter>
                        </Card>
                    }
                </TabsContent>
            </Tabs>
            {/* {consignmentsList.value.map((consignment) => (
        <EditAcc consignment={consignment} key={consignment.consignmentId} hidden={true} />
      ))} */}
        </main>
    );
}
