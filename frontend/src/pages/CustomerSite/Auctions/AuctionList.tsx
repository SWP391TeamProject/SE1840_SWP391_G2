import CountDownTime from "@/components/countdownTimer/CountDownTime";
import { Card, CardContent } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setAuctionSessions, setCurrentAuctionSession } from "@/redux/reducers/AuctionSession";
import { fetchAllAuctionSessions } from "@/services/AuctionSessionService";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function AuctionList() {
  const auctionSessionList = useAppSelector((state) => state.auctionSessions);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const date = new Date();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['auctions'],
    queryFn: fetchAllAuctionSessions,
  });

  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const handleViewDetailsClick = (id: any) => {
    let session = auctionSessionList.value.find(s => s.auctionSessionId == id);
    if (session){
      dispatch(setCurrentAuctionSession(session));
    }
  }

  useEffect(() => {
    console.log(data?.data.content);
    if(data){
      dispatch(setAuctionSessions(data?.data.content));
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
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8">
          <div className="grid gap-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Upcoming Auction Sessions</h1>
            <p className="text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Explore our upcoming auction sessions and find your next treasure.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {auctionSessionList.value.map((session) => (
              <Card key={session.auctionSessionId}>
                <CardContent className="grid gap-4">
                  <div className="grid gap-2">
                    <h3 className="font-semibold text-lg">{session.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 line-clamp-2">Auction Session description here</p>
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
                    <Link
                      to="details"
                      className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                      onClick={() => {handleViewDetailsClick(session.auctionSessionId)}}
                    >
                      View Details
                    </Link>
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