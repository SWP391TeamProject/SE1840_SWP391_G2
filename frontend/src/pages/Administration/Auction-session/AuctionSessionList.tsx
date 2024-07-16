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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent } from "@/components/ui/tabs";
// import { fetchAuctionSessionsService, deleteAuctionSessionService } from "@/services/AuctionSessionsServices";
import {
  ListFilter
} from "lucide-react";
import { Suspense, useEffect, useState } from "react";
// import { AuctionSessionStatus } from "@/constants/enums";
import { DataTableSkeleton } from "@/components/data-tables/data-tables-skeleton";
import { getAuctions } from "@/services/AuctionSessionService";
import { AcutionSessionsTable } from "./auction-session-data-table/auction-session-table";

export default function AuctionSessionList() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const url = new URL(window.location.href);
  let search = url.searchParams.get("search");
  let pageNumber = url.searchParams.get("page");
  let pageSize = url.searchParams.get("per_page");
  const auctionStates = ["Upcoming", "Past", "Active"];
  const [auctionSessionPromise, setAuctionSessionPromise] = useState<Promise<any>>();

  // const auctionSessionPromise = getAuctions({ page: Number.parseInt(pageNumber), size: Number.parseInt(pageSize), status: statusFilter});

  // const fetchAuctionSessions = async (pageNumber: number, filter?: string) => {
  //   try {
  //     let res;
  //     setIsLoading(true);
  //     if (search && search?.length > 0) {
  //       res = await fetchAuctionSessionByTitle(pageNumber, 10, search);
  //     } else {
  //       switch (filter) {
  //         case "upcoming":
  //           res = await fetchUpcomingAuctionSessions(pageNumber, 10);
  //           break;
  //         case "past":
  //           res = await fetchPastAuctionSessions(pageNumber, 10);
  //           break;
  //         case "live":
  //           res = await fetchActiveAuctionSessions(pageNumber, 10);
  //           break;
  //         default:
  //           res = await fetchAllAuctionSessions(pageNumber, 10);
  //       }
  //     }

  //     if (res) {
  //       console.log(res?.data.content);
  //       // dispatch(setAuctionSessions(list.data.content));
  //       dispatch(setCurrentPageList(res.data.content)); // Update currentPageList here
  //       let paging: any = {
  //         pageNumber: res.data.number,
  //         totalPages: res.data.totalPages
  //       }
  //       dispatch(setCurrentPageNumber(paging));
  //       setIsLoading(false);
  //     }

  //   } catch (error) {
  //     console.log(error);
  //     setIsLoading(false);
  //   }
  // };

  // const handleAssignAuctionItemClick = (auctionSessionId: number) => {
  //   let auctionSession = auctionSessionsList.value.find(auctionSession => auctionSession.auctionSessionId == auctionSessionId);
  //   console.log(auctionSession);
    // return (<EditAcc auctionSession={auctionSession!} key={auctionSession!.auctionSessionId} hidden={false} />);
  //   dispatch(setCurrentAuctionSession(auctionSession));
  //   navigate(`/admin/auction-sessions/${auctionSessionId}/assign-items`);
  // }

  // const handleEditClick = (auctionSessionId: number) => {
  //   let auctionSession = auctionSessionsList.value.find(auctionSession => auctionSession.auctionSessionId == auctionSessionId);
  //   console.log(auctionSession);
    // return (<EditAcc auctionSession={auctionSession!} key={auctionSession!.auctionSessionId} hidden={false} />);
  //   dispatch(setCurrentAuctionSession(auctionSession));
  //   navigate("/admin/auctionSessions/edit");
  // }

  // const handleCreateClick = () => {
    // let auctionSession = auctionSessionsList.value.find(auctionSession => auctionSession.auctionSessionId == auctionSessionId);
    // console.log(auctionSession);
    // // return (<EditAcc auctionSession={auctionSession!} key={auctionSession!.auctionSessionId} hidden={false} />);
    // dispatch(setCurrentAuctionSession(auctionSession));
  //   navigate("/admin/auction-sessions/create");
  // }

  // const handleSuspendClick = (auctionSessionId: number) => {
    // console.log(auctionSession);
    // return (<EditAcc auctionSession={auctionSession!} key={auctionSession!.auctionSessionId} hidden={false} />);
    // dispatch(setCurrentAuctionSession(auctionSession));
    // navigate("/admin/auctionSessions/edit");
    // deleteAuctionSessionService(auctionSessionId.toString()).then((res) => {
    //   console.log(res);
    // })
  // }
  // const handleDetailClick = (auctionSessionId: number) => {
  //   console.log(auctionSessionId);

  //   let auctionSession = auctionSessionsList.value.find(auctionSession => auctionSession.auctionSessionId === auctionSessionId);
  //   console.log(auctionSession);
  //   dispatch(setCurrentAuctionSession(auctionSession));
  //   navigate(`/admin/auction-sessions/${auctionSessionId}`);
  // }

  // const handlePageSelect = (pageNumber: number) => {
  //   fetchAuctionSessions(pageNumber, statusFilter);
  // }

  // const handleFilterClick = (filter: string) => {

  //   url.searchParams.delete("search");
  //   window.history.replaceState(null, "", url.toString());
  //   search = null;

  //   if (filter !== statusFilter){
  //     fetchAuctionSessions(0, filter);
  //     setStatusFilter(filter);
  //   }
    
  // }

  const handleFilterClick = (filter: string) => {

    url.searchParams.delete("search");
    window.history.replaceState(null, "", url.toString());
    search = null;

    if (filter !== statusFilter){
      // console.log(location)
      // navigate(
      //   `${location.pathname}?page=${0}&per_page=${pageSize}` // This is somewhat equivalent to { scroll: false } in Next.js, but for navigation behavior. Adjust as needed.
      // );
      // fetchAuctionSessions(0, filter);
      // console.log(filter);
      // console.log(statusFilter);
      // switch (filter) {
      //   case "Upcoming":
      //     auctionSessionPromise = fetchUpcomingAuctionSessions(Number.parseInt(pageNumber), Number.parseInt(pageSize));
      //     break;
      //   case "Past":
      //     auctionSessionPromise = getPastAuction({ page: Number.parseInt(pageNumber), size: Number.parseInt(pageSize)});
      //     break;
      //   case "Acive":
      //     auctionSessionPromise = getActiveAuction({ page: Number.parseInt(pageNumber), size: Number.parseInt(pageSize)});
      //     break;
      //   default:
      //     auctionSessionPromise = getAllAuction({ page: Number.parseInt(pageNumber), size: Number.parseInt(pageSize)});
      //     break;
      // }
      if(filter === "All"){
        setAuctionSessionPromise(getAuctions({ page: Number.parseInt(pageNumber), size: Number.parseInt(pageSize), status: "" }));
        setStatusFilter("");
      } else {
        setAuctionSessionPromise(getAuctions({ page: Number.parseInt(pageNumber), size: Number.parseInt(pageSize), status: filter }));
        setStatusFilter(filter);
      }
    }    
  }

  // useEffect(() => { }, [auctionSessionsList]);

  useEffect(() => {
    if (Number.parseInt(pageNumber) >= 1)
      setAuctionSessionPromise(getAuctions({ page: Number.parseInt(pageNumber), size: Number.parseInt(pageSize), status: statusFilter }));
  }, [pageSize, pageNumber])

  useEffect(() => {
    // fetchAuctionSessions(0);
    // setStatusFilter("all");
  }, []);

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Tabs defaultValue="All">
        {/* <div className="flex items-center">
          <TabsList>
            <TabsTrigger onClick={() => handleFilterClick("all")} value="all">All</TabsTrigger>
            <TabsTrigger onClick={() => handleFilterClick("upcoming")} value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger onClick={() => handleFilterClick("past")} value="past">Past</TabsTrigger>
            <TabsTrigger onClick={() => handleFilterClick("live")} value="live">Live</TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2"> */}
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
            {/* <Button size="sm" className="h-8 gap-1" onClick={() => { handleCreateClick() }}>
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Create Auction Session
              </span>
            </Button>
          </div>
        </div> */}
        <TabsContent value="All">
          {/* {isLoading
            ? <LoadingAnimation />
            :  */}
            <Card x-chunk="dashboard-06-chunk-0">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  AuctionSessions
                  {/* <div className="w-full basis-1/2">
                    <PagingIndexes pageNumber={auctionSessionsList.currentPageNumber ? auctionSessionsList.currentPageNumber : 0} totalPages={auctionSessionsList.totalPages} pageSelectCallback={handlePageSelect}></PagingIndexes>
                  </div> */}
                </CardTitle>

                <CardDescription>
                  Manage Auctions and view auctions details.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Id</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead className="md:table-cell">
                        Start Date
                      </TableHead>
                      <TableHead className="md:table-cell">
                        End Date
                      </TableHead>
                      <TableHead className="md:table-cell text-center">
                        Participant
                      </TableHead>
                      <TableHead className="md:table-cell text-center">
                        number of lots
                      </TableHead> */}
                      {/* <TableHead className=" md:table-cell">
                                                    Created at
                                                </TableHead> */}
                      {/* <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody> */}
                    {/* {auctionSessionsList.currentPageList.map((auctionSession) => (
                      <TableRow key={auctionSession.auctionSessionId}>
                        <TableCell className="font-medium">
                          {auctionSession.auctionSessionId}
                        </TableCell> */}
                        {/* <TableCell>
                                                    <Badge variant="outline">Draft</Badge>
                                                </TableCell> */}
                        {/* <TableCell className="md:table-cell">
                          {auctionSession.title}

                        </TableCell>
                        <TableCell className="md:table-cell"> */}
                          {/* {auctionSession.startDate} */}
                          {/* {new Date(auctionSession.startDate).toLocaleDateString("en-US")}

                        </TableCell>
                        <TableCell className="md:table-cell">
                          {new Date(auctionSession.endDate).toLocaleDateString("en-US")}
                        </TableCell>
                        <TableCell className="md:table-cell text-center"> */}
                          {/* {auctionSession.role[0]?.roleName} */}
                          {/* {auctionSession.deposits?.length}

                        </TableCell>
                        <TableCell className="md:table-cell text-center">
                          {auctionSession.auctionItems?.length} */}

                          {/* {auctionSession.status == AuctionSessionStatus.ACTIVE ? 
                        {auctionSession.deposits.length}

                        <Badge variant="default" className="bg-green-500">{AuctionSessionStatus[auctionSession.status]}</Badge> : 
                        <Badge variant="destructive">{AuctionSessionStatus[auctionSession.status]}</Badge>} */}
                        {/* </TableCell>
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
                              <DropdownMenuItem onClick={() => { handleDetailClick(auctionSession?.auctionSessionId) }}>Detail</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { handleAssignAuctionItemClick(auctionSession?.auctionSessionId) }}>Assign Items</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>

                    ))}
                  </TableBody>
                </Table> */}
              <Suspense
                  fallback={
                    <DataTableSkeleton
                      columnCount={5}
                      searchableColumnCount={1}
                      filterableColumnCount={2}
                      cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
                      shrinkZero
                    />
                  }
                >
                  {/**
           * Passing promises and consuming them using React.use for triggering the suspense fallback.
           * @see https://react.dev/reference/react/use
           */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 gap-1">
                        <ListFilter className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                          Status
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuLabel>Status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem className='w-9/12' checked={statusFilter == ''} onClick={() => handleFilterClick('')}>
                        All
                      </DropdownMenuCheckboxItem>

                      {auctionStates.map((state) => (
                        <div className="flex m-1 items-center justify-between" key={state} >
                          <DropdownMenuCheckboxItem className='w-9/12' checked={statusFilter == state} onClick={() => handleFilterClick(state)} >{state}</DropdownMenuCheckboxItem>
                        </div>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <AcutionSessionsTable acutionSessionPromise={auctionSessionPromise} />
                </Suspense>
              </CardContent>
              <CardFooter>
                {/* <div className="text-xs text-muted-foreground">
                                        Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                                        products
                                    </div> */}
              </CardFooter>
            </Card>
          {/* } */}
        </TabsContent>
      </Tabs>
      {/* {auctionSessionsList.value.map((auctionSession) => (
        <EditAcc auctionSession={auctionSession} key={auctionSession.auctionSessionId} hidden={true} />
      ))} */}
    </main>
  );
}
