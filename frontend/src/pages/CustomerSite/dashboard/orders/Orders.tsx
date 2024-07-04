import PagingIndexes from '@/components/pagination/PagingIndexes'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PaymentStatus } from '@/constants/enums'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setCurrentOrder, setCurrentPageList, setCurrentPageNumber } from '@/redux/reducers/Orders'
import { getOrdersByUserId } from '@/services/OrderService'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export const Orders = () => {
  const orders = useAppSelector(state => state.orders);
  const [sortBy, setSortBy] = useState("createDate")
  const [sortDirection, setSortDirection] = useState("desc")
  const [filterStatus, setFilterStatus] = useState<PaymentStatus>(null)
  const dispatch = useAppDispatch()
  const nav = useNavigate();

  const fetchOrdersByUserId = (pageNumber: number, pageSize: number, sortBy?: string, sortDirection?: string, filterStatus?: PaymentStatus) => {
    console.log(sortBy, sortDirection, filterStatus);
    getOrdersByUserId(pageNumber, pageSize, sortBy, sortDirection, filterStatus).then((res) => {
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
    })
  }
  useEffect(() => {
    if (orders.currentPageList.length === 0) {
      fetchOrdersByUserId(0, 10, sortBy, sortDirection, filterStatus);
    }
  }, [])

  const handleFilterStatus = (status: string) => {
    let filter = PaymentStatus[status as keyof typeof PaymentStatus];
    setFilterStatus(filter);
    fetchOrdersByUserId(0, 10, sortBy, sortDirection, filter);
  }
  const handleViewDetailsClick = (id: any) => {
    let order = orders.currentPageList.find(b => b.orderId == id);
    if (order) {
      dispatch(setCurrentOrder(order));
    }
    nav("/dashboard/orders/" + id);
  }

  const handleSortBy = (value: string) => {
    setSortBy(value);
    fetchOrdersByUserId(0, 10, value, sortDirection, filterStatus);
  }
  const handleSortDirection = (value: string) => {
    setSortDirection(value);
    fetchOrdersByUserId(0, 10, sortBy, value, filterStatus);
  }
  const handlePageSelect = (pageNumber: number) => {
    fetchOrdersByUserId(pageNumber, 10, sortBy, sortDirection, filterStatus);
  }
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-2xl font-bold mb-6">
        Your Orders
      </h1>
      <div className="sm:flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 m-2 min-w-48">
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
        <div className="flex items-center gap-2 m-2 min-w-48">
          <label htmlFor="filter-status" className="text-sm font-medium">
            Filter by:
          </label>
          <Select id="filter-status" value={filterStatus || "all"} onValueChange={(e) => { console.log(e); handleFilterStatus(e) }} className="w-40">
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="SUCCESS">Success</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className=" flex-1">
          <PagingIndexes pageNumber={orders.currentPageNumber ? orders.currentPageNumber : 0} totalPages={orders.totalPages} pageSelectCallback={handlePageSelect}></PagingIndexes>
        </div>
      </div>
      <div className="overflow-x-auto">
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
            {orders.currentPageList?.map((order) => (
              <TableRow key={order.orderId}>
                <TableCell className="font-medium">{order.orderId}</TableCell>
                <TableCell>${order.payment.amount}</TableCell>
                <TableCell>{order.shipAddress}</TableCell>
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
      </div>
    </div>
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
