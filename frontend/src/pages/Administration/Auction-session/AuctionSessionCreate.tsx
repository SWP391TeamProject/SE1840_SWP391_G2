import { zodResolver } from "@hookform/resolvers/zod"
import { set, useForm } from "react-hook-form"
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
import DropzoneComponent from "@/components/drop-zone/DropZoneComponent"
import { toast } from "react-toastify"
import { createAuctionSession } from "@/services/AuctionSessionService"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"
import { CalendarIcon, Loader2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"

const FormSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    startDate: z.string(),
    endDate: z.string(),
    files: z.any(),
})

export default function AuctionSessionCreate() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: "",
            files: [],

        },
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        setIsSubmitting(true)
        console.log(data)
        createAuctionSession(data).then(() => {
            setIsSubmitting(false)
            form.reset()
            toast.success("Auction session created successfully.", {
                position: "bottom-right",
            })

        })
            .catch((err) => {
                setIsSubmitting(false)
                toast.error('An error occurred while creating the auction session.', {
                    position: "bottom-right",
                })
            })
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
                            <FormItem className="flex flex-col">
                                <FormLabel>Start Date</FormLabel>
                                <FormControl>
                                    <input type="datetime-local" className="cursor-pointer bg-background text-foreground" {...field} />
                                </FormControl>
                                <FormDescription>
                                    this is the start date of the auction session
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
                            <FormItem className="flex flex-col">
                                <FormLabel>Start Date</FormLabel>
                                <FormControl>
                                    <input type="datetime-local" className="cursor-pointer bg-background text-foreground" {...field} />
                                </FormControl>
                                <FormDescription>
                                    this is the start date of the auction session
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>


                {/* This is the attachments for the auction session. */}
                <ScrollArea className="w-full h-64 overflow-hidden">
                    <FormField
                        control={form.control}
                        name="files"
                        render={({ field }) => (
                            <DropzoneComponent {...field} control={form.control} />
                        )}
                    />
                </ScrollArea>
                {isSubmitting
                    ? <Button variant="default" disabled>
                        <Loader2 className="animate-spin" size={24} />
                        Submitting...</Button>
                    : <Button type="submit" variant="default">Submit</Button>
                }
            </form>
        </Form>
    )
}
