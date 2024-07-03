import DropzoneComponent from "@/components/drop-zone/DropZoneComponent";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getCookie } from "@/utils/cookies";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";

import { z } from "zod"
const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];


const formSchema = z.object({
    frontImage: z
        .any()
        // .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
        .refine(
            (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
            "Only .jpg, .jpeg, .png and .webp formats are supported."
        ),

    backImage: z
        .any()
        // .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
        .refine(
            (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
            "Only .jpg, .jpeg, .png and .webp formats are supported."
        )



})

export default function KycVerification() {
    const [isLoading, setIsLoading] = React.useState(false);

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            frontImage: "",
            backImage: ""
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        setIsLoading(true)


        axios.post("https://localhost:8080/api/kyc/verify", values, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization' : 'Bearer ' + getCookie('token')
            },
        })
        .then((res) => {
            console.log("success");
            console.log(res.data);
            setIsLoading(false);
            // Handle success...
        })
        .catch((error) => {
            setIsLoading(false);
            // Handle error...
        });

        console.log(values)
    }


    return <>
        {/* <KycVerification/> */}



        <Card>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle>Profile Details</CardTitle>
                        <CardDescription>
                            View and manage your personal information.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <FormField
                                    control={form.control}
                                    name="frontImage"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Front Image</FormLabel>
                                            <FormControl>
                                                <DropzoneComponent {...field} maxFiles={1} fieldMessage="
                                                Drag 'n' drop your front identity images here, or click to select images
                                                " />

                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="backImage"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Back Image</FormLabel>
                                            <FormControl>
                                                <DropzoneComponent {...field} maxFiles={1}
                                                    fieldMessage="Drag 'n' drop your front identity images here, or click to select images"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid gap-2">

                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <div className="flex gap-4">
                            {isLoading
                                ?
                                <Button disabled>
                                    <Loader2
                                        className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </Button>
                                : <Button
                                    type="submit"
                                >Save details</Button>}
                        </div>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    </>;
}
