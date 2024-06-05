import { Upload } from "lucide-react"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"



export default function ProductImageGallery() {
    return (
        <Card className="overflow-hidden  w-full h-[400px]">
            <CardHeader>
                <CardTitle>Product Images</CardTitle>
                <CardDescription>
                    Lipsum dolor sit amet, consectetur adipiscing elit
                </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center">
                <Carousel className="w-full max-w-xs">
                    <CarouselContent className="w-full">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <CarouselItem key={index} className="basis-1/2 ">

                                <img
                                    alt="Product image"
                                    className="aspect-square object-cover"
                                    src='https://placehold.co/400'
                                />

                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>

            </CardContent>
        </Card>
    )
}
