import LoadingAnimation from '@/components/loadingAnimation/LoadingAnimation'
import PagingIndexes from '@/components/pagination/PagingIndexes'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PaymentStatus } from '@/constants/enums'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setCurrentOrder, setCurrentPageList, setCurrentPageNumber } from '@/redux/reducers/Orders'
import { getOrders } from '@/services/OrderService'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export const OrderList = () => {
    const orders = useAppSelector(state => state.orders);
    const [sortBy, setSortBy] = useState("createDate")
    const [sortDirection, setSortDirection] = useState("desc")
    const [filterStatus, setFilterStatus] = useState<PaymentStatus>(null)
    const dispatch = useAppDispatch()
    const nav = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const fetchOrders = (pageNumber: number, pageSize: number, sortBy?: string, sortDirection?: string, filterStatus?: PaymentStatus) => {
        console.log(sortBy, sortDirection, filterStatus);
        setIsLoading(true);
        getOrders(pageNumber, pageSize, sortBy, sortDirection, filterStatus).then((res) => {
            console.log(res);
            dispatch(setCurrentPageList(res.data.content));
            if (res.data.content.length == 0) {
                dispatch(setCurrentPageList([]));
            }
            let paging: any = {
                pageNumber: res.data.number,
                totalPages: res.data.totalPages
            }
            dispatch(setCurrentPageNumber(paging));
            setIsLoading(false);
        }).finally(() => {
            setIsLoading(false);
        })
    }
    useEffect(() => {
        if (orders.currentPageList.length === 0) {
            fetchOrders(0, 10, sortBy, sortDirection, filterStatus);
        }
    }, [])

    const handleFilterStatus = (status: string) => {
        let filter = PaymentStatus[status as keyof typeof PaymentStatus];
        setFilterStatus(filter);
        fetchOrders(0, 10, sortBy, sortDirection, filter);
    }
    const handleViewDetailsClick = (id: any) => {
        let order = orders.currentPageList.find(b => b.orderId == id);
        if (order) {
            dispatch(setCurrentOrder(order));
        }
        nav("/admin/orders/" + id);
    }

    const handleSortBy = (value: string) => {
        setSortBy(value);
        fetchOrders(0, 10, value, sortDirection, filterStatus);
    }
    const handleSortDirection = (value: string) => {
        setSortDirection(value);
        fetchOrders(0, 10, sortBy, value, filterStatus);
    }
    const handlePageSelect = (pageNumber: number) => {
        fetchOrders(pageNumber, 10, sortBy, sortDirection, filterStatus);
    }
    return (
        <main className="grid flex-1 orders-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Tabs defaultValue="all">
                <div className="flex orders-center">
                    <TabsList>
                        <TabsTrigger onClick={() => handleFilterStatus("all")} value="all">All</TabsTrigger>
                        <TabsTrigger onClick={() => handleFilterStatus("PENDING")} value={"PENDING"}>Pending</TabsTrigger>
                        <TabsTrigger onClick={() => handleFilterStatus("SUCCESS")} value={"SUCCESS"}>Success</TabsTrigger>
                        <TabsTrigger onClick={() => handleFilterStatus("FAILED")} value={"FAILED"}>Failed</TabsTrigger>


                    </TabsList>
                </div>
                <TabsContent value={filterStatus || "all"}>

                    {isLoading ? <LoadingAnimation />
                        : <Card x-chunk="dashboard-06-chunk-0">
                            <CardHeader>
                                <CardTitle className="">
                                    Orders
                                    <div className='flex justify-between'>
                                        <div className="flex items-center gap-2 m-2 min-w-48 ">
                                            <label htmlFor="sort-by" className="text-sm font-medium">
                                                Sort by:
                                            </label>
                                            <Select id="sort-by" value={sortBy} onValueChange={(e) => handleSortBy(e)} className="w-40">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="createDate">Date</SelectItem>
                                                    <SelectItem value="payment.paymentAmount">Total</SelectItem>
                                                    <SelectItem value="payment.Status">Status</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Button
                                                variant={sortDirection === "asc" ? "outline" : "default"}
                                                size="icon"
                                                onClick={() => handleSortDirection(sortDirection === "asc" ? "desc" : "asc")}
                                            >
                                                <ArrowUpDownIcon className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="w-full basis-1/2">
                                            <PagingIndexes pageNumber={orders.currentPageNumber ? orders.currentPageNumber : 0} totalPages={orders.totalPages} pageSelectCallback={handlePageSelect}></PagingIndexes>
                                        </div>
                                    </div>


                                </CardTitle>

                                <CardDescription>
                                    Manage orders and view their details.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Order ID</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead>Shipping Address</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead />
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {!orders
                                            ? <LoadingAnimation />
                                            : orders.currentPageList?.map((order) => (
                                                <TableRow key={order.orderId}>
                                                    <TableCell className="font-medium">{order.orderId}</TableCell>
                                                    <TableCell>${order.payment.amount}</TableCell>
                                                    <TableCell>{order.shippingAddress}</TableCell>
                                                    <TableHead>{order.payment.status}</TableHead>
                                                    <TableCell>{new Date(order.createDate).toUTCString()}</TableCell>
                                                    <TableCell>
                                                        <Button variant="outline" size="sm" onClick={() => handleViewDetailsClick(order.orderId)}>
                                                            View Details
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
        </main >
    )
}

function ArrowUpDownIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m21 16-4 4-4-4" />
            <path d="M17 20V4" />
            <path d="m3 8 4-4 4 4" />
            <path d="M7 4v16" />
        </svg>
    )
}
