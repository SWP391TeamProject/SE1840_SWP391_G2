import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import React from "react";
import { Link } from "react-router-dom";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
export default function LandingPageCarousel() {
  return (
    <>
      <Carousel className="w-full flex justify-center content-center  bg-background text-foreground  "
        plugins={[
          Autoplay({
            delay: 3000,
            pauseOnHover: true,

          }),
        ]}
      >
        <CarouselContent>
          <CarouselItem>
            <section className="w-full flex justify-center items-center p-3 ">
              <div className="px-4 md:px-6 space-y-10 xl:space-y-3">
                <div className="grid max-w-[1300px] mx-auto gap-4 px-4 sm:px-6 md:px-10 md:grid-cols-2 md:gap-16">
                  <div>
                    <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                      Consign Your Jewelry
                    </h1>
                    <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                      Sell your rare and unique jewelry through our premier
                      online auction house.
                    </p>
                    <div className="space-x-4 mt-6">
                      <Button variant="default" className="w-fit" asChild>

                        <Link
                          to="/create-consignment"
                        >
                          Consign an Item
                        </Link>
                      </Button>

                    </div>
                  </div>
                  <div className="relative">
                    <Carousel className="w-full" plugins={[
                      Autoplay({
                        delay: 3000,
                      }),
                    ]}>
                      <CarouselContent>
                        <CarouselItem>
                          <img
                            alt="Hero"
                            className="mx-auto aspect-video overflow-hidden rounded-xl object-bottom sm:w-full lg:aspect-square"
                            height="550"
                            src="src\assets\thumnail1.jpg"
                            width="550"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                        </CarouselItem>
                        <CarouselItem>
                          <img
                            alt="Hero"
                            className="mx-auto aspect-video overflow-hidden rounded-xl object-bottom sm:w-full lg:aspect-square"
                            height="550"
                            src="src\assets\thumnail2.jpg"
                            width="550"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                        </CarouselItem>
                      </CarouselContent>
                      {/* <CarouselPrevious /> */}
                      {/* <CarouselNext /> */}
                    </Carousel>
                  </div>
                </div>
              </div>
            </section>
          </CarouselItem>
          <CarouselItem>
            <section className=" w-full flex justify-center items-center p-3">
              <div className="px-4 md:px-6 space-y-10 xl:space-y-16">
                <div className="mx-auto grid max-w-[1300px] gap-4 px-4 sm:px-6 md:px-10 md:grid-cols-2 md:gap-16">
                  <div>
                    <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                      Participate in Our Exclusive Auctions
                    </h1>
                    <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                      Participate in our exclusive auctions and discover rare
                      and unique jewelry you won't find anywhere else.
                    </p>
                    <div className="space-x-4 mt-6">
                      <Button variant="default" className="w-fit">
                        <Link
                          to="auctions"
                        >
                          Participate in Auction
                        </Link>
                      </Button>

                    </div>
                  </div>
                  <div className="relative">
                    <img
                      alt="Hero"
                      className="mx-auto aspect-video overflow-hidden rounded-xl object-bottom sm:w-full lg:aspect-square"
                      height="550"
                      src="src\assets\thumnail2.jpg"
                      width="550"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                  </div>
                </div>

              </div>
            </section>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </>
  );
}
