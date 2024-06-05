import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea"

type ProductDetail = {
    name: string;
    description: string;
};

export default function ProductDetail({ name, description }: ProductDetail) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Product Details</CardTitle>
                <CardDescription>
                    Fill in the details of the product you want to add.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6">
                    <div className="grid gap-3">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            className="w-full"
                            defaultValue={name}
                        />
                    </div>
                    <Label htmlFor="description">Description</Label>
                    <div className="grid gap-3">
                        <ScrollArea className="h-[170px]">
                            <div dangerouslySetInnerHTML={{ __html: description }} />
                        </ScrollArea>


                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
