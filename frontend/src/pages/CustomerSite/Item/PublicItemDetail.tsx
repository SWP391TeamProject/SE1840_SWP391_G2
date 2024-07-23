import { useEffect, useState } from 'react';
import { getItemById } from '@/services/ItemService';
import LoadingAnimation from '@/components/loadingAnimation/LoadingAnimation';
import { useCurrency } from '@/CurrencyProvider';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Item, ItemStatus } from '@/models/Item.ts';
import { AlertCircle, BoxIcon, GavelIcon, GemIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator.tsx';
import { Button } from '@/components/ui/button';
import { fetchAuctionSessionHistoryOfItem } from '@/services/AuctionSessionService.tsx';
import { AuctionSession } from '@/models/AuctionSessionModel.tsx';
import { Page } from '@/models/Page.ts';
import { formatDate } from '@/lib/utils.ts';
import { AxiosResponse } from 'axios';

const noImagePlaceholder = 'https://placehold.co/600x400?text=No+image';

export function PublicItemDetail() {
  const currency = useCurrency();
  const itemId = parseInt(useParams().id);
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState({} as Item);
  const [selectedImageUrl, setSelectedImageUrl] = useState(noImagePlaceholder);
  const [pastAuction, setPastAuction] = useState([] as AuctionSession[]);

  useEffect(() => {
    getItemById(itemId)
      .then((res) => {
        setLoading(false);
        setItem(res);

        if (res.attachments && res.attachments.length > 0) setSelectedImageUrl(res.attachments[0].link);

        if (res.status != ItemStatus.QUEUE) {
          fetchAuctionSessionHistoryOfItem(res.itemId)
            .then((res: AxiosResponse<Page<AuctionSession>, any>) => {
              setPastAuction(res.data.content);
            })
            .catch((e) => {
              console.error(e);
              toast.error('Failed to get auction history!', {});
            });
        }
      })
      .catch((e) => {
        console.error(e);
        toast.error('Error when loading item detail!', {});
      });
  }, []);

  return (
    <>
      {loading ? (
        <LoadingAnimation />
      ) : (
        <div className="container w-full py-12">
          <div className="flex flex-row flex-wrap md:flex-nowrap gap-10">
            <div className="basis-1/12">
              <div className="flex flex-col gap-2">
                {!item.attachments || item.attachments.length == 0 ? (
                  <img
                    src={noImagePlaceholder}
                    alt=""
                    className="w-[64px] h-[64px] max-w-fit	outline outline-4 outline-orange-500"
                  />
                ) : (
                  item.attachments
                    .map((a) => a.link)
                    .map((url) => {
                      return (
                        <img
                          src={url}
                          alt=""
                          onClick={() => setSelectedImageUrl(url)}
                          className={`w-24 h-24 max-w-fit cursor-pointer 
                                ${url === selectedImageUrl ? 'outline outline-4 outline-orange-500' : 'opacity-70'}`}
                        />
                      );
                    })
                )}
              </div>
            </div>
            <div className="basis-11/12 md:basis-5/12 order-first	md:order-none">
              <img src={selectedImageUrl} alt="" className="w-full" />
            </div>
            <div className="basis-12/12 md:basis-6/12">
              <div className="flex flex-col gap-3">
                <h1 className="text-3xl font-bold">{item.name}</h1>
                <Separator />
                <div className="flex">
                  <div className="basis-3/6 flex flex-col gap-3">
                    <div className="inline-flex">
                      <BoxIcon className="h-6 w-6" />
                      <span className="pl-2">{item.category.name}</span>
                    </div>
                    <div className="inline-flex">
                      <GemIcon className="h-6 w-6" />
                      <span className="pl-2">Reserve price: {currency.format(item.reservePrice)}</span>
                    </div>
                    {item.buyInPrice && (
                      <div className="inline-flex">
                        <GemIcon className="h-6 w-6" />
                        <span className="pl-2">Buy in price: {currency.format(item.buyInPrice)}</span>
                      </div>
                    )}
                  </div>
                  <div className="basis-3/6">
                    {item.status == ItemStatus.IN_AUCTION && (
                      <Alert variant="default">
                        <AlertCircle className="h-5 w-5" />
                        <AlertTitle>
                          <h3 className="text-lg">Status</h3>
                        </AlertTitle>
                        <AlertDescription>
                          This item is in a upcoming or progressing auction.
                          {pastAuction.length > 0 && (
                            <div className="mt-5">
                              <Button variant="default" size="sm" asChild>
                                <Link to={`/auctions/${pastAuction[0].auctionSessionId}`}>
                                  <GavelIcon className="w-4 h-4 mr-2" /> Join auction
                                </Link>
                              </Button>
                            </div>
                          )}
                        </AlertDescription>
                      </Alert>
                    )}
                    {item.status == ItemStatus.SOLD && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-5 w-5" />
                        <AlertTitle>
                          <h3 className="text-lg">Status</h3>
                        </AlertTitle>
                        <AlertDescription>This item has been sold.</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Properties</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableBody>
                        {['color', 'weight', 'metal', 'gemstone', 'measurement', 'condition', 'stamped']
                          .filter((key) => item.hasOwnProperty(key) && item[key])
                          .map((key) => {
                            return (
                              <TableRow>
                                <TableCell className="font-medium capitalize">{key}</TableCell>
                                <TableCell>{item[key]}</TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <div className="flex flex-row flex-wrap lg:flex-nowrap gap-10 mt-10 lg:mt-20">
            <div className="w-full lg:basis-8/12 xl:basis-9/12">
              <h1 className="text-3xl font-bold">Description</h1>
              <div className="w-full pb-10" dangerouslySetInnerHTML={{ __html: item.description }}></div>
              <Separator />
              <h1 className="text-3xl font-bold mt-10">Auction History</h1>
              {pastAuction.length == 0 ? (
                <p>This item has not appeared in any auction before.</p>
              ) : (
                <>
                  <p className="py-2">This item has appeared in {pastAuction.length} auctions</p>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pastAuction.map((a) => {
                        return (
                          <TableRow>
                            <TableCell className="font-medium">
                              <a href={`/auctions/${a.auctionSessionId}`}>{a.title}</a>
                            </TableCell>
                            <TableCell>{formatDate(new Date(a.startDate))}</TableCell>
                            <TableCell>{formatDate(new Date(a.endDate))}</TableCell>
                            <TableCell>{a.status}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </>
              )}
            </div>
            <div className="w-full lg:basis-4/12 xl:basis-3/12">
              {/* <Card>
                <CardHeader>
                  <CardTitle>Properties</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody>
                      {['color', 'measurement', 'weight', 'stamped', 'age', 'metal']
                        .filter((key) => item.hasOwnProperty(key) && item[key])
                        .map((key) => {
                          return (
                            <TableRow>
                              <TableCell className="font-medium capitalize">{key}</TableCell>
                              <TableCell>{item[key]}</TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  <i className="text-sm">
                    Please note that item evaluations are subject to error; we advise independent verification before
                    bidding.
                  </i>
                </CardFooter>
              </Card> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
