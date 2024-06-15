import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ConsignmentDetail } from "@/constants/interfaces";

interface consignmentDetaiDialog {
    consignmentDetail: ConsignmentDetail;
}
export default function ConsignmentDetailDialog(consignmentDetail: consignmentDetaiDialog) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">View Attachments</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[660px]">
                <DialogHeader>
                    <DialogTitle>STATUS: {consignmentDetail.consignmentDetail.status}</DialogTitle>
                </DialogHeader>
                <ScrollArea className="w-full h-96">
                    <div className="flex flex-row justify-start  w-full flex-wrap">

                        {consignmentDetail.consignmentDetail.attachments.map((attachment, index) => {
                            return (
                                <img
                                    key={index}
                                    alt="Product image"
                                    className="aspect-square rounded-md object-cover basis-1/3"
                                    height="300"
                                    src={attachment.link}
                                    width="300"
                                />
                            )
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
    )
}
