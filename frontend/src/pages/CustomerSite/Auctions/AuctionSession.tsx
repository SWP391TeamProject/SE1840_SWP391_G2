import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import CountDownTime from '@/components/countdownTimer/CountDownTime'
import axios from 'axios'
import { toast } from 'react-toastify'
import { getCookie } from '@/utils/cookies'
import { registerAuctionSession } from '@/services/AuctionSessionService'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'

import { AuctionSessionStatus } from '@/constants/enums'

import { SERVER_DOMAIN_URL } from '@/constants/domain'


export default function AuctionSession() {
    const auctionSession = useAppSelector(state => state.auctionSessions.currentAuctionSession);
    const dispatch = useAppDispatch();
    const [sessionAttachments, setSessionAttachments] = useState([]);
    const navigate = useNavigate();
    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    const param = useParams();
    const [bidders, setBidders] = useState<number[]>([]);
    const user = JSON.parse(getCookie("user") || "null");
    const userId = user == null ? -1 : user.id;

    useEffect(() => {

        if (auctionSession == null) {
            axios.get(`${SERVER_DOMAIN_URL}/api/auction-sessions/1`)
                .then(res => {
                    dispatch({ type: "auctionSessions/setCurrentAuctionSession", payload: res.data });
                    setSessionAttachments(res.data.attachments);
                    toast.success("Auction Session Loaded");
                })
                .catch(err => {
                    toast.error("Failed to load Auction Session");
                    console.log(err);
                })

        }
        if (param.id) {
            axios.get(`${SERVER_DOMAIN_URL}/api/auction-sessions/` + param.id)
                .then(res => {
                    console.log(res.data);
                    dispatch({ type: "auctionSessions/setCurrentAuctionSession", payload: res.data });
                    setSessionAttachments(res.data.attachments);
                    toast.success("Auction Session Loaded");
                })
                .catch(err => {
                    toast.error("Failed to load Auction Session");
                    console.log(err);
                })
        }


    }, []);

    useEffect(() => {
        console.log(auctionSession);
        if (auctionSession && auctionSession.attachments) {
            setSessionAttachments(auctionSession.attachments);
            if (auctionSession.deposits) {
                auctionSession?.deposits.forEach((deposit: any) => {
                    setBidders(prevBidders => [...prevBidders, deposit?.payment.accountId]);
                });
            }
        }
    }, [auctionSession])

    const handleRegister = () => {
        registerAuctionSession(auctionSession?.auctionSessionId ?? -1).then(res => {
            res.data.deposits.forEach((deposit: any) => {
                if (!bidders.includes(deposit.payment.accountId)) {
                    setBidders(prevBidders => [...prevBidders, deposit.payment.accountId]);
                }
            });
            toast.success("Registered Successfully");
        }).catch(() => { toast.error("Failed to Register") });
    }
    const ConfirmRegister = () => {
        let fee = Number.MAX_VALUE;
        if (auctionSession?.auctionItems) {
            auctionSession.auctionItems.forEach((item: any) => {
                if (item.itemDTO.reservePrice < fee) {
                    fee = item.itemDTO.reservePrice;
                }
            });
        }
        fee = fee * 0.045;
        if (fee < 100) {
            fee = 100;
        }
        if (fee > 1000) {
            fee = 1000;
        }
        return (
            <AlertDialog>
                <AlertDialogTrigger>
                    <Button variant="default" >Register to bid</Button>
                </AlertDialogTrigger>
                <AlertDialogContent className='text-foreground'>
                    <AlertDialogHeader >
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will
                            directly remove your balance from your
                            account and remove your data from our servers.
                            (Auction Registration Fee: ${fee})
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel >Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleRegister()}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )

    }
    const RegisterAlert = () => {
        let fee = Number.MAX_VALUE;
        if (auctionSession?.auctionItems) {
            auctionSession.auctionItems.forEach((item: any) => {
                if (item.itemDTO.reservePrice < fee) {
                    fee = item.itemDTO.reservePrice;
                }
            });
        }
        fee = fee * 0.045;
        if (fee < 100) {
            fee = 100;
        }
        if (fee > 1000) {
            fee = 1000;
        }
        return (
            <AlertDialog>
                <AlertDialogTrigger>
                    <Button variant="default">Place Bid</Button>
                </AlertDialogTrigger>
                <AlertDialogContent className='text-foreground'>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Register is needed</AlertDialogTitle>
                        <AlertDialogDescription>
                            You need to register to this auction first
                            if you want to place a bid.
                            Do you want to continue?
                            (Auction Registration Fee: ${fee})
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleRegister()}>Register</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )
    }
    return (
        <div className="flex flex-col min-h-screen">
            <section className="bg-gray-100 py-12 md:py-12 dark:bg-gray-800">
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

                                    {auctionSession?.status === AuctionSessionStatus.PROGRESSING && new Date(auctionSession?.endDate) > new Date() &&
                                        <span>Ends in {auctionSession?.endDate ? <CountDownTime end={new Date(auctionSession.endDate)}></CountDownTime> : <CountDownTime end={new Date()}></CountDownTime>}</span>}

                                    {auctionSession?.status === AuctionSessionStatus.FINISHED && new Date(auctionSession?.endDate) <= new Date() &&
                                        <div className="text-pink-500 dark:text-pink-400 font-semibold">
                                            Auction Ended
                                        </div>}

                                    {auctionSession?.status === AuctionSessionStatus.TERMINATED &&
                                        <div className="text-red-500 dark:text-red-400 font-semibold">
                                            Auction has been terminated
                                        </div>}

                                    {auctionSession?.status === AuctionSessionStatus.SCHEDULED &&
                                        <span>Start in {auctionSession?.startDate ? <CountDownTime end={new Date(auctionSession.startDate)}></CountDownTime> : <CountDownTime end={new Date()}></CountDownTime>}</span>}

                                </div>


                                {bidders.includes(userId) ? (
                                    auctionSession?.status === AuctionSessionStatus.PROGRESSING &&
                                    <Button onClick={() => scrollTo({ top: (document.getElementById("auction-items")?.offsetTop), behavior: 'smooth' })}>Place Bid</Button>
                                ) : (
                                    auctionSession?.status === AuctionSessionStatus.SCHEDULED &&
                                    <ConfirmRegister></ConfirmRegister>
                                )}


                            </div>
                        </div>
                        <img
                            src={sessionAttachments[0]?.link}
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
                    <div id='auction-items'>
                        <h2 className="mb-8 text-2xl font-bold">Auction Items</h2>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {auctionSession?.auctionItems ? auctionSession.auctionItems.map((item) => (
                                <Card key={item.id.itemId}>
                                    <img
                                        src={item.itemDTO.attachments[0].link}
                                        width={300}
                                        height={200}
                                        alt="Auction Item"
                                        className="rounded-t-lg object-cover"
                                    />
                                    <CardContent className="space-y-2 p-4">
                                        <h3 className="text-lg font-semibold">{item.itemDTO.name}</h3>
                                        <div className="flex items-center justify-between">
                                            <div className="text-primary-500 font-medium">{currencyFormatter.format(item.itemDTO.reservePrice)}</div>

                                            {
                                                auctionSession?.status === AuctionSessionStatus.FINISHED && new Date(auctionSession?.endDate) < new Date() ?
                                                    <div className="rounded-md bg-yellow-300 p-2 text-red-500">
                                                        Won: {currencyFormatter.format(item.currentPrice)}
                                                    </div> :
                                                    <>
                                                        {bidders.includes(userId) ? (
                                                            <Button onClick={() => {
                                                                let name = item?.itemDTO.name;
                                                                navigate(`${name}`, { state: { id: item?.id, itemDTO: item?.itemDTO } });
                                                            }}>Place Bid</Button>
                                                        ) : (
                                                            <RegisterAlert></RegisterAlert>
                                                        )}
                                                    </>

                                            }

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
            </main >
        </div >
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

