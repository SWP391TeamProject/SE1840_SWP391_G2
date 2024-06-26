import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { CheckIcon } from "lucide-react";

export default function CustomerDashboard() {



  return (
    <>
      <div className=" gap-2 flex flex-col justify-center items-start text-foreground dark:bg-black">
        <section className="body-font h-96 p-20">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Welcome back, Customer
          </h2>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            We will reach you within 2 businesses days after submitting your consignments request
          </p>
        </section>

        <section className=" body-font h-96 bg-red-200 w-full p-20 dark:bg-red-800">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Your next steps
          </h2>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            It's time to review a couple of current settings.
          </p>
          <div className="w-full justify-center items-center">
            <Carousel className="w-full min-w-xs overflow-hidden ">
              <CarouselContent className="-ml-1">
                {Array.from({ length: 3 }).map((_, index) => (
                  <CarouselItem key={index} className="basis1 md:basis-1/3">
                    <Card className="w-[200px] h-[200px] aspect-square">
                      <CardHeader>
                        <CheckIcon color="green" className="h-6 w-6 " />
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h2 className="text-lg font-semibold">Verify your email address</h2>
                        </div>

                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}             

              </CarouselContent>

            </Carousel>
          </div>


        </section>

      </div>

    </>
  )
}
