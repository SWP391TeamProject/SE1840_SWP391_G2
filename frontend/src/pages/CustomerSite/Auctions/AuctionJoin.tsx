import React, { useState, useEffect } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { getCookie } from '@/utils/cookies';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { fetchBidsByAuctionItemId } from '@/services/BidsService';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay"
import { toast } from 'react-toastify';
import { set } from 'date-fns';
import LoadingAnimation from '@/components/loadingAnimation/LoadingAnimation';
import { useCurrency } from "@/CurrencyProvider.tsx";
import PlaceBid from './components/PlaceBid';
import { fetchAuctionSessionById } from '@/services/AuctionSessionService';
import { setCurrentAuctionSession } from '@/redux/reducers/AuctionSession';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import CountDownTime from '@/components/countdownTimer/CountDownTime';
import "yet-another-react-lightbox/styles.css";

import "yet-another-react-lightbox/plugins/thumbnails.css";
import ImageGallery from './components/ImageGallery';
import { ArrowBigUp, HashIcon, Timer } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import BidsInformation from './components/BidsInformation';


export default function AuctionJoin() {
  const currency = useCurrency();
  const [isReceived, setIsReceived] = useState(false);
  const [accountId, setAccountId] = useState<number | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const location = useLocation();
  const [price, setPrice] = useState<String | null>(null);

  let auctionId = location.state.id.auctionSessionId;
  let itemId = location.state.id.itemId;
  let itemDTO = location.state.itemDTO;
  let endDate = location.state.endDate;
  const [allow, setAllow] = useState(location.state.allow);
  const [bids, setBids] = useState<YourBidType[]>([]);
  const [isJoin, setIsJoin] = useState(true);
  const auctionSession = useAppSelector(state => state.auctionSessions.currentAuctionSession);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!getCookie("user")) {
      setAllow(false);
      return;
    }
    if (accountId === null && getCookie("user")) {
      setAccountId(JSON.parse(getCookie("user"))?.id);
    }
    window.onpopstate = function () {
      client?.deactivate();
    };
    window.scrollTo(0, 0);
    if (getCookie("user") && JSON.parse(getCookie("user")) && allow !== false) {
      setAllow(true);
    } else {
      setAllow(false);
    }
  }, []);

  useEffect(() => {
    setIsJoin(true);
    if (allow === false || !getCookie("user")) {
      setIsJoin(false);
      setClient(null);
      toast.dismiss();
      return;
    }
    const newClient = new Client({
      brokerURL: `https://${import.meta.env.VITE_BACKEND_DNS}/auction-join?token=` + JSON.parse(getCookie("user")).accessToken,
      // onDisconnect: () => {
      //   toast.error('You have been disconnected from the auction');
      // },
      onConnect: () => {
        newClient.subscribe('/topic/public/' + auctionId + '/' + itemId, onMessageReceived);
        setTimeout(() => {
          newClient.publish({
            destination: '/app/chat.addUser/' + auctionId + '/' + itemId,
            body: JSON.stringify({
              auctionItemId: location.state.id,
              payment: {
                accountId: JSON.parse(getCookie("user")).id
              }
            })
          });
          setIsJoin(false);
        }, 1000);
      },
      onStompError: (error) => {
        console.error('Could not connect to WebSocket server. Please refresh this page to try again!', error);
      },
    });

    setClient(newClient);
    newClient.activate();

    return () => {
      if (newClient.connected) {
        newClient.deactivate();
        newClient.unsubscribe('/topic/public/' + auctionId + '/' + itemId);
      }
    };
  }, [allow]);



  const onMessageReceived = (payload: IMessage) => {
    setIsJoin(false);
    console.log(payload);

    if (payload.body.split(":")[payload.body.split(":").length - 1] == "ERROR") {
      toast.error(payload.body.split(":")[0], {
        position: "bottom-right",
      });
      client?.forceDisconnect();
      client?.deactivate({ force: true });
      setClient(null);
      setAllow(false);
      return;
    }
    if (JSON.parse(payload.body).statusCodeValue == 400) {
      if (payload.headers["message-id"].includes(JSON.parse(payload.body).body?.id)) {
        toast.error(JSON.parse(payload.body)?.body?.message, {
          position: "bottom-right",
        });
      }
      return;
    }
    const message = JSON.parse(payload.body).body;
    console.log(message);
    if (message?.status == "JOIN" || message?.status == "BID") {
      if (message?.status == "BID")
        toast.info(message?.message, {
          position: "bottom-right",
        });
      setPrice(parseFloat(message?.currentPrice).toFixed(2));
    }
    setIsReceived(!isReceived);
  };

  const sendMessage = (event: React.FormEvent) => {
    event.preventDefault();

    if (client != null) {
      const paymentAmount = (document.getElementById('price') as HTMLInputElement).value;
      if (!/^\d+(\.\d+)?$/.test(paymentAmount)) {
        toast.error("Please enter a valid number", {
          position: "bottom-right",
        });
        return;
      }
      client.publish({
        destination: '/app/chat.sendMessage/' + auctionId + '/' + itemId,
        body: JSON.stringify({
          auctionItemId: location.state.id,
          payment: {
            accountId: JSON.parse(getCookie("user")).id,
            amount: paymentAmount
          }
        })
      });
      (document.getElementById('price') as HTMLInputElement).value = '';
    }

  };

  useEffect(() => {
    fetchBidsByAuctionItemId(auctionId, itemId).then((res) => {
      console.log(res);
      setBids(res.data);
      bids.sort((a, b) => { return a.price - b.price });
    }).catch((err) => {
      console.log(err);
    });

  }, [price]);
  useEffect(() => {
    if (!auctionSession) {
      fetchAuctionSessionById(auctionId).then((res) => {
        dispatch(setCurrentAuctionSession(res?.data));
      }).catch((err) => {
        console.log(err);
      })
    }
  }, [])

  return (
    <>
      {isJoin ? <LoadingAnimation message='Please wait, Joining auction...' /> :
        <div className="flex flex-col min-h-screen container p-3 gap-10">
          <section className="justify-center items-center  w-full h-fit ">
            <h1 className=" text-2lg font-bold   ">
              {itemDTO.name}
            </h1>
            <div className='flex flex-wrap justify-center items-center'>
              <div className=' w-full h-full basis-full md:basis-1/2 border rounded-lg  p-2'>
                <ImageGallery itemDTO={itemDTO} />
              </div>
              <div className=' w-full h-full basis-full md:basis-1/2 p-2 flex flex-col items-start justify-start'>
                <ScrollArea className="h-48 overflow-hidden p-4 w-full" >
                  <h2 className='text-lg font-semibold'>bidder list</h2>
                  {bids ? <div className='m-auto w-full h-full'>no bidder </div> : bids?.map((bid) => (
                    <div className="flex items-center justify-between" key={bid?.bidId}>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8 border">
                          <img src={bid?.account.avatar?.link} alt="@username" />
                          <AvatarFallback>N/A</AvatarFallback>
                        </Avatar>
                        <p>{bid?.account.nickname}</p>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400">${bid?.price}</p>
                    </div>
                  ))}
                </ScrollArea>
                {allow ?
                  <div className=" rounded-xl p-3 w-full flex flex-col gap-3  sticky top-5 md:top-10 lg:top-16  bg-background border border-gray-700
                  ">
                    <BidsInformation auctionSession={auctionSession} price={price} bids={bids} />
                    <div className='mx-auto'>
                      <PlaceBid
                        auctionId={auctionId}
                        itemId={itemId}
                        sendMessage={sendMessage} endDate={auctionId.endDate} name={itemDTO?.name} image={itemDTO?.attachments[0].link} client={client} currentBid={
                          price ?? (bids.length > 0 ? bids[0].price : 0)
                        } />
                    </div>

                  </div>

                  :
                  <div className="mt-12 md:mt-16 lg:mt-20 container">
                    <div className='flex   rounded-xl flex-row  text-foreground p-5' >
                      <BidsInformation auctionSession={auctionSession} price={price} bids={bids} />
                    </div>
                    <div className="grid gap-4">
                      <Link to={`/auctions/${auctionId}`} >
                        <Button type="submit" className="w-full">
                          Go to Auction
                        </Button>
                      </Link>

                    </div>
                  </div>
                }

              </div>

            </div>

            {/* <Carousel className="flex w-5/6" plugins={[
              Autoplay({
                delay: 2000,
              }),
            ]}>
              <CarouselContent className=' w-full'>
                {itemDTO?.attachments.map((image) => (
                  <CarouselItem key={image.attachmentId} className="basis-1/3 rounded-full border overflow-hidden border-gray-700">
                    <img src={image.link} alt={itemDTO?.name} className="mx-auto " />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel> */}
          </section>
          <section className=" justify-center items-center  w-full h-fit mt-11 " >
            <div className='flex gap-2 flex-wrap '>
              <div className='basis-full md:basis-3/5'>
                <h1 className=" text-2lg font-bold   ">
                  Item Description
                </h1>
                <div className=" container justify-center items-center  w-full h-[30vh] md:h-[40vh] lg:h-fit "
                  dangerouslySetInnerHTML={{ __html: itemDTO?.description }}
                />
              </div>
              <div className='basis-full md:basis-2/5'>
                <h1 className=" text-2lg font-bold   ">
                  Other Item in this Auction
                </h1>
                {
                  auctionSession.auctionItems.map((item) => (
                    <Card>
                      <CardHeader>
                        <BidsInformation auctionSession={auctionSession} price={price} bids={bids} />
                      </CardHeader>
                      <CardContent>
                        <CountDownTime end={new Date(auctionSession.endDate)} />
                      </CardContent>
                    </Card>
                  ))
                }
              </div>
            </div>

          </section>


        </div >
      }
    </>

  );
}
