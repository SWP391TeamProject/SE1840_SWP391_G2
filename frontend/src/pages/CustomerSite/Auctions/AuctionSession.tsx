import React, { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import CountDownTime from '@/components/countdownTimer/CountDownTime'

export default function AuctionSession() {
    const auctionSession = useAppSelector(state => state.auctionSessions.currentAuctionSession);
    const dispatch = useAppDispatch();

    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    useEffect(() => {
        console.log(auctionSession);
    },[auctionSession])

    return (
        <div className="flex flex-col min-h-screen">
            <section className="bg-gray-100 py-12 md:py-20 dark:bg-gray-800">
                <div className="container px-4 md:px-6">
                    <div className="grid gap-8 md:grid-cols-2 md:items-center">
                        <div className="space-y-4">
                            <div className="inline-block rounded-lg bg-primary-500 px-3 py-1 text-sm text-primary-50">
                                Live Auction
                            </div>
                            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{auctionSession?.title}</h1>
                            <p className="text-gray-500 md:text-xl dark:text-gray-400">
                                Don't miss your chance to bid on high-quality furniture pieces from top designers.
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 rounded-md bg-gray-200 px-4 py-2 text-sm font-medium dark:bg-gray-700">
                                    <ClockIcon className="h-5 w-5" />
                                    <span>Ends in {auctionSession?.endDate ? <CountDownTime end={new Date(auctionSession.endDate)}></CountDownTime> : <CountDownTime end={new Date()}></CountDownTime>}</span>
                                </div>
                                <Button>Place Bid</Button>
                            </div>
                        </div>
                        <img
                            src="/placeholder.svg"
                            width={600}
                            height={400}
                            alt="Auction Hero"
                            className="mx-auto rounded-lg object-cover"
                        />
                    </div>
                </div>
            </section>
            <main className="container px-4 py-12 md:px-6 md:py-20">
                <div className="grid gap-12 md:grid-cols-[1fr_300px]">
                    <div>
                        <h2 className="mb-8 text-2xl font-bold">Auction Items</h2>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {auctionSession?.auctionItems ? auctionSession.auctionItems.map((item) => (
                                <Card>
                                <img
                                    src="/placeholder.svg"
                                    width={300}
                                    height={200}
                                    alt="Auction Item"
                                    className="rounded-t-lg object-cover"
                                />
                                <CardContent className="space-y-2 p-4">
                                    <h3 className="text-lg font-semibold">{item.itemDTO.name}</h3>
                                    <div className="flex items-center justify-between">
                                        <div className="text-primary-500 font-medium">{currencyFormatter.format(item.itemDTO.reservePrice)}</div>
                                        {/* <div className="text-sm text-gray-500 dark:text-gray-400">1h 23m</div> */}
                                    </div>
                                </CardContent>
                                </Card>
                            )) : "No Item"}
                        </div>
                    </div>
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Auction Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-gray-500 dark:text-gray-400">Start Time</div>
                                    <div>{auctionSession?.startDate ? new Date(auctionSession.startDate).toLocaleString() : ""}</div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="text-gray-500 dark:text-gray-400">End Time</div>
                                    <div>{auctionSession?.endDate ? new Date(auctionSession.endDate).toLocaleString() : ""}</div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="text-gray-500 dark:text-gray-400">Number of Items</div>
                                    <div>{auctionSession?.auctionItems?.length}</div>
                                </div>
                                {/* <Link
                                    to="#"
                                    className="flex items-center justify-between text-primary-500 hover:underline"
                                >
                                    <div>Auction Organizer</div>
                                    <ArrowRightIcon className="h-5 w-5" />
                                </Link> */}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>About the Auction</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p>
                                    This auction features a curated selection of high-quality furniture pieces from top designers. Bid on
                                    items ranging from vintage armchairs to modern sofas and more. Don't miss your chance to add these
                                    unique pieces to your home.
                                </p>
                                {/* <Button variant="outline">View All Items</Button> */}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
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

function ArrowRightIcon(props: any) {
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
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    )
}
