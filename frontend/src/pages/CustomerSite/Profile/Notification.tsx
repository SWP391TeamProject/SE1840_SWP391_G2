import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {
    setCurrentPageList,
    setCurrentPageNumber,
    setNotifications
} from "@/redux/reducers/Notifications";
import {
    getNotifications,
    markNotificationRead
} from "@/services/NotificationService";
import {useEffect} from "react";
import {MoreHorizontal} from "lucide-react";
import {
    decreaseUnreadNotificationCount
} from "@/redux/reducers/UnreadNotificationCountReducer.ts";
import PagingIndexes from "@/components/pagination/PagingIndexes";

export default function NotificationsList() {
    const notificationsList = useAppSelector((state) => state.notifications);
    const dispatch = useAppDispatch();

    const fetchAllNotifications = async (page = 0, size = 50) => {
        try {
            const list = await getNotifications(page, size);
            if (list) {
                dispatch(setNotifications(list.data));
                dispatch(setCurrentPageList(list.data.content));
                // let paging: any = {
                //     pageNumber: list.data.number,
                //     totalPages: list.data.totalPages
                // }
                // dispatch(setCurrentPageNumber(paging));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleMarkReadClick = async (notificationId: number) => {
        try {
            await markNotificationRead(notificationId);
            fetchAllNotifications(notificationsList.currentPageNumber, notificationsList.pageSize).then(() => {
                dispatch(decreaseUnreadNotificationCount());
            });
        } catch (error) {
            console.log(error);
        }
    }

    const handlePageSelect = (pageNumber: number) => {
        fetchAllNotifications(pageNumber);
    }

    useEffect(() => {
        fetchAllNotifications();
    }, []);

    return (
        <main
            className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Tabs defaultValue="all">
                <div className="flex items-center">
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent value="all">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notifications</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Message</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>
                                            <span
                                                className="sr-only">Actions</span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {notificationsList.currentPageList.map((notification) => (
                                        <TableRow
                                            key={notification.notificationId}>
                                            <TableCell><div dangerouslySetInnerHTML={{__html:`${notification.message}`}}/></TableCell>
                                            <TableCell>
                                                {notification.read ?
                                                    <Badge variant="default"
                                                           className="bg-green-500">Read</Badge> :
                                                    <Badge
                                                        variant="destructive">Unread</Badge>}
                                            </TableCell>
                                            <TableCell>
                                                {!notification.read ?
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild>
                                                            <Button
                                                                aria-haspopup="true"
                                                                size="icon"
                                                                variant="ghost">
                                                                <MoreHorizontal
                                                                    className="h-4 w-4"/>
                                                                <span
                                                                    className="sr-only">Toggle menu</span>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent
                                                            align="end">
                                                            <DropdownMenuItem
                                                                onClick={() => {
                                                                    handleMarkReadClick(notification.notificationId)
                                                                }}
                                                                className="cursor-pointer">Mark
                                                                as
                                                                Read</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu> : null}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="flex justify-center mt-6">
                                <PagingIndexes pageNumber={notificationsList.currentPageNumber ? notificationsList.currentPageNumber : 0} totalPages={notificationsList.totalPages} pageSelectCallback={handlePageSelect}></PagingIndexes>
                            </div>
                        </CardContent>
                        <CardFooter></CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </main>
    );
}
