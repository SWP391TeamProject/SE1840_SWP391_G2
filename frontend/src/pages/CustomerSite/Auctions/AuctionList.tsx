import CountDownTime from "@/components/countdownTimer/CountDownTime";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setAuctionSessions, setCurrentAuctionSession, setCurrentPageNumber } from "@/redux/reducers/AuctionSession";
import { fetchActiveAuctionSessions, fetchAllAuctionSessions } from "@/services/AuctionSessionService";
import { useQuery } from "@tanstack/react-query";
import  { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AuctionList() {
  const auctionSessionList = useAppSelector((state) => state.auctionSessions);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const date = new Date();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['auctions'],
    queryFn: () => fetchActiveAuctionSessions(auctionSessionList.currentPageNumber, 10),
  });

  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const handleViewDetailsClick = (id: any) => {
    let session = auctionSessionList.value.find(s => s.auctionSessionId == id);
    if (session) {
      dispatch(setCurrentAuctionSession(session));
    }
  }

  useEffect(() => {
    dispatch(setCurrentPageNumber({currentPageNumber: 0, totalPages: 0}))
  }, [])

  useEffect(() => {

    if (data) {
      console.log('data', data);
      dispatch(setAuctionSessions(data?.data.content));
      dispatch(setCurrentPageNumber({pageNumber: data?.data.number, totalPages: data?.data.totalPages}));
    }
  }, [data]);

  if (isPending) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  // We can assume by this point that `isSuccess === true`
  return (
    <section className="w-full py-12 md:py-2 lg:py-2">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8">
          <div className="grid gap-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">All Auction Sessions</h1>
            <p className="text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Explore our auction sessions and find your next treasure.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {auctionSessionList.value.map((session) => (
              <Card key={session.auctionSessionId}>
                <CardContent className="grid gap-4">
                  <div className="grid gap-2 mt-3">
                    <h3 className="font-semibold text-lg">{session.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 line-clamp-2">{session.title}</p>
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <div className="text-sm font-medium">
                        {session.startDate ? new Date(session.startDate).toLocaleString() : ""}
                        {" "}-{" "}
                        {session.endDate ? new Date(session.endDate).toLocaleString() : ""}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <PackageIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <div className="text-sm font-medium">{session.auctionItems ? session.auctionItems.length : 0} Items</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <div className="text-sm font-medium">
                        {session.endDate ? <CountDownTime end={new Date(session.endDate)}></CountDownTime> : <CountDownTime end={date}></CountDownTime>}
                      </div>
                    </div>
                    <Button variant={"default"} asChild>
                      <Link
                        to={`${session.auctionSessionId}`}
                        onClick={() => { handleViewDetailsClick(session.auctionSessionId) }}
                      >
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function CalendarIcon(props: any) {
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
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  )
}

function PackageIcon(props: any) {
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
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  )
}

function ClockIcon(props: any) {
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
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}