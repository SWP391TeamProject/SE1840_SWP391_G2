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
import React, { Suspense, useEffect, useState } from "react";
// import { AuctionSessionStatus } from "@/constants/enums";
import { DataTableSkeleton } from "@/components/data-tables/data-tables-skeleton";
import { getAuctions } from "@/services/AuctionSessionService";
import AcutionSessionsTable from "./auction-session-data-table/auction-session-table";

export default function AuctionSessionList() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const url = new URL(window.location.href);
  let search = url.searchParams.get("search");
  let pageNumber = url.searchParams.get("page");
  let pageSize = url.searchParams.get("per_page");
  let sort = url.searchParams.get("sort");
  const auctionStates = ["Upcoming", "Past", "Active"];
  const [auctionSessionPromise, setAuctionSessionPromise] = useState<Promise<any>>();
//TODO: fix this rendering state
  const handleFilterClick = (filter: string) => {
    url.searchParams.delete("search");
    window.history.replaceState(null, "", url.toString());
    search = null;
    if (filter !== statusFilter) {
      if (filter === "All") {
        setAuctionSessionPromise(getAuctions({ page: Number.parseInt(pageNumber), size: Number.parseInt(pageSize), status: "" }));
        setStatusFilter("");
      } else {
        setAuctionSessionPromise(getAuctions({ page: Number.parseInt(pageNumber), size: Number.parseInt(pageSize), status: filter }));
        setStatusFilter(filter);
      }
    }
  }
  React.useEffect(() => {
    if (Number.parseInt(pageNumber) > 0)
      getAuctions({ page: Number.parseInt(pageNumber), size: Number.parseInt(pageSize), sort: sort, status: statusFilter }).then((res) => {
        setAuctionSessionPromise(Promise.resolve(res));
      });
  }, [pageSize, pageNumber, sort])
  useEffect(() => {
    console.log('hello')
  }, [pageSize, pageNumber, sort]);

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Tabs defaultValue="All">

        <TabsContent value="All">

          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                AuctionSessions

              </CardTitle>

              <CardDescription>
                Manage Auctions and view auctions details.
              </CardDescription>
            </CardHeader>
            <CardContent>
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
