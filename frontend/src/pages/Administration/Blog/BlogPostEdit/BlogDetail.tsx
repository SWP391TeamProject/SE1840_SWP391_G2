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


export default function BlogDetail({ ...props }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Blog Details</CardTitle>
                <CardDescription>
                    Fill in the details of the product you want to add.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6">
                    <h4 className="scroll-m-5 text-xl font-semibold tracking-tight">
                       Author:
                    </h4>
                    <p className="leading-7 [&:not(:first-child)]:mt-6">
                        {props.blog.author.nickname} #{props.blog.author.id}
                    </p>
                    <FormField
                        control={props.form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="enter title here" defaultValue={props?.title} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={props.form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Content</FormLabel>
                                <FormControl>
                                    <TextEditor placeholder="Enter content here..." {...field} />
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
