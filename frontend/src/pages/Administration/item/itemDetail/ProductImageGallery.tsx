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



export default function ProductImageGallery({...props}) {
    return (
        <Card className="overflow-hidden  w-full h-[400px]">
            <CardHeader>
                <CardTitle>Item Images</CardTitle>
                <CardDescription>
                    Upload images of the product.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center">
                <Carousel className="w-full max-w-xs">
                    <CarouselContent className="w-full">
                        {props.images && props.images?.map((image) => (
                            <CarouselItem key={image.attachmentId} className="basis-1/2 ">

                                <img
                                    alt="Product image"
                                    className="aspect-square object-cover"
                                    src={image.link}
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
