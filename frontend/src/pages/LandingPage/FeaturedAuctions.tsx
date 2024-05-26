import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { fetchAllItems } from "@/services/ItemService";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export default function FeaturedAuctions() {
  const [featuredAuctions, setFeaturedAuctions] = React.useState(null);

  useEffect(() => {
    fetchAllItems().then((data) => {
      console.log(data.content);
      setFeaturedAuctions(data.content);
    });
  }, []);

  return (
    <>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-blue-700">
        <div className="w-full flex justify-center">
          <div className="w-screen mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-1 md:gap-12 lg:max-w-5xl lg:grid-cols-1 ">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Featured Auctions
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Discover our latest and most exclusive auction items.
              </p>
            </div>
            <Carousel className="w-full  mx-auto">
              <CarouselContent>
                {featuredAuctions &&
                  featuredAuctions.map((item) => (
                    <CarouselItem className="basis-1/3 ">
                      <Card className="w-[300px] h-full">
                        <CardHeader>
                          <img
                          
                            alt="Auction Item"
                            className="rounded-t-lg object-cover"
                            height="225"
                            src="/placeholder.svg"
                            style={{
                              aspectRatio: "400/225",
                              objectFit: "cover",
                            }}
                            width="400"
                          />
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">
                              {item.name}
                            </h3>
                            <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium dark:bg-gray-800">
                              {item.reservedPrice}
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Ends in 3 days
                            </div>
                            <Link
                              className="inline-flex h-8 items-center justify-center rounded-md bg-gray-900 px-4 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                              to="#"
                            >
                              Bid Now
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </section>
    </>
  );
}
