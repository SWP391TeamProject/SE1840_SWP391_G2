import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IConsignmentDetail } from "@/constants/interfaces"

interface consignmentDetaiDialog {
    consignmentDetail: IConsignmentDetail;
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
                    <DialogDescription>
                        Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                {consignmentDetail.consignmentDetail.attachments.map((attachment, index) => {
                    return (
                        <div key={index} className="flex flex-row justify-start gap-1 w-full flex-wrap">
                            {/* <img
                                alt="Product image"
                                className="aspect-square w-full rounded-md object-cover"
                                height="300"
                                src={attachment.link ? attachment.link : "/placeholder.svg"}
                                width="300"
                            /> */}
                            <img
                                alt="Product image"
                                className="aspect-square  rounded-md object-cover"
                                height="300"
                                src={"https://th.bing.com/th/id/OIP.fPK-QgFGKdMVMMmPArY44gHaK2?rs=1&pid=ImgDetMain"}
                                width="300"
                            />
                            <img
                                alt="Product image"
                                className="aspect-square  rounded-md object-cover"
                                height="300"
                                src={"https://th.bing.com/th/id/OIP.fPK-QgFGKdMVMMmPArY44gHaK2?rs=1&pid=ImgDetMain"}
                                width="300"
                            />
                            <img
                                alt="Product image"
                                className="aspect-square  rounded-md object-cover"
                                height="300"
                                src={"https://th.bing.com/th/id/OIP.fPK-QgFGKdMVMMmPArY44gHaK2?rs=1&pid=ImgDetMain"}
                                width="300"
                            />

                        </div>
                    )
                })}
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
