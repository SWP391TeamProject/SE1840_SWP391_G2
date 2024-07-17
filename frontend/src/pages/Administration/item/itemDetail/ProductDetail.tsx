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
import {Item} from "@/models/Item.ts";
import {UseFormReturn} from "react-hook-form";

export default function ProductDetail(props: {
  item: Item,
  form: UseFormReturn
}) {
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
                  <div className="flex justify-content-center gap-5">
                    <p className="font-semibold tracking-tight">
                      Owner:
                    </p>
                    <p>
                      {props.item.owner.nickname} (#{props.item.owner.accountId})
                    </p>
                  </div>
                    <FormField
                        control={props.form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Enter name here" {...field} />
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
