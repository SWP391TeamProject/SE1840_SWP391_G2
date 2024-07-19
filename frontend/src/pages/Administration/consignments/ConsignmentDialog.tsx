import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Consignment } from '@/models/newModel/consignment';

interface consignmentDialog {
  consignment: Consignment;
}

export default function ConsignmentDialog(consignment: consignmentDialog) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View Attachments</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[660px]">
        <DialogHeader>
          <DialogTitle>STATUS: {consignment?.consignment?.status}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="w-full h-96">
          <div className="flex flex-row justify-start  w-full flex-wrap">
            {consignment?.consignment?.attachments?.map((attachment) => {
              return (
                <img
                  key={attachment.attachmentId}
                  alt="Product"
                  className="aspect-square rounded-md object-cover basis-1/3"
                  height="300"
                  src={attachment.link}
                  width="300"
                />
              );
            })}
          </div>
        </ScrollArea>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
