import PagingIndexes from '@/components/pagination/PagingIndexes'
import {Button} from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {PaymentStatus} from '@/constants/enums'
import {useAppDispatch, useAppSelector} from '@/redux/hooks'
import {
  setCurrentOrder,
  setCurrentPageList,
  setCurrentPageNumber
} from '@/redux/reducers/Orders'
import {getOrdersByUserId} from '@/services/OrderService'
import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useCurrency} from "@/CurrencyProvider";
import CountDownTime from "@/components/countdownTimer/CountDownTime";
import dayjs from "dayjs";

export const UserOrders = () => {
  const orders = useAppSelector(state => state.orders);
  const [sortBy, setSortBy] = useState("payment.createDate");
  const [sortDirection, setSortDirection] = useState("desc");
  const [filterStatus, setFilterStatus] = useState<PaymentStatus>(null);
  const dispatch = useAppDispatch();
  const nav = useNavigate();
  const currency = useCurrency();

  const fetchOrdersByUserId = (pageNumber: number, pageSize: number, sortBy?: string, sortDirection?: string, filterStatus?: PaymentStatus) => {
    getOrdersByUserId(pageNumber, pageSize, sortBy, sortDirection, filterStatus).then((res) => {
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
    nav("/dashboard/order/" + id);
  }

  const handleCheckoutClick = (id: any) => {
    let order = orders.currentPageList.find(b => b.orderId == id);
    if (order) {
      dispatch(setCurrentOrder(order));
    }
    nav("/dashboard/orders/checkout/" + id);
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
      <div className="sm:flex flex-row justify-center gap-5">
        <div
          className="basis-3/12 flex justify-center items-center gap-2 min-w-48">
          <label htmlFor="sort-by"
                 className="text-sm font-medium whitespace-nowrap">
            Sort by:
          </label>
          <Select value={sortBy} onValueChange={(e) => handleSortBy(e)}>
            <SelectTrigger>
              <SelectValue placeholder="Select"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="payment.createDate">Date</SelectItem>
              <SelectItem value="payment.paymentAmount">Total</SelectItem>
              <SelectItem value="payment.status">Status</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant={sortDirection === "asc" ? "outline" : "default"}
            size="icon"
            onClick={() => handleSortDirection(sortDirection === "asc" ? "desc" : "asc")}
          >
            <ArrowUpDownIcon className="h-4 w-4"/>
          </Button>
        </div>

        <div
          className="basis-3/12 flex justify-center items-center gap-2 min-w-48">
          <label htmlFor="filter-status"
                 className="text-sm font-medium whitespace-nowrap">
            Filter by:
          </label>
          <Select value={filterStatus || "all"} onValueChange={(e) => {
            console.log(e);
            handleFilterStatus(e)
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Select"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="SUCCESS">Success</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <PagingIndexes
            pageNumber={orders.currentPageNumber ? orders.currentPageNumber : 0}
            totalPages={orders.totalPages}
            pageSelectCallback={handlePageSelect}
            className="mt-0"></PagingIndexes>
        </div>
      </div>

      <div className="overflow-x-auto mt-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Shipping Address</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead/>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.currentPageList?.map((order) => (
              <TableRow key={order.orderId}>
                <TableCell className="font-medium">{order.orderId}</TableCell>
                <TableCell>{currency.format(order.payment.paymentAmount)}</TableCell>
                <TableCell>{order.shippingAddress}</TableCell>
                <TableCell>{new Date(order.createDate).toUTCString()}</TableCell>
                <TableHead>{
                  order.payment.status === PaymentStatus.SUCCESS ? (
                    <p className="text-green-600 capitalize">{order.shippingStatus.toLowerCase()}</p>
                  ) : (
                    order.payment.status === PaymentStatus.PENDING && dayjs().isBefore(dayjs(order.createDate).add(7, 'days')) ? (
                      <p>
                        Please pay this order within&nbsp;
                        <CountDownTime
                          end={dayjs(order.createDate).add(7, 'days').toDate()}
                          messageOnEnd="0"/>
                      </p>
                    ) : (
                      <p className="text-red-500">Payment is overdue</p>
                    )
                  )
                }</TableHead>
                <TableCell>
                  {
                    order.payment.status === PaymentStatus.SUCCESS ? (
                      <Button variant="outline" size="sm"
                              onClick={() => handleViewDetailsClick(order.orderId)}>
                        View Details
                      </Button>
                    ) : (
                      order.payment.status === PaymentStatus.PENDING && dayjs().isBefore(dayjs(order.createDate).add(7, 'days')) ?
                        <Button variant="default" size="sm"
                                onClick={() => handleCheckoutClick(order.orderId)}>
                          Check out
                        </Button> : <p></p>
                    )
                  }
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
      <path d="m21 16-4 4-4-4"/>
      <path d="M17 20V4"/>
      <path d="m3 8 4-4 4 4"/>
      <path d="M7 4v16"/>
    </svg>
  )
}
