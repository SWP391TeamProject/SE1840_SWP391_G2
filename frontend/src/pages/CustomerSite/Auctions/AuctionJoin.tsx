import React, { useState, useEffect } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import { useLocation } from 'react-router-dom';
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
import {useCurrency} from "@/CurrencyProvider.tsx";


export default function AuctionJoin() {
  const currency = useCurrency();
  const [isReceived, setIsReceived] = useState(false);
  const [accountId, setAcccountId] = useState<number | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const location = useLocation();
  const [price, setPrice] = useState<String | null>(null);
  let auctionId = location.state.id.auctionSessionId;
  let itemId = location.state.id.itemId;
  let itemDTO = location.state.itemDTO;
  const [allow, setAllow] = useState(true);

  const [bids, setBids] = useState<YourBidType[]>([]);
  const [isJoin, setIsJoin] = useState(false);
  useEffect(() => {
    if (!allow) {
      setClient(null);
      return;
    }
    const newClient = new Client({
      brokerURL: `wss://${import.meta.env.VITE_BACKEND_DNS}/auction-join?token=` + JSON.parse(getCookie("user")).accessToken,
      // onDisconnect: () => {
      //   toast.error('You have been disconnected from the auction');
      // },
      onConnect: () => {
        setIsJoin(true);
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

  useEffect(() => {
    window.onpopstate = function () {
      client?.deactivate();
    };
    window.scrollTo(0, 0);
  }, []);

  const onMessageReceived = (payload: IMessage) => {
    setIsJoin(false);
    console.log(payload);

    if (payload.body.split(":")[payload.body.split(":").length - 1] == "ERROR") {
      toast.error(payload.body.split(":")[0]);
      client?.forceDisconnect();
      client?.deactivate({ force: true });
      setClient(null);
      setAllow(false);
      return;
    }
    if (JSON.parse(payload.body).statusCodeValue == 400) {
      if (payload.headers["message-id"].includes(JSON.parse(payload.body).body?.id)) {
        toast.error(JSON.parse(payload.body)?.body?.message);
      }
      return;
    }
    const message = JSON.parse(payload.body).body;
    console.log(message);
    if (message?.status == "JOIN" || message?.status == "BID") {
      if (message?.status == "BID")
        toast.info(message?.message);
      setPrice(parseFloat(message?.currentPrice).toFixed(2));
    }
    setIsReceived(!isReceived);
  };

  const sendMessage = (event: React.FormEvent) => {
    event.preventDefault();

    if (client != null) {
      const paymentAmount = (document.getElementById('price') as HTMLInputElement).value;
      if (!/^\d+(\.\d+)?$/.test(paymentAmount)) {
        toast.error("Please enter a valid number");
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

  if (accountId === null) {
    setAcccountId(JSON.parse(getCookie("user")).id);
  }
  return (
    <>
      {isJoin ? <LoadingAnimation message='Please wait, Joining auction...' /> :
        <div className="flex flex-col min-h-screen">
          <section className=" flex justify-center items-center  w-full h-[60vh] md:h-[70vh] lg:h-[80vh] bg-black">
            <Carousel className="flex w-5/6" plugins={[
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
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white z-">
                <h1 className=" w-3/5 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl   ">
                  {itemDTO.name}
                </h1>
                <p className="mt-4 max-w-3xl text-lg md:text-xl">
                  Discover the timeless elegance of this beautifully crafted vintage leather armchair, a true statement piece
                  for your home.
                </p>
              </div>

              <CarouselPrevious />
              <CarouselNext />

            </Carousel>

          </section>
          <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-4">Item Details</h2>
                <div className="space-y-4">
                  <div
                    dangerouslySetInnerHTML={{ __html: itemDTO?.description }}
                  />

                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-4">Bidding History</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Current Bid</p>
                      <p className="text-2xl font-bold">${currency.format({
                        amount: price ?? (bids.length > 0 ? bids[0].price : itemDTO.reservePrice),
                        fractionDigits: 0
                      })}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Bid Count</p>
                      <p className="text-2xl font-bold">{bids.length}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <ScrollArea className="h-48 overflow-hidden p-4" css={{ width: 400 }}>
                      {bids?.map((bid) => (
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

                  </div>
                  {allow &&
                    <div className="mt-12 md:mt-16 lg:mt-20">
                      <h2 className="text-2xl font-bold tracking-tight mb-4 text-center">Place a Bid</h2>
                      <form className="max-w-md mx-auto" onSubmit={sendMessage}>
                        <div className="grid gap-4">
                          <div>
                            <Input type="text" id="price" placeholder="Enter your bid amount" className="w-full" />
                          </div>
                          <Button type="submit" className="w-full">
                            Place Bid
                          </Button>
                        </div>
                      </form>
                    </div>
                  }
                </div>
              </div>
            </div>

          </div>
        </div>
      }
    </>

  );
}
