"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import DropzoneComponent from "@/components/drop-zone/DropZoneComponent"

const FormSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    startDate: z.string(
        {
            message: "Start date is required.",
        }),
    endDate: z.string(
        {
            message: "End date is required.",
        }),
    attachments: z.any(),
})

export default function AuctionSessionCreate() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: "",
            startDate: "",
            endDate: "",
            attachments: [],

        },
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(data)
        toast.success("Auction session created")
    }

    


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6 p-3">
                {/* this is the title of the auction session. */}
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Auction Session" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is the title of the auction session.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex items-center justify-start gap-4" >
                    {/* This is the start date of the auction session. */}
                    <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Start Date</FormLabel>
                                <FormControl>
                                    <Input
                                        type="datetime-local" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is the date the auction session starts.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* This is the end date of the auction session. */}
                    <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>End Date</FormLabel>
                                <FormControl>
                                    <Input
                                        type="datetime-local" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is the date the auction session ends.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>


                {/* This is the attachments for the auction session. */}
                <FormField
                    control={form.control}
                    name="attachments"
                    render={({ field }) => (
                        <DropzoneComponent {...field} control={form.control} />
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}
