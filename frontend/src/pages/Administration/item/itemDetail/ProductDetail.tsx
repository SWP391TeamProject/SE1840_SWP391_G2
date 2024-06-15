import TextEditor from "@/components/component/TextEditor";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input"


export default function ProductDetail({ ...props }) {
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
                    <h4 className="scroll-m-5 text-xl font-semibold tracking-tight">
                       Owner name:
                    </h4>
                    <p className="leading-7 [&:not(:first-child)]:mt-6">
                        {props.item.owner.nickname}
                    </p>
                    <FormField
                        control={props.form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>name</FormLabel>
                                <FormControl>
                                    <Input placeholder="enter name here" defaultValue={props?.name} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={props.form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <TextEditor placeholder="Enter description here..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                </div>
            </CardContent>
        </Card>
    )
}
