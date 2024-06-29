
import DropzoneComponent from "@/components/drop-zone/DropZoneComponent"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { FormField } from "@/components/ui/form"
import { ScrollArea } from "@/components/ui/scroll-area"
import { XIcon } from "lucide-react"



export default function BlogImageGallery({ ...props }) {
    const handleDeleteImage = (imageId: number) => {
        console.log(props.form);
        props.form.control._formValues.deletedFiles.push(imageId);
        document.getElementById(""+imageId)?.remove();
    }
    return (
        <Card className="overflow-hidden  w-full h-[400px]">
            <CardHeader>
                <CardTitle>Blog Images</CardTitle>
                <CardDescription>
                    Upload images of the product.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center flex-wrap">
                <Carousel className="w-full max-w-xs">
                    <CarouselContent className="w-full">
                        {props.images?.map((image:any) => (
                            <CarouselItem key={image.attachmentId} className="basis-1/2 relative group" id={image.attachmentId}>
                                <img
                                    title="Blog-image"
                                    alt={image.attachmentId}
                                    className="aspect-square object-cover"
                                    src={image.link}
                                />
                                <button type="button"
                                className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black transition-colors"
                                onClick={()=>{handleDeleteImage(image.attachmentId)}}>
                                    <XIcon className="w-4 h-4" />
                                    <span className="sr-only">Delete image</span>
                                </button>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
                <ScrollArea className="h-[200px] mt-8">
                    <FormField
                        control={props.form.control}
                        name="files"
                        render={({ field }) => (
                            <DropzoneComponent {...field} />
                        )}
                    />

                </ScrollArea>
            </CardContent>
        </Card>
    )
}
