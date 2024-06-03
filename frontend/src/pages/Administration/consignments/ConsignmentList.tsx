import { Badge } from "@/components/ui/badge";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { PaginationPrevious, PaginationItem, PaginationLink, PaginationEllipsis, PaginationNext, PaginationContent, Pagination } from "@/components/ui/pagination";
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
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import {
    Home,
    LineChart,
    ListFilter,
    Package,
    Package2,
    PanelLeft,
    Search,
    Settings,
    ShoppingCart,
    Users2,
    File,
    PlusCircle,
    MoreHorizontal,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EditAcc } from "../popup/EditAcc";
import { useLocation, useNavigate } from "react-router-dom";
import { ConsignmentStatus } from "@/constants/enums";
import { deleteConsignmentService, fetchAllConsignmentsService } from "@/services/ConsignmentService";
import { setConsignments, setCurrentConsignment, setCurrentPageList } from "@/redux/reducers/Consignments";

export default function ConsignmentList() {
    const consignmentsList = useAppSelector((state) => state.consignments);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [statusFilter, setStatusFilter] = useState("all");

    const fetchConsignments = async () => {
        try {
            const list = await fetchAllConsignmentsService();

            if (list) {
                console.log(list);

                dispatch(setConsignments(list.data.content));
                dispatch(setCurrentPageList(list.data.content)); // Update currentPageList here
            }
        } catch (error) {
            console.log(error);
        }
    };

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
        let filteredList = consignmentsList.value.filter(x => status.includes(x.status));
        console.log(filteredList);
        dispatch(setCurrentPageList(filteredList));
        setStatusFilter(filter);
    }

    useEffect(() => { }, [consignmentsList]);

    useEffect(() => {
        fetchConsignments();
        dispatch(setCurrentPageList(consignmentsList.value));
        setStatusFilter("all");
    }, []);

    return (
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Tabs defaultValue="all">
                <div className="flex items-center">
                    <TabsList>
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
                    <Card x-chunk="dashboard-06-chunk-0">
                        <CardHeader>
                            <CardTitle>Consignments</CardTitle>
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
                                        <TableHead className="hidden md:table-cell">
                                            create Date
                                        </TableHead>
                                        <TableHead className="hidden md:table-cell">
                                            Assigned Staff
                                        </TableHead>
                                        <TableHead className="hidden md:table-cell">
                                            Phone
                                        </TableHead>
                                        <TableHead className="hidden md:table-cell">
                                            Status
                                        </TableHead>
                                        <TableHead className="hidden md:table-cell">
                                            Status
                                        </TableHead>
                                        {/* <TableHead className="hidden md:table-cell">
                                                    Created at
                                                </TableHead> */}
                                        <TableHead>
                                            <span className="sr-only">Actions</span>
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
                                            <TableCell className="hidden md:table-cell">
                                                {consignment.preferContact}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {new Date(consignment.createDate).toLocaleDateString('en-US')}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {consignment.staff ? consignment.staff.nickname : "Not assigned"}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {consignment.staffId}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {consignment.status == ConsignmentStatus.IN_INITIAL_EVALUATION ?
                                                    <Badge variant="default" className="bg-green-500">{ConsignmentStatus[consignment.status]}</Badge> :
                                                    <Badge variant="destructive">{ConsignmentStatus[consignment.status]}</Badge>}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            aria-haspopup="true"
                                                            size="icon"
                                                            variant="ghost"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Toggle menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => { handleEditClick(consignment.consignmentId) }}>Edit</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => { handleDetailClick(consignment.consignmentId) }}>Detail</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>

                                    ))}
                                </TableBody>
                            </Table>
                            {/* <div className="flex justify-center mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>
                        2
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">10</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div> */}
                        </CardContent>
                        <CardFooter>
                            {/* <div className="text-xs text-muted-foreground">
                                        Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                                        products
                                    </div> */}
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
            {/* {consignmentsList.value.map((consignment) => (
        <EditAcc consignment={consignment} key={consignment.consignmentId} hidden={true} />
      ))} */}
        </main>
    );
}
