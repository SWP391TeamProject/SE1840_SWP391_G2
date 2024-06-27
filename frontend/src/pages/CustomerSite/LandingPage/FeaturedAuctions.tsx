import CountDownTime from "@/components/countdownTimer/CountDownTime";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { fetchFeaturedAuctionSessions } from "@/services/AuctionSessionService";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Autoplay from "embla-carousel-autoplay";
import { set } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import LoadingAnimation from "@/components/loadingAnimation/LoadingAnimation";

export default function FeaturedAuctions() {
  const date = new Date();

  const [featuredAuctions, setFeaturedAuctions] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const getDaysLeft = (endDate: Date) => {
    const difference = endDate.getTime() - new Date().getTime();
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    return days;
  };

  useEffect(() => {
    setIsLoading(true);
    fetchFeaturedAuctionSessions().then((data) => {
      console.log(data);
      // setFeaturedAuctions(data.data.?content.filter((item) => item.status == "FEATURED"));
      setFeaturedAuctions(data?.data?.content);
      setIsLoading(false);
    });
  }, []);

  return (
    <>
      <section className="w-full max-w-xs mx-auto bg-background text-foreground flex justify-center  ">
        <div className="">
          <div className="space-y-4 text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Featured Auctions
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Discover our most exclusive auction.
            </p>
          </div>
          <Carousel className="w-full max-w-xs md:max-w-screen-md xl:max-w-5xl "
            plugins={[
              Autoplay({
                delay: 4000,
                pauseOnHover: true,

              }),
            ]}
            opts={{
              align: "center",
            }}  >
            <CarouselContent className="-ml-2 md:-ml-4"  >
              {isLoading && (
                <>
                  <LoadingAnimation message="loading..." />
                  {Array.from({ length: 3 }).map((_, index) => (
                    <CarouselItem className="pl-2 md:pl-4 lg:pl-4  basis-full md:basis-1/2 lg:basis-1/3" key={index}>
                      <Card className="w-72 lg:w-64  h-full ">
                        <CardHeader>
                          <Skeleton
                            className="rounded-t-lg object-cover w-full h-56"
                          />
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">
                              Loading...
                            </h3>
                            <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium dark:bg-gray-800">
                              Loading...
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Loading...
                            </div>
                            <Button variant="default" asChild>
                              <Link
                                to="/auctions"
                              >
                                Bid Now
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </>
              )
              }
              {featuredAuctions &&
                featuredAuctions.map((item) => (
                  <CarouselItem className="pl-2 md:pl-4 lg:pl-4  basis-full md:basis-1/2 lg:basis-1/3 " key={item.auctionSessionId}>
                    <Card className="w-72 lg:w-64 h-full ">
                      <CardHeader>
                        <img

                          alt="Auction Item"
                          className="rounded-t-lg object-cover w-full h-56"
                          src={item.attachments.length > 0 ? item.attachments[0].link : "https://placehold.co/400"}
                          style={{
                            aspectRatio: "400/225",
                            objectFit: "cover",
                          }}

                        />
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">
                            {item.title}
                          </h3>
                          <div className="inline-block rounded-lg bg-opacity-60 bg-black  px-3 py-1 text-sm font-medium mx-auto absolute -translate-y-14 translate-x-2">
                            {item.startDate && new Date(item.startDate) > date ?
                              <>
                                Starts in <CountDownTime end={new Date(item.startDate)}></CountDownTime>
                              </> :
                              item.endDate && new Date(item.endDate) > date
                                ? <>
                                  Ends in <CountDownTime end={new Date(item.endDate)}></CountDownTime>
                                </> :
                                <div className="text-pink-500 dark:text-pink-400 font-semibold">
                                  Auction Ended
                                </div>
                            }
                          </div>
                        </div>

                        <div className="flex items-center justify-between">

                          <Button variant="default" asChild>
                            <Link
                              to={`auctions/${item.auctionSessionId}`}
                            >
                              Bid Now
                            </Link>
                          </Button>

                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex lg:flex" />
            <CarouselNext className="hidden  md:flex lg:flex" />
          </Carousel>
        </div>
      </section>
    </>
  );
}
