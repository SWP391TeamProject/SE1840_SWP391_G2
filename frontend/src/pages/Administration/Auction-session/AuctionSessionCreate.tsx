import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import DropzoneComponent from "@/components/drop-zone/DropZoneComponent"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { createAuctionSession } from "@/services/AuctionSessionService"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { ConfirmationDialog } from "@/components/confirmation/confirmation-dialog"
import { formatDate } from "@/lib/utils"
import { showErrorToast } from "@/lib/handle-error"

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
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [showTrigger, setShowTrigger] = useState(false);
    const handleConfirmed = (values: z.infer<typeof FormSchema>) => {
        setIsConfirmed(true);
        setShowTrigger(false);
        createAuctionSession(values).then(() => {
            setIsSubmitting(false)
            toast.success("Auction session created successfully.", {
                
            })

        })
            .catch((err) => {
                setIsSubmitting(false)
                showErrorToast(err)
            })
    }
    const confirm = () => {
        setIsConfirmed(true);
        setShowTrigger(false);
        setIsSubmitting(true);
    }


    useEffect(() => {
        if (isConfirmed) {
            if (form.getValues) {
                const values = form.getValues();
                handleConfirmed(values);
                setIsConfirmed(false);
            } else {
                setIsSubmitting(false)
            }
        }

    }, [isConfirmed, form.getValues])

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(data)
        console.log("validated")
        setShowTrigger(true);

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
                                <FormLabel>End Date</FormLabel>
                                <FormControl>
                                    <input type="datetime-local" className="cursor-pointer bg-background text-foreground" {...field} />
                                </FormControl>
                                <FormDescription>
                                    this is the end date of the auction session
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
            <ConfirmationDialog
                open={showTrigger}
                description="Are you sure to create this auction session?"
                onOpenChange={setShowTrigger}
                title="Are you sure to create this auction session?"
                message={form.formState.isDirty
                    ? `Auction Session ${form.getValues()?.title || ''} will be created. Start Date: ${form.getValues()?.startDate ? formatDate(form.getValues()?.startDate) : 'N/A'} End Date: ${form.getValues()?.endDate ? formatDate(form.getValues().endDate) : 'N/A'}`
                    : ''} label="Confirm"
                onSuccess={confirm} />

        </Form>
    )
}
