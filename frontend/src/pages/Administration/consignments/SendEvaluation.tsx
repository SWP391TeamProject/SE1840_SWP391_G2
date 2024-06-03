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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { UploadIcon } from "lucide-react";
import { getCookie } from "@/utils/cookies";
import { API_SERVER } from "@/constants/domain.ts";
import { useDropzone } from "react-dropzone";
import { createConsignmentService, fetchConsignmentByConsignmentId } from "@/services/ConsignmentService";
import DropzoneComponent from "@/components/drop-zone/DropZoneComponent";
import Consignment from "@/models/consignment";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { createFinalEvaluation, createInitialEvaluation } from "@/services/ConsignmentDetailService";
const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];
const formSchema = z.object({
    accountId: z.number(),
    evaluation: z.string(),
    price: z.string(),
    consignmentId: z.number(),
    files: z.any()
});

export default function SendEvaluationForm() {
    const param = useParams();

    const [consignment, setConsignment] = useState<Consignment | undefined>(undefined);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            accountId: JSON.parse(getCookie("user"))?.id,
            evaluation: "",
            price: '0.0',
            consignmentId: parseInt(param.id),
            files: []
        },
    });
    useEffect(() => {
        console.log(param);
        // dispatch(setCurrentConsignment(param.id));
        fetchConsignmentByConsignmentId(param.id).then((res) => {
            console.log(res.data.content);
            setConsignment(res.data.content[0]);
            form.setValue('consignmentId', res.data.content[0].consignmentId);
        }).catch((error) => {
            console.log(error);
            toast.error(error.response.data.message);
        })
    }, []);
    // 1. Define your form.
    
    const onSubmit = (data: z.infer<typeof formSchema>) => {
        // Remove FormData creation and file handling
        if(consignment?.status === 'IN_INITIAL_EVALUATION'){
            createInitialEvaluation(data).then((res) => {
                console.log(res);
            });
        }
        else{
            createFinalEvaluation(data).then((res) => {
                console.log(res);
            });
        }
        console.log(data);
    };

    return (
        <div key="1" className="max-w-6xl  mx-auto p-4 sm:p-6 md:p-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    {consignment?.status === 'IN_INITIAL_EVALUATION' ? 'Initial' : 'Final'} Evaluation Form
                </h1>
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
                        name="consignmentId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Consignment Id</FormLabel>
                                <FormControl>
                                    <Input readOnly placeholder={param.id} {...field} />
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
                        name="files"
                        render={({ field }) => (
                            <DropzoneComponent {...field} />
                        )}
                    />

                    {/* <DropzoneComponent /> */}

                    <Button variant={"destructive"} type="submit">
                        Submit
                    </Button>
                </form>
            </Form>
        </div>
    );
}
