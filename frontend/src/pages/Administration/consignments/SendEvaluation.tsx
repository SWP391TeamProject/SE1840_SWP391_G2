import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
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
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchConsignmentByConsignmentId } from "@/services/ConsignmentService";
import { ConsignmentStatus } from "@/constants/enums";
const formSchema = z.object({
    accountId: z.number(),
    evaluation: z.string().min(10, {
        message: "Evaluation must be at least 10 characters long"

    }),
    price: z.string().regex(/^\d+(\.\d+)?$/, {
        message: "Price must be a number"
    }).min(2, {
        message: "Price must be at least 10"
    }),
    
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
            files: [],
            evaluation: "",
            price: '0',
        },
    });
    const { errors } = form.formState;

    useEffect(() => {
        // console.log(param);
        fetchConsignmentByConsignmentId(consignmentParent.consignmentId).then((res) => {
            console.log(res.data);
            setConsignment(res.data);
            form.setValue('consignmentId', res.data.consignmentId);
        }).catch((error) => {
            console.log(error);
            toast.error(error.response.data.message,{
                position:"bottom-right",
            });
        })
    }, []);
    // 1. Define your form.

    const onSubmit = (data: z.infer<typeof formSchema>) => {

        setIsLoading(true);
        // Remove FormData creation and file handling
        if (consignment?.status === ConsignmentStatus.IN_INITIAL_EVALUATION) {
            createInitialEvaluation(data).then((res) => {
                toast.success("Evaluation sent successfully",{
                    position:"bottom-right",
                });
                setOpen(false);
                console.log(res);
                setIsLoading(false);

            }).catch((error) => {
                toast.error(error.response.data.message,{
                    position:"bottom-right",
                });
                setOpen(true);
                setIsLoading(false);

            })
        }
        else {

            createFinalEvaluation(data).then((res) => {
                toast.success("Evaluation sent successfully",{
                    position:"bottom-right",
                });
                setOpen(false);
                console.log(res);
                setIsLoading(false);


            }).catch((error) => {
                toast.error(error.response.data.message,{
                    position:"bottom-right",
                });
                setOpen(true);
                setIsLoading(false);

            })
        }
        console.log(data);
    };

    return (
        
            <AlertDialog open={open} onOpenChange={setOpen}  >
                <AlertDialogTrigger asChild>
                    <Button variant="default">Send Evaluation</Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="w-80 sm:w-full  sm:max-w-lg max-h-fit" >
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                {consignmentParent && consignmentParent?.status === 'IN_INITIAL_EVALUATION' ? 'Initial' : 'Final'} Evaluation Form
                            </h1>
                            <div>
                                <p className=" text-gray-500 dark:text-gray-400">
                                    Fill out the form below to submit your evaluation
                                </p>
                            </div>
                        </AlertDialogTitle>
                    </AlertDialogHeader>

                    <AlertDialogDescription>
                        <div key="1" className=" max-w-full  mx-auto p-2   max-h-fit">

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                                    <input type="hidden" {...form.register('accountId')} />
                                    <input type="hidden" {...form.register('consignmentId')} />

                                    {/* <FormField
                                        control={form.control}
                                        name="consignmentId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        type="hidden"
                                                        readOnly defaultValue={consignment?.consignmentId} {...field} />
                                                </FormControl>

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    /> */}
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

                                                <FormMessage>{errors.evaluation?.message}</FormMessage>

                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{consignmentParent?.status === 'IN_INITIAL_EVALUATION' ? 'Initial' : 'Final'} Evaluation Price:</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="enter price"  {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <ScrollArea className="h-[100px] min-w-[350px] rounded-md border p-4">
                                        <FormField
                                            control={form.control}
                                            name="files"
                                            render={({ field }) => (
                                                <DropzoneComponent {...field} />
                                            )}
                                        />
                                    </ScrollArea>

                                    {/* <DropzoneComponent /> */}
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            {isLoading ?
                                                <Button variant={"destructive"} type="submit" className="w-[150px]" disabled>
                                                    <Loader2 className="animate-spin" />
                                                    Submitting...
                                                </Button>
                                                :

                                                <Button variant={"destructive"} type="submit" className="w-[150px]" onClick={() => {
                                                    if (form.formState.isValid) {
                                                        console.log(form.getValues())
                                                        onSubmit(form.getValues()); // Wait for onSubmit to complete
                                                    } else {
                                                        console.log(form.getValues())
                                                        console.log(form.formState) // Log the errors
                                                        toast.error("Please fill out the form correctly",{
                                                            position:"bottom-right",
                                                        });
                                                        setOpen(true);
                                                    }
                                                }}>

                                                    Submit
                                                </Button>
                                            }
                                    </AlertDialogFooter>
                                </form>
                            </Form>
                        </div>


                    </AlertDialogDescription>

                </AlertDialogContent>
            </AlertDialog>


    );
}
