import React, { useState, useEffect, useCallback } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { getCookie } from '@/utils/cookies';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { fetchBidsByAuctionId } from '@/services/BidsService';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { toast } from 'sonner';
import { set } from 'date-fns';
import LoadingAnimation from '@/components/loadingAnimation/LoadingAnimation';
import { useCurrency } from '@/CurrencyProvider.tsx';
import PlaceBid from './components/PlaceBid';
import { fetchAuctionSessionById } from '@/services/AuctionSessionService';
import { setCurrentAuctionSession } from '@/redux/reducers/AuctionSession';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import CountDownTime from '@/components/countdownTimer/CountDownTime';
import 'yet-another-react-lightbox/styles.css';

import 'yet-another-react-lightbox/plugins/thumbnails.css';
import ImageGallery from './components/ImageGallery';
import { ArrowBigUp, HashIcon, Timer } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import BidsInformation from './components/BidsInformation';
import { useAuth } from '@/AuthProvider';
import { AuctionSessionStatus } from '@/constants/enums';
import { Item } from '@/models/newModel/item';
import { AuctionItem } from '@/models/auctionItem';
import Confetti from 'react-confetti-boom';
import { BidReply } from '@/models/bidReply';
import { formatDate } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ResultDialog from './result-dialog';
import { it } from 'node:test';
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '@/components/ui/dialog';

