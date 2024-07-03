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

import { AccountStatus, PaymentType } from "@/constants/enums";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import PagingIndexes from "@/components/pagination/PagingIndexes";
import LoadingAnimation from "@/components/loadingAnimation/LoadingAnimation";
import { useNavigate } from "react-router-dom";
import { fetchPaymentssService } from "@/services/PaymentsService";
import { setCurrentPageList, setCurrentPageNumber, setCurrentPayment } from "@/redux/reducers/Payments";
import { Payment } from "@/models/payment";
import { useCurrency } from "@/CurrencyProvider";

export default function PaymentsList() {
    const paymentsList: any = useAppSelector((state) => state.payments);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [typeFilter, setRoleFilter] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const url = new URL(window.location.href);
    const currency = useCurrency();
    let search = url.searchParams.get("search");
    const [reload, setReload] = useState(false);

    const fetchPayments = async (pageNumber: number, type?: PaymentType) => {
        try {
            setIsLoading(true);
            console.log(type);
            let res;
            if (search && search?.length > 0) {
                res = await fetchPaymentssService(pageNumber, 5,type);
            }
            else if (type != undefined) {
                res = await fetchPaymentssService(pageNumber, 5,type);
            }
            else {
                res = await fetchPaymentssService(pageNumber, 5,type);
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
            setIsLoading(false);
            console.log(error);
        }
    };



    const handleEditClick = (accountId: number) => {
        let payment = paymentsList.currentPageList.find(payment => payment.accountId == accountId);
        // return (<EditAcc payment={payment!} key={payment!.accountId} hidden={false} />);
        dispatch(setCurrentPayment(payment));
        navigate(`/admin/payments/${accountId}`);
    }

    const handleCreateClick = () => {
        // let payment = paymentsList.value.find(payment => payment.accountId == accountId);
        // // return (<EditAcc payment={payment!} key={payment!.accountId} hidden={false} />);
        // dispatch(setCurrentAccount(payment));
        navigate("/admin/payments/create");
    }

    //   const handleSuspendClick = (accountId: number) => {
    //     // return (<EditAcc payment={payment!} key={payment!.accountId} hidden={false} />);
    //     // dispatch(setCurrentAccount(payment));
    //     // navigate("/admin/payments/edit");
    //     deleteAccountService(accountId.toString()).then((res) => {
    //       console.log(res);
    //     })
    //     setReload(!reload);
    //   }

    //   const handleActiveClick = (accountId: number) => {
    //     // return (<EditAcc payment={payment!} key={payment!.accountId} hidden={false} />);
    //     // dispatch(setCurrentAccount(payment));
    //     // navigate("/admin/payments/edit");
    //     activateAccountService(accountId.toString()).then((res) => {
    //       console.log(res);
    //     })
    //     setReload(!reload);
    //   }

    const handleFilterClick = (types: PaymentType[], filter: string) => {
        // let filteredList = paymentsList.value.filter(x => status.includes(x.status));
        // dispatch(setCurrentPageList(filteredList));
        // if (filter != typeFilter) {
        url.searchParams.delete("search");
        window.history.replaceState(null, "", url.toString());
        search = null;
        if (filter == "all") {
            fetchPayments(0);
            setRoleFilter(filter);
            paymentsList.filter = undefined;
        }
        else {
            console.log(types);
            fetchPayments(0, types[0]);
            setRoleFilter(filter);
            paymentsList.filter = types[0];
        }

        // }
    }

    useEffect(() => { }, [paymentsList.currentPageList]);

    const handlePageSelect = (pageNumber: number) => {
        fetchPayments(pageNumber, paymentsList.filter);
    }

    useEffect(() => {
        fetchPayments(paymentsList.currentPageNumber);
        // data.then((data) => {
        //   dispatch(setCurrentPageList(data.content));
        // })
        setRoleFilter("all");

    }, []);
    useEffect(() => {
        fetchPayments(paymentsList.currentPageNumber);
        setRoleFilter("all");

    }, [reload]);

    return (
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Tabs defaultValue="all">
                <div className="flex items-center">
                    <TabsList>
                        <TabsTrigger onClick={() => handleFilterClick([], "all")} value="all">All</TabsTrigger>
                        <TabsTrigger onClick={() => handleFilterClick([PaymentType.AUCTION_BID], "AUCTION_BID")} value="AUCTION_BID">AUCTION_BID</TabsTrigger>
                        <TabsTrigger onClick={() => handleFilterClick([PaymentType.AUCTION_DEPOSIT], "AUCTION_DEPOSIT")} value="AUCTION_DEPOSIT">AUCTION_DEPOSIT</TabsTrigger>
                        <TabsTrigger onClick={() => handleFilterClick([PaymentType.AUCTION_DEPOSIT_REFUND], "AUCTION_DEPOSIT_REFUND")} value="AUCTION_DEPOSIT_REFUND">AUCTION_DEPOSIT_REFUND</TabsTrigger>
                        <TabsTrigger onClick={() => handleFilterClick([PaymentType.AUCTION_ORDER], "AUCTION_ORDER")} value="AUCTION_ORDER">AUCTION_ORDER</TabsTrigger>
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
                                Add payment
                            </span>
                        </Button>
                    </div>
                </div>
                <TabsContent value={typeFilter}>
                    {isLoading ?
                        <LoadingAnimation />
                        : <Card x-chunk="dashboard-06-chunk-0">
                            <CardHeader >

                                <CardTitle className="flex justify-between items-center">
                                    Payments
                                    <div className="w-full basis-1/2">
                                        <PagingIndexes className="basis-1/2" pageNumber={paymentsList.currentPageNumber ? paymentsList.currentPageNumber : 0} size={10} totalPages={paymentsList.totalPages} pageSelectCallback={handlePageSelect}></PagingIndexes>
                                    </div>
                                </CardTitle>
                                <CardDescription>
                                    Manage payments and view details.
                                </CardDescription>

                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Id</TableHead>
                                            <TableHead>Create Date</TableHead>
                                            <TableHead className="md:table-cell">
                                                Type
                                            </TableHead>
                                            <TableHead className="md:table-cell">
                                                Status
                                            </TableHead>
                                            <TableHead className="md:table-cell">
                                                Amount
                                            </TableHead>

                                            <TableHead>
                                                <span className="sr-only">Actions</span>
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paymentsList.currentPageList.map((payment: Payment) => (
                                            <TableRow key={payment.accountId}>
                                                <TableCell className="font-medium">
                                                    {payment.id}
                                                </TableCell>
                                                {/* <TableCell>
                                                    <Badge variant="outline">Draft</Badge>
                                                </TableCell> */}
                                                <TableCell className=" md:table-cell">
                                                    <div className="flex items-center ">
                                                        {payment.date}
                                                    </div>

                                                </TableCell>
                                                <TableCell className=" md:table-cell">
                                                    {payment.type}
                                                </TableCell>
                                                <TableCell className=" md:table-cell">
                                                    {payment.status}
                                                </TableCell>
                                                <TableCell className=" md:table-cell">
                                                    {currency.format({
                                                        amount: payment.amount,
                                                    })}
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
                                                            <DropdownMenuItem onClick={() => { handleEditClick(payment.accountId) }}>Edit</DropdownMenuItem>
                                                            {/* {
                                                                payment.status == AccountStatus.ACTIVE ?
                                                                    <DropdownMenuItem onClick={() => { handleSuspendClick(payment.accountId) }}>Suspend</DropdownMenuItem> :
                                                                    <DropdownMenuItem onClick={() => { handleActiveClick(payment.accountId) }}>Activate</DropdownMenuItem>
                                                            } */}

                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
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
                        </Card>}

                </TabsContent>
            </Tabs>
            {/* {paymentsList.value.map((payment) => (
        <EditAcc payment={payment} key={payment.accountId} hidden={true} />
      ))} */}
        </main>
    );
}
