import React, { useState, useEffect, useRef } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { set } from 'react-hook-form';
import { getCookie } from '@/utils/cookies';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { fetchBidsByAuctionItemId } from '@/services/BidsService';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay"
import { toast } from 'react-toastify';
import { parse } from 'path';


export default function AuctionJoin() {
  const [isReceived, setIsReceived] = useState(false);
  const [accountId, setAcccountId] = useState<number | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const location = useLocation();
  const [price, setPrice] = useState<String | null>(null);
  let auctionId = location.state.id.auctionSessionId;
  let itemId = location.state.id.itemId;
  let itemDTO = location.state.itemDTO;
  
  const [bids, setBids] = useState<YourBidType[]>([]);
  useEffect(() => {
    const newClient = new Client({
      brokerURL: 'ws://localhost:8080/auction-join?token=' + JSON.parse(getCookie("user")).accessToken,
      onConnect: () => {
        newClient.subscribe('/topic/public/' + auctionId + '/' + itemId, onMessageReceived);

        newClient.publish({
          destination: '/app/chat.addUser/' + auctionId + '/' + itemId,
          body: JSON.stringify({
            auctionItemId: location.state.id,
            payment: {
              accountId: JSON.parse(getCookie("user")).id
            }
          })
        });
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
      }
    };
  }, [accountId]);

  useEffect(() => {
    window.onpopstate = function() {
      client?.deactivate();
    };
  }, []);

  const onMessageReceived = (payload: IMessage) => {
    console.log(payload);
    if (JSON.parse(payload.body).statusCodeValue == 400) {
      toast.error(JSON.parse(payload.body).body);
      client?.deactivate();
      return;
    }
    const message = JSON.parse(payload.body).body;
    console.log(message);
    let content = '';
    if (message.split(":")[2] === 'JOIN' || message.split(":")[2] === 'BID') {
      content = `${message.split(":")[0]}`;
      setPrice(parseFloat(message.split(":")[1]).toString());
    }
    setIsReceived(!isReceived);
    toast.info(content);
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
    console.log("abc " + bids);
    fetchBidsByAuctionItemId(auctionId, itemId).then((res) => {
      console.log(res);
      setBids(res.data);
      bids.sort((a, b) => { return a.price - b.price });
    }).catch((err) => {
      console.log(err);
    });
    console.log("abc " + bids);

  }, [price]);

  if (accountId === null) {
    setAcccountId(JSON.parse(getCookie("user")).id);
  }
  return (
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
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white z-10">
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
                  <p className="text-2xl font-bold">${price ?? (bids.length > 0 ? bids[0].price : itemDTO.reservePrice)}</p>
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
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
