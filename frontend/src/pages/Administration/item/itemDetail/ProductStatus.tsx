import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ItemStatus } from "@/models/Item";

type ProductStatus = {
    status: ItemStatus;
};

export default function ProductStatus({ status }: ProductStatus) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Product Status</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6">
                    <div className="grid gap-3">
                        <Label htmlFor="status">Status</Label>
                        <Select defaultValue={ItemStatus.QUEUE}>
                            <SelectTrigger id="status" aria-label="Select status">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(ItemStatus).map((item: any) => {
                                    return <SelectItem value={item}>{item}</SelectItem>


                                }

                                )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
