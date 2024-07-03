import React, { useState, useEffect } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import BidsInformation from './components/BidsInformation';
import { useAuth } from '@/AuthProvider';
import { AuctionSessionStatus } from '@/constants/enums';
import { Item } from '@/models/newModel/item';
import { AuctionItem } from '@/models/newModel/auctionItem';


export default function AuctionJoin() {
  const currency = useCurrency();
  const [isReceived, setIsReceived] = useState(false);
  const [accountId, setAccountId] = useState<number | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const location = useLocation();
  const [price, setPrice] = useState<String | null>(null);
  const auth = useAuth();
  let auctionId = location.state.id.auctionSessionId;
  let itemId = location.state.id.itemId;
  let itemDTO = location.state.itemDTO;
  let endDate = location.state.endDate;
  const [allow, setAllow] = useState(location.state.allow);
  const [bids, setBids] = useState<YourBidType[]>([]);
  const [isJoin, setIsJoin] = useState(true);
  const auctionSession = useAppSelector(state => state.auctionSessions.currentAuctionSession);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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
  }, [itemId]);

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
  }, [allow, itemId]);



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
  const handleViewItemDetailsClick = async (item: AuctionItem, auctionId: number) => {
    // console.log(item, auctionId, bidders.includes(userId));
    // window.location.href = `/auctions/${auctionId}/${item.itemDTO.name}`;
    if (itemId !== item.itemDTO.itemId) {
      
      navigate(`/auctions/${auctionId}/${item.itemDTO.name}`, {
        state: {
          id: {
            auctionSessionId: auctionId,
            itemId: item.itemDTO.itemId
          },
          itemDTO: item.itemDTO,
          endDate: auctionSession?.endDate,
          allow: auctionSession.deposits.map((deposit) => {
            return deposit.payment.accountId;
          }).includes(auth.user.accountId) && auctionSession?.status === AuctionSessionStatus.PROGRESSING
        }
      });
    } else {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }


  }

  return (
    <>
      {isJoin ? <LoadingAnimation message='Please wait, Joining auction...' /> :
        <div className="flex flex-col min-h-screen container p-3 gap-10">
          <section className="justify-center items-center  w-full h-fit ">
            <h1 className=" text-2lg font-bold   ">
              {itemDTO.name}
            </h1>
            <div className='flex flex-wrap justify-between items-center'>
              <div className=' w-full h-full basis-full md:basis-3/5 border rounded-lg  p-2 '>
                <ImageGallery itemDTO={itemDTO} />
              </div>
              <div className=' w-full h-full  basis-full md:basis-2/5 p-2 flex flex-col items-start justify-start'>
                <h2 className='text-lg font-semibold'>Bids</h2>
                <ScrollArea className="h-48 overflow-hidden p-4 w-full" >
                  {!bids ? <div className='m-auto w-full h-full'>no bidder </div> : bids?.map((bid) => (
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
                  <div className=" rounded-xl p-3 w-full flex justify-center flex-col gap-3   md:top-10 lg:top-16  bg-background border border-gray-700
                  ">
                    <BidsInformation auctionSession={auctionSession} price={price} bids={bids} />
                    <div className='mx-auto'>
                      <PlaceBid 
                        auctionId={auctionId}
                        itemId={itemId}
                        sendMessage={sendMessage}
                        endDate={auctionSession?.endDate} // Added optional chaining for safety
                        name={itemDTO?.name}
                        image={itemDTO?.attachments?.[0]?.link ?? '/src/assets/thumnail1.jpg'} // Ensure attachments is an array before accessing
                        client={client}
                        currentBid={
                          price ?? (bids && bids.length > 0 ? bids[0].price : 0) // Check if bids is defined and not empty
                        }
                      />
                    </div>

                  </div>

                  :
                  <div className="mt-12 md:mt-16 lg:mt-20 container">
                    <div className='flex   rounded-xl flex-row  text-foreground p-5' >
                      <BidsInformation auctionSession={auctionSession} price={price} bids={bids} />
                    </div>
                    <div className="grid gap-4">
                      <Link to={`/auctions/${auctionId}` } >
                        <Button type="submit" className="w-full">
                          Go to Auction
                        </Button>
                      </Link>

                    </div>
                  </div>
                }

              </div>

            </div>
          </section>
          <section className=" justify-center items-center  w-full h-full mt-11 " >
            <div className='flex gap-2 flex-wrap '>
              <div className='basis-full md:basis-4/6 gap-1/6 h-fit'>
                <h1 className=" text-2lg font-bold  mb-9  ">
                  Item Description
                </h1>
                <div className="  "
                  dangerouslySetInnerHTML={{ __html: itemDTO?.description }}
                />
              </div>
              <div className='basis-full md:basis-1/6'>
                <h1 className=" text-2lg font-bold  mb-9  text-center ">
                  Other Item in this Auction
                </h1>
                <div className='flex gap-2 flex-col items-center'>
                  {
                    auctionSession.auctionItems.map((item) => (
                      <Card className='w-80 h-fit max-w-[360px]'>
                        <CardHeader>
                          <img src={item.itemDTO.attachments[0].link} alt="item" className='w-[360px]' />
                        </CardHeader>
                        <CardContent>
                          <h1 className='text-lg font-semibold'>{item.itemDTO.name}</h1>
                          <BidsInformation
                            auctionSession={auctionSession ?? {}} // Provide a default empty object if auctionSession is undefined
                            price={item?.highestBid ?? 0} // Use optional chaining and provide a default value of 0 if highestBid is undefined
                            bids={item?.numberOfBids > 0 ? item.numberOfBids : 0} // Use optional chaining for numberOfBids
                          />
                          <CardFooter>

                            <Button type="submit" className="w-full" onClick={() => handleViewItemDetailsClick(item, auctionId)}>
                              Join
                            </Button>
                          </CardFooter>
                        </CardContent>

                      </Card>
                    ))
                  }
                </div>


              </div>
            </div>

          </section>


        </div >
      }
    </>

  );
}