export default function AuctionJoin() {
  const currency = useCurrency();
  const [isReceived, setIsReceived] = useState(false);
  const [accountId, setAccountId] = useState<number | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const location = useLocation();
  const [price, setPrice] = useState<String | null>(null);
  const auth = useAuth();

  console.log(location.state);
  const [bids, setBids] = useState<BidReply[]>([]);
  const [isJoin, setIsJoin] = useState(true);
  const auctionSession = useAppSelector((state) => state.auctionSessions.currentAuctionSession);
  const [itemDTO, setItemDTO] = useState<Item | undefined>(
    location?.state?.itemDTO ?? auctionSession?.auctionItems[0]?.itemDTO
  );

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isSending, setIsSending] = useState(false);
  const [showCofetti, setShowCofetti] = useState(false);
  let timer;
  const loc = useLocation();
  const nav = useNavigate();
  const params = useParams();
  const auctionId: number = Number(params.id);
  const [ping, setPing] = useState([]);
  const [winningBids, setWinningBids] = useState<BidReply[]>([]);
  let timeout;
  const [openWinningDialog, setOpenWinningDialog] = useState(false);
  // const auctionId = auctionSession?.auctionSessionId;
  // const itemId = location.state.id.itemId;

  const isProgress = useCallback(() => {
    let now = new Date();
    let endDate = new Date(auctionSession?.endDate);
    let startDate = new Date(auctionSession?.startDate);
    if (endDate > now && startDate < now) {
      return true;
    }
    return false;
  }, [auctionSession]);

  const isScheduled = useCallback(() => {
    let now = new Date();
    let endDate = new Date(auctionSession?.endDate);
    let startDate = new Date(auctionSession?.startDate);
    if (startDate < now) {
      return true;
    }
    return false;
  }, [auctionSession]);

  const [allow, setAllow] = useState<boolean | undefined>(false);
  useEffect(() => {
    if (winningBids.length > 0) {
      setOpenWinningDialog(true);
    }
  }, [winningBids]);
  useEffect(() => {
    if (!auctionSession) {
      fetchAuctionSessionById(auctionId)
        .then((response) => {
          dispatch(setCurrentAuctionSession(response));
          console.log(response);
          setAllow(auctionSession?.hasDeposited);
          if (response.status === AuctionSessionStatus.FINISHED || new Date(auctionSession?.endDate) < new Date()) {
            setShowCofetti(true);
            setTimeout(() => {
              setShowCofetti(false);
            }, 3000);
          }
          if (response.status !== AuctionSessionStatus.SCHEDULED) {
            fetchBidsByAuctionId(auctionId)
              .then((res) => {
                console.log(res);
                setBids(res);
                bids.sort((a, b) => {
                  return a.price - b.price;
                });
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      setAllow(auctionSession?.hasDeposited);
      if (auctionSession?.status === AuctionSessionStatus.FINISHED || new Date(auctionSession?.endDate) < new Date()) {
        setShowCofetti(true);
        setTimeout(() => {
          setShowCofetti(false);
        }, 3000);
      }
      if (auctionSession?.status !== AuctionSessionStatus.SCHEDULED) {
        fetchBidsByAuctionId(auctionId)
          .then((res) => {
            console.log(res);
            setBids(res);
            bids.sort((a, b) => {
              return a.price - b.price;
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }, []);
  useEffect(() => {
    if (bids.length > 0 && new Date(auctionSession?.endDate) <= new Date()) {
      for (const item of auctionSession?.auctionItems) {
        for (const element of bids) {
          if (item?.itemDTO?.itemId === element?.auctionItemId?.itemId) {
            console.log(element, true);
            if (winningBids.filter((bid) => bid.auctionItemId.itemId === element?.auctionItemId.itemId).length > 0) {
              continue;
            }
            setWinningBids((prev) => [...prev, element]);
            break;
          }
        }
      }
    }
  }, [bids]);
  useEffect(() => {
    console.log('isallow', allow);
    // console.log("calling", auctionSession);
    setAllow(auctionSession?.hasDeposited);
  }, [allow]);

  // useEffect(() => {
  //   if (!auctionSession) {
  //     fetchAuctionSessionById(auctionId)
  //       .then((res) => {
  //         dispatch(setCurrentAuctionSession(res));
  //         setItemDTO(res?.auctionItems[0].itemDTO);
  //         setAllow(res?.hasDeposited);
  //       })
  //       .catch((err) => {
  //         console.error(err);
  //       });
  //     fetchBidsByAuctionId(auctionId)
  //       .then((res) => {
  //         console.log(res);
  //         setBids(res);
  //         bids.sort((a, b) => {
  //           return a.price - b.price;
  //         });
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  //   console.log(allow);
  // }, [auctionSession]);

  useEffect(() => {
    if (auctionSession?.status === AuctionSessionStatus.FINISHED || new Date(auctionSession?.endDate) < new Date()) {
      setShowCofetti(true);
      setTimeout(() => {
        setShowCofetti(false);
      }, 3000);
    }
    if (auctionSession?.status === AuctionSessionStatus.SCHEDULED) {
      navigate(`/auctions/${auctionId}`);
    }
  }, [auctionSession]);

  useEffect(() => {
    // if (!getCookie('user')) {
    //   setAllow(false);
    //   return;
    // }
    if (accountId === null && getCookie('user')) {
      setAccountId(JSON.parse(getCookie('user'))?.id);
    }
    window.onpopstate = function () {
      client?.deactivate();
    };
    window.scrollTo(0, 0);
    // if (getCookie('user') && JSON.parse(getCookie('user')) && allow !== false) {
    //   setAllow(true);
    // } else {
    //   setAllow(false);
    // }
  }, [itemDTO]);

  useEffect(() => {
    console.log(auctionSession);
    if (
      new Date(auctionSession?.endDate) > new Date() &&
      new Date(auctionSession?.startDate) < new Date() &&
      auctionSession?.hasDeposited
    ) {
      const newClient = new Client({
        brokerURL:
          `https://${import.meta.env.VITE_BACKEND_DNS}/auction-join?token=` + JSON.parse(getCookie('user')).accessToken,
        onConnect: () => {
          newClient.subscribe('/topic/public/' + auctionId, onMessageReceived);
          setTimeout(() => {
            newClient.publish({
              destination: '/app/chat.addUser/' + auctionId + '/' + itemDTO?.itemId,
              body: JSON.stringify({
                auctionItemId: {
                  auctionSessionId: auctionSession?.auctionSessionId,
                  itemId: itemDTO?.itemId,
                },
                payment: {
                  accountId: JSON.parse(getCookie('user')).id,
                },
              }),
            });
            setIsJoin(false);
          }, 10);
        },
        onDisconnect: () => {
          console.log('Disconnected');
          clearTimeout(timer);
        },
        onStompError: (error) => {
          console.error('Could not connect to WebSocket server. Please refresh this page to try again!', error);
        },
      });
      newClient.activate();

      setClient(newClient);

      return () => {
        if (newClient.connected) {
          newClient.deactivate();
          newClient.unsubscribe('/topic/public/' + auctionId);
        }
      };
    } else {
      setIsJoin(false);
    }
  }, []);

  const onMessageReceived = (payload: IMessage) => {
    setIsJoin(false);
    console.log(payload);

    if (payload.body.split(':')[payload.body.split(':').length - 1] == 'ERROR') {
      toast.error(payload.body.split(':')[0], {});
      client?.forceDisconnect();
      client?.deactivate({ force: true });
      setClient(null);
      setAllow(false);
      setIsJoin(false);
      return;
    }
    if (JSON.parse(payload.body).statusCodeValue == 400) {
      if (payload.headers['message-id'].includes(JSON.parse(payload.body).body?.id)) {
        toast.error(JSON.parse(payload.body)?.body?.message, {});
        setIsSending(false);
      }
      return;
    }
    const message = JSON.parse(payload.body).body;
    console.log(message);
    if (message?.status == 'JOIN' || message?.status == 'BID') {
      if (message?.status == 'BID')
        toast.info(message?.message, {
          action: (
            <Button
              variant="outline"
              onClick={() =>
                handleViewItemDetailsClick(
                  auctionSession?.auctionItems?.filter(
                    (item) => item.itemDTO.itemId == message?.auctionItemId.itemId
                  )[0]
                )
              }
            >
              View
            </Button>
          ),
        });
      setIsSending(false);
      setPrice(parseFloat(message?.currentPrice).toFixed(2));
    }
    setIsReceived(!isReceived);
  };

  const sendMessage = (event: React.FormEvent) => {
    event.preventDefault();

    if (client != null) {
      const paymentAmount = (document.getElementById('price') as HTMLInputElement).value;
      if (!/^\d+(\.\d+)?$/.test(paymentAmount)) {
        toast.error('Please enter a valid number', {});
        return;
      }
      // client.publish({
      //   destination: '/app/chat.sendMessage/' + auctionId + '/' + itemDTO?.itemId,
      //   body: JSON.stringify({
      //     auctionItemId: location.state.id,
      //     payment: {
      //       accountId: JSON.parse(getCookie('user')).id,
      //       paymentAmount: paymentAmount,
      //     },
      //   }),
      // });
      (document.getElementById('price') as HTMLInputElement).value = '';
    }
  };

  useEffect(() => {
    if (auctionSession?.status !== AuctionSessionStatus.SCHEDULED) {
      fetchBidsByAuctionId(auctionId)
        .then((res) => {
          console.log(res);
          setBids(res);
          if (res.length > 0) {
            setPing((prev) => [
              ...prev,
              res?.sort((a, b) => -new Date(a?.createDate).getTime() + new Date(b?.createDate).getTime())[0]
                ?.auctionItemId?.itemId,
            ]);
          }
          console.log(
            res?.sort((a, b) => -new Date(a?.createDate).getTime() + new Date(b?.createDate).getTime())[0]
              ?.auctionItemId?.itemId
          );
          bids.sort((a, b) => {
            return a.price - b.price;
          });

          timeout = setTimeout(() => {
            setPing((prev) => [
              ...prev.filter(
                (item) =>
                  item !==
                  res?.sort((a, b) => -new Date(a?.createDate).getTime() + new Date(b?.createDate).getTime())[0]
                    ?.auctionItemId?.itemId
              ),
            ]);
          }, 2000);

          return () => {
            clearTimeout(timeout);
          };
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [price]);

  const handleViewItemDetailsClick = async (item: AuctionItem) => {
    // console.log(item, auctionId, bidders.includes(userId));
    // window.location.href = `/auctions/${auctionId}/${item.itemDTO.name}`;
    if (itemDTO?.itemId !== item.itemDTO.itemId) {
      setItemDTO(item.itemDTO);
      if (auctionSession?.status === AuctionSessionStatus.FINISHED || new Date(auctionSession?.endDate) < new Date()) {
        setShowCofetti(true);
        setTimeout(() => {
          setShowCofetti(false);
        }, 3000);
      }
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });

      // nav(location.pathname, {
      //   state: {
      //     id: item,
      //     itemDTO: item.itemDTO,
      //     endDate: endDate,
      //     allow: allow,
      //   },
      // });
    } else {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }
  };

  const isWinner = useCallback(() => {
    console.log(winningBids);
    if (winningBids?.filter((bid) => bid.account.accountId === auth.user.accountId).length > 0) {
      console.log(winningBids?.filter((bid) => bid.account.accountId === auth.user.accountId));
      return true;
    }
    return false;
  }, [winningBids]);
  return (
    <>
      {!isJoin ? (
        <div className="grid p-5  items-center container  ">
          <div className="grid grid-cols-12 gap-4">
            <div className="  col-span-12 h-1/5  w-full grid ">
              <div className="grid grid-cols-12 gap-4 h-full">
                <div className="col-span-6 md:col-span-6 w-full">
                  <div className="w-full">
                    <h1 className=" text-2xl font-bold  text-center mb-2 ">{itemDTO?.name}</h1>
                    <div className="w-auto h-full m-auto">
                      <div className="h-full">
                        <div className="mx-auto w-full h-full basis-full md:basis-3/5 border rounded-lg  p-2 ">
                          <ImageGallery itemDTO={itemDTO} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-6 md:col-span-6 flex flex-col w-full">
                  {/* <h2 className="text-lg font-semibold">Bids</h2> */}

                  {!bids ? (
                    <div className="m-auto w-full h-full">no bidder </div>
                  ) : (
                    <div className="relative">
                      <Table>
                        <TableHeader className="sticky top-0 bg-background z-10">
                          <TableRow>
                            <TableHead>Bidder</TableHead>
                            <TableHead className="text-right">Date</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                          </TableRow>
                        </TableHeader>
                      </Table>
                      <ScrollArea className="h-48 overflow-hidden w-full">
                        <Table>
                          <TableBody>
                            {bids
                              ?.filter((bid) => bid.auctionItemId.itemId === itemDTO?.itemId)
                              .map((bid) => (
                                <TableRow key={bid?.bidId}>
                                  <TableCell>
                                    <div className="flex items-center gap-2 w-full">
                                      <Avatar className="w-8 h-8 border">
                                        <AvatarImage src={bid?.account.avatar?.link} alt={bid?.account.nickname} />
                                        <AvatarFallback>{bid?.account.nickname.charAt(0).toUpperCase()}</AvatarFallback>
                                      </Avatar>
                                      <span>{bid?.account.nickname}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-center">{formatDate(bid?.createDate)}</TableCell>
                                  <TableCell className="text-right">${bid?.price}</TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </div>
                  )}

                  {auctionSession?.hasDeposited && (
                    <div className=" drop-shadow-xl rounded-xl p-3 w-full flex justify-center flex-col gap-3   md:top-10 lg:top-16  bg-background border border-gray-700">
                      <BidsInformation
                        auctionSession={auctionSession}
                        price={bids.filter((bid) => bid.auctionItemId.itemId === itemDTO?.itemId)[0]?.price || 0}
                        bids={bids.filter((bid) => bid.auctionItemId.itemId === itemDTO?.itemId)}
                      />
                      <div className="mx-auto">
                        {isProgress() ? (
                          <PlaceBid
                            auctionId={auctionId}
                            itemId={itemDTO?.itemId}
                            setIsSending={setIsSending}
                            isSending={isSending}
                            sendMessage={sendMessage}
                            onMessageReceived={onMessageReceived}
                            endDate={auctionSession?.endDate} // Added optional chaining for safety
                            name={itemDTO?.name}
                            image={itemDTO?.attachments?.[0]?.link ?? '/src/assets/thumnail1.jpg'} // Ensure attachments is an array before accessing
                            client={client}
                            currentBid={
                              bids.filter((bid) => bid.auctionItemId?.itemId === itemDTO?.itemId)[0]?.price ||
                              itemDTO?.reservePrice // Check if bids is defined and not empty
                            }
                          />
                        ) : (
                          <Button
                            className="w-full"
                            variant="outline"
                            onClick={() => nav(`/jewelries/${itemDTO?.itemId}`)}
                          >
                            More Detail
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className=" col-span-12  ">
              <Carousel orientation="horizontal">
                <CarouselContent className="-mt-1 w-full">
                  {auctionSession?.auctionItems.map((item) => (
                    <CarouselItem key={item.itemDTO.itemId} className="  md:basis-1/4">
                      <div
                        onClick={() => handleViewItemDetailsClick(item)}
                        className="hover:cursor-pointer border w-1/2 rounded-2xl mx-auto mt-10"
                      >
                        {ping?.filter((p) => p === item.itemDTO.itemId).length > 0 && (
                          <div className="w-4 h-4 rounded-full bg-red-500 animate-ping absolute z-50 " />
                        )}

                        <img
                          src={item.itemDTO.attachments[0]?.link || 'https://placehold.co/400'}
                          alt=""
                          className="aspect-square h-30  object-cover rounded-2xl"
                        />
                        <p className="text-lg font-semibold mb-2 truncate">{item.itemDTO?.name}</p>
                        <p>CurrentPrice:{currency.format(item.currentPrice)}</p>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CardFooter>
                  {/* <CarouselPrevious />
                <CarouselNext /> */}
                </CardFooter>
              </Carousel>
            </div>
          </div>
          {/* end layoout */}
        </div>
      ) : (
        <LoadingAnimation />
      )}
      {!isWinner() && auctionSession?.hasDeposited && !isScheduled() && !isProgress() && (
        <Dialog defaultOpen>
          <DialogContent>
            <DialogHeader>So sorry you didn't win this time</DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCofetti(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {isWinner() && (
        <ResultDialog
          open={openWinningDialog}
          onOpenChange={setOpenWinningDialog}
          message="Congratulations"
          title=" Congratulations"
          items={auctionSession?.auctionItems.filter(
            (item) =>
              winningBids?.filter((bid) => bid.auctionItemId.itemId === item.itemDTO.itemId)[0]?.account.accountId ===
              auth.user.accountId
          )}
        />
      )}
    </>
  );
}
