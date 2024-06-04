import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { getCookie } from "@/utils/cookies";
import DropzoneComponent from "@/components/drop-zone/DropZoneComponent";
import Consignment from "@/models/consignment";
import { toast } from "react-toastify";
import { createFinalEvaluation, createInitialEvaluation } from "@/services/ConsignmentDetailService";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { on } from "events";
import { Loader2 } from "lucide-react";
const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];
const formSchema = z.object({
    accountId: z.number(),
    evaluation: z.string().min(10),
    price: z.string(),
    consignmentId: z.number(),
    files: z.any()
}).required({
    accountId: true,
    evaluation: true,
    price: true,
    consignmentId: true,
    files: true
});



export default function SendEvaluationForm({ consignmentParent }: { consignmentParent: Consignment }) {
    // const param = useParams();

    const [consignment, setConsignment] = useState<Consignment | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);

    const [open, setOpen] = React.useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            accountId: JSON.parse(getCookie("user"))?.id,
            consignmentId: consignmentParent.consignmentId,
            files: []
        },
    });
    useEffect(() => {
        // console.log(param);
        setConsignment(consignment);
        // dispatch(setCurrentConsignment(param.id));
        // fetchConsignmentByConsignmentId(param.id).then((res) => {
        //     console.log(res.data.content);
        //     setConsignment(res.data.content[0]);
        //     form.setValue('consignmentId', res.data.content[0].consignmentId);
        // }).catch((error) => {
        //     console.log(error);
        //     toast.error(error.response.data.message);
        // })
    }, []);
    // 1. Define your form.

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        // Remove FormData creation and file handling
        if (consignment?.status === 'IN_INITIAL_EVALUATION') {
            createInitialEvaluation(data).then((res) => {
                toast.success("Evaluation sent successfully");
                setOpen(false);
                console.log(res);
                setIsLoading(false);

            }).catch((error) => {
                toast.error(error.response.data.message);
                setOpen(true);
                setIsLoading(false);

            })
        }
        else {
            createFinalEvaluation(data).then((res) => {
                toast.success("Evaluation sent successfully");
                setOpen(false);
                console.log(res);
                setIsLoading(false);


            }).catch((error) => {
                toast.error(error.response.data.message);
                setOpen(true);
                setIsLoading(false);

            })
        }
        console.log(data);
    };

    return (
        <>
            <AlertDialog open={open} onOpenChange={setOpen}  > 
                <AlertDialogTrigger asChild>
                    <Button variant="default">Send Evaluation</Button>
                </AlertDialogTrigger>
                <AlertDialogContent  className="max-h-[800px] w-4/5 overflow-hidden bg-red-600 " >
                    <AlertDialogHeader>
                        <AlertDialogTitle>    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            {consignment?.status === 'IN_INITIAL_EVALUATION' ? 'Initial' : 'Final'} Evaluation Form
                        </h1></AlertDialogTitle>
                    </AlertDialogHeader>

                    <AlertDialogDescription>
                        <div key="1" className="max-w-6xl  mx-auto p-4 sm:p-6 md:p-8">
                            <div>

                                <p className="mt-2 text-gray-500 dark:text-gray-400">
                                    Fill out the form below to submit your evaluation
                                </p>
                            </div>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                    <FormField
                                        control={form.control}
                                        name="accountId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>accountId</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        readOnly
                                                        defaultValue={JSON.parse(getCookie("user"))?.id}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                           <FormField
                                        control={form.control}
                                        name="consignmentId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Consignment Id</FormLabel>
                                                <FormControl>
                                                    <Input readOnly defaultValue={consignment?.consignmentId} {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    this is the id of the consignment you are evaluating
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="evaluation"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Your Evaluation:</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="enter your evaluation here"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{consignment?.status === 'IN_INITIAL_EVALUATION' ? 'Initial' : 'Final'} Evaluation Price:</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="enter price" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                             

                                    <FormField
                                        control={form.control}
                                        name="files"
                                        render={({ field }) => (
                                            <DropzoneComponent {...field} />
                                        )}
                                    />
                                    {/* <DropzoneComponent /> */}
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction asChild>
                                            {isLoading ?
                                                <Button variant={"destructive"} type="submit" className="w-[150px]"  disabled>
                                                    <Loader2 className="animate-spin"/>
                                                    Submitting...
                                                </Button>
                                                :

                                                <Button variant={"destructive"} type="submit" className="w-[150px]" onClick={(event) => {
                                                    event.preventDefault();
                                                    if (form.formState.isValid) {
                                                        console.log(form.getValues())
                                                        onSubmit(form.getValues());
                                                    } else {
                                                        console.log(form.getValues())
                                                        toast.error("Please fill out the form correctly");
                                                        setOpen(true);
                                                    }
                                                }}>

                                                    Submit
                                                </Button>
                                            }
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </form>
                            </Form>
                        </div>


                    </AlertDialogDescription>

                </AlertDialogContent>
            </AlertDialog>


        </>
    );
}
