import {Dialog, DialogContent,} from '@/components/ui/dialog.tsx';
import {Attachment} from '@/models/Attachment.ts';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel.tsx"
import {useState} from "react";

interface consignmentAttachmentGallery {
  attachments: Attachment[];
}

export default function ConsignmentAttachmentGallery({attachments}: consignmentAttachmentGallery) {
  const [open, setOpen] = useState(false);
  const [img, setImg] = useState<Attachment>();

  return (
    <>
      <Carousel
        opts={{
          align: "start",
        }}
        className="mx-8"
      >
        <CarouselContent>
          {attachments?.map((attachment) => (
            <CarouselItem key={attachment.attachmentId}
                          className="md:basis-1/2 lg:basis-1/3">
              <img
                key={attachment.attachmentId}
                alt="Product"
                className="aspect-square rounded-md object-cover basis-1/3 border border-gray-300"
                height="300"
                src={attachment.link}
                width="300"
                onClick={() => {
                  setImg(attachment);
                  setOpen(true);
                }}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious/>
        <CarouselNext/>
      </Carousel>

      {img &&
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <img
              key={img.attachmentId}
              alt="Product"
              className="aspect-square rounded-md object-cover"
              src={img.link}
            />
          </DialogContent>
        </Dialog>}
    </>
  );
}
