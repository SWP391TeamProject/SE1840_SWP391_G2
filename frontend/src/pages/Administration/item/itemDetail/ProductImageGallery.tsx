import DropzoneComponent from '@/components/drop-zone/DropZoneComponent';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { FormField } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Item } from '@/models/Item.ts';
import { XIcon } from 'lucide-react';

export default function ProductImageGallery({ ...props }) {
  const handleDeleteImage = (imageId: number) => {
    props.form.control._formValues.deletedFiles.push(imageId);
    document.getElementById('' + imageId).style.display = 'none';
    console.log(props.form);
  };

  return (
    // <Card className="overflow-hidden  w-full h-[400px]">
    //   <CardHeader>
    //     <CardTitle>Item Images</CardTitle>
    //     <CardDescription>Upload images of the product.</CardDescription>
    //   </CardHeader>
    //   <CardContent className="flex justify-center items-center">
    //     <Carousel className="w-full max-w-xs">
    //       <CarouselContent className="w-full">
    //         {props.item.attachments &&
    //           props.item.attachments.map((image) => (
    //             <CarouselItem key={image.attachmentId} className="basis-1/2 ">
    //               <img alt="Product image" className="aspect-square object-cover" src={image.link} />
    //             </CarouselItem>
    //           ))}
    //       </CarouselContent>
    //       <CarouselPrevious />
    //       <CarouselNext />
    //     </Carousel>
    //   </CardContent>
    // </Card>
    <Card className="overflow-hidden  w-full h-[400px]">
    <CardHeader>
      <CardTitle>Item Images</CardTitle>
      <CardDescription>Upload images of the product.</CardDescription>
    </CardHeader>
    <CardContent className="flex justify-center items-center flex-wrap">
      {props.item.attachments.length != 0 && (
        <Carousel className="w-full max-w-xs">
          <CarouselContent className="w-full">
            {props.item.attachments?.map((image: any) => (
              <CarouselItem key={image.attachmentId} className="basis-1/3 relative group" id={image.attachmentId}>
                <img
                  title="Blog-image"
                  alt={image.attachmentId}
                  className="aspect-square object-cover"
                  src={image.link}
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black transition-colors"
                  onClick={() => {
                    handleDeleteImage(image.attachmentId);
                  }}
                >
                  <XIcon className="w-4 h-4" />
                  <span className="sr-only">Delete image</span>
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* <CarouselPrevious />
          <CarouselNext /> */}
        </Carousel>
      )}
      <ScrollArea className="h-[200px] mt-8">
        <FormField
          control={props.form.control}
          name="files"
          render={({ field }) => <DropzoneComponent {...field} />}
        />
      </ScrollArea>
    </CardContent>
  </Card>
  );
}
