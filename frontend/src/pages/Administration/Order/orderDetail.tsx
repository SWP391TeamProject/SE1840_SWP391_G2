import LoadingAnimation from '@/components/loadingAnimation/LoadingAnimation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PaymentStatus } from '@/constants/enums'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setCurrentOrder } from '@/redux/reducers/Orders'
import { getOrdersById } from '@/services/OrderService'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export const OrderDetail = () => {
    const order = useAppSelector(state => state.orders.currentOrder)
    const param = useParams();
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        if (!order) {
            setIsLoading(true);
            getOrdersById(parseInt(param.id) || 0).then((res) => {
                console.log(res.data);
                dispatch(setCurrentOrder(res.data));
                setIsLoading(false);
            }).finally(() => {
                setIsLoading(false);
            })
        } else {
            setIsLoading(false);
        }
    })
    return (
        <div>
            {isLoading ? <LoadingAnimation /> :
                <Card className="overflow-hidden max-w-fit m-auto">
                    <CardHeader className="flex flex-row items-start bg-gray-100">
                        <div className="grid gap-0.5">
                            <CardTitle className="group flex items-center gap-2 text-lg">
                                Order #{order?.orderId}
                                <Button
                                    className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                                >
                                    <div className="h-3 w-3" />
                                    <span className="sr-only">Copy Order ID</span>
                                </Button>
                            </CardTitle>
                            <CardDescription>
                                Placed on {new Date(order?.createDate).toLocaleDateString()}
                                <br />
                                Owner ID: #{order?.payment?.accountId}
                            </CardDescription>
                        </div>
                        <div className="ml-auto flex items-center gap-1">
                            {(() => {
                                switch (order?.payment?.status) {
                                    case PaymentStatus.FAILED:
                                        return <Badge variant="default" className="bg-orange-500 w-[150px] text-center flex justify-center items-center">Failed</Badge>;
                                    case PaymentStatus.SUCCESS:
                                        return <Badge variant="default" className="bg-green-500 w-[150px] text-center flex justify-center items-center">Success</Badge>;
                                    case PaymentStatus.PENDING:
                                        return <Badge variant="default" className="bg-blue-500 w-[150px] text-center flex justify-center items-center">Pending</Badge>;
                                    default:
                                        return <Badge variant="destructive">Unknown Status</Badge>;
                                }
                            })()}
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 text-sm">
                        <div className="grid gap-6">
                            <div className="grid gap-3">
                                <div className="font-semibold">Order Summary</div>
                                <ul className="grid gap-3">

                                    <Table>
                                        <TableHeader>
                                            <TableHead>ID</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Price</TableHead>
                                        </TableHeader>
                                        <TableBody>
                                            {order?.auctionItemDTOS?.map((item) => (
                                                <TableRow key={item.id.itemId}>
                                                    <TableCell>{item.id.itemId}</TableCell>
                                                    <TableCell>{item.itemDTO?.name}</TableCell>
                                                    <TableCell>{item.currentPrice}</TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow>
                                                <TableCell >Total</TableCell>
                                                <TableCell></TableCell>
                                                <TableCell className='font-semibold'>{order?.payment?.paymentAmount}</TableCell>
                                            </TableRow>
                                        </TableBody>

                                    </Table>
                                </ul>
                            </div>
                            <Separator className="my-4" />
                            <div className="grid gap-3">
                                <div className="font-semibold">Shipping Address</div>
                                <address className="grid gap-0.5 not-italic text-muted-foreground">
                                    {order?.shippingAddress}
                                </address>
                            </div>
                        </div>
                    </CardContent>
                </Card>}
        </div>
    )
}
