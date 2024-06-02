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
import { setAuctionSessions, setCurrentAuctionSession, setCurrentPageList } from "@/redux/reducers/AuctionSession";
// import { fetchAuctionSessionsService, deleteAuctionSessionService } from "@/services/AuctionSessionsServices";
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
// import { AuctionSessionStatus } from "@/constants/enums";
import { fetchAllAuctionSessions } from "@/services/AuctionSessionService";

export default function AuctionSessionList() {
  const auctionSessionsList = useAppSelector((state) => state.auctionSessions);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchAuctionSessions = async () => {
    try {
      const list = await fetchAllAuctionSessions();
      if (list) {
        console.log(list?.data.content);
        dispatch(setAuctionSessions(list.data.content));
        dispatch(setCurrentPageList(list.data.content)); // Update currentPageList here

      }

    } catch (error) {
      console.log(error);
    }
  };

  const handleEditClick = (auctionSessionId: number) => {
    let auctionSession = auctionSessionsList.value.find(auctionSession => auctionSession.auctionSessionId == auctionSessionId);
    console.log(auctionSession);
    // return (<EditAcc auctionSession={auctionSession!} key={auctionSession!.auctionSessionId} hidden={false} />);
    dispatch(setCurrentAuctionSession(auctionSession));
    navigate("/admin/auctionSessions/edit");
  }

  const handleCreateClick = () => {
    // let auctionSession = auctionSessionsList.value.find(auctionSession => auctionSession.auctionSessionId == auctionSessionId);
    // console.log(auctionSession);
    // // return (<EditAcc auctionSession={auctionSession!} key={auctionSession!.auctionSessionId} hidden={false} />);
    // dispatch(setCurrentAuctionSession(auctionSession));
    navigate("/admin/auction-sessions/create");
  }

  const handleSuspendClick = (auctionSessionId: number) => {
    // console.log(auctionSession);
    // return (<EditAcc auctionSession={auctionSession!} key={auctionSession!.auctionSessionId} hidden={false} />);
    // dispatch(setCurrentAuctionSession(auctionSession));
    // navigate("/admin/auctionSessions/edit");
    // deleteAuctionSessionService(auctionSessionId.toString()).then((res) => {
    //   console.log(res);
    // })
  }
  const handleDetailClick = (auctionSessionId: number) => {

    let auctionSession = auctionSessionsList.value.find(auctionSession => auctionSession.auctionSessionId == auctionSessionId);
    console.log(auctionSession);
    dispatch(setCurrentAuctionSession(auctionSession));
    navigate("/admin/auctionSessions/detail");
  }


  const handleFilterClick = (filter: string) => {
    let filteredList = [];
    if (filter === "all") filteredList = auctionSessionsList.value;

    if (filter === "upcoming") filteredList = auctionSessionsList.value.filter(x => new Date(x.startDate) > new Date());

    if (filter === "past") filteredList = auctionSessionsList.value.filter(x => new Date(x.endDate) < new Date());

    if (filter === "live") filteredList = auctionSessionsList.value.filter(x => new Date(x.startDate) < new Date() && new Date(x.endDate) > new Date());


    console.log(filteredList);
    dispatch(setCurrentPageList(filteredList));
    setStatusFilter(filter);
  }

  useEffect(() => { }, [auctionSessionsList]);

  useEffect(() => {
    fetchAuctionSessions();
    dispatch(setCurrentPageList(auctionSessionsList.value));
    setStatusFilter("all");
  }, []);

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger onClick={() => handleFilterClick("all")} value="all">All</TabsTrigger>
            <TabsTrigger onClick={() => handleFilterClick("upcoming")} value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger onClick={() => handleFilterClick("past")} value="past">Past</TabsTrigger>
            <TabsTrigger onClick={() => handleFilterClick("live")} value="live">Live</TabsTrigger>
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
                Create Auction Session
              </span>
            </Button>
          </div>
        </div>
        <TabsContent value={statusFilter}>
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>AuctionSessions</CardTitle>
              <CardDescription>
                Manage Auctions and view auctions details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Id</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Start Date
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      End Date
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Participant
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      number of lots
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
                  {auctionSessionsList.currentPageList.map((auctionSession) => (
                    <TableRow key={auctionSession.auctionSessionId}>
                      <TableCell className="font-medium">
                        {auctionSession.auctionSessionId}
                      </TableCell>
                      {/* <TableCell>
                                                    <Badge variant="outline">Draft</Badge>
                                                </TableCell> */}
                      <TableCell className="hidden md:table-cell">
                        {auctionSession.title}

                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {/* {auctionSession.startDate} */}
                        {new Date(auctionSession.startDate).toLocaleDateString("en-US")}

                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(auctionSession.endDate).toLocaleDateString("en-US")}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {/* {auctionSession.role[0]?.roleName} */}
                        {auctionSession.deposits.length}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {auctionSession.auctionsItems}

                        {/* {auctionSession.status == AuctionSessionStatus.ACTIVE ? 
                        {auctionSession.deposits.length}

                        <Badge variant="default" className="bg-green-500">{AuctionSessionStatus[auctionSession.status]}</Badge> : 
                        <Badge variant="destructive">{AuctionSessionStatus[auctionSession.status]}</Badge>} */}
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
                            <DropdownMenuItem onClick={() => { handleDetailClick(auctionSession.auctionSessionId) }}>Detail</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { handleEditClick(auctionSession.auctionSessionId) }}>Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { handleEditClick(auctionSession.auctionSessionId) }}>Manage Live Auctions</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { handleSuspendClick(auctionSession.auctionSessionId) }}>Edit</DropdownMenuItem>
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
      {/* {auctionSessionsList.value.map((auctionSession) => (
        <EditAcc auctionSession={auctionSession} key={auctionSession.auctionSessionId} hidden={true} />
      ))} */}
    </main>
  );
}
