import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuctionSession } from "@/models/AuctionSessionModel";
import { useAppSelector } from "@/redux/hooks";
import { fetchAuctionSessionById, finishAuctionSession, terminateAuctionSession, updateAuctionSession } from "@/services/AuctionSessionService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Details from "./Details";
import Status from "./Status";
import TotalValuation from "./TotalValuation";
import NumberOfParticipants from "./NumberOfParticipants";

import { z } from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ItemsList from "./ItemsList";
import { Form } from "@/components/ui/form";
import { AuctionSessionStatus } from "@/models/newModel/auctionSession";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { inviteAll } from "@/services/NotificationService";
import { ConfirmationDialog } from "@/components/confirmation/confirmation-dialog";
import { ConfirmationButton } from "@/components/confirmation/confirmation-button";
import { getErrorMessage, showErrorToast } from "@/lib/handle-error";

const formSchema = z.object({
    auctionSessionId: z.number(),
    title: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    status: z.string(),
})
export default function AuctionSessionDetail() {

    const auctionSession = useAppSelector((state) => state.auctionSessions.currentAuctionSession);
    const [currentAuctionSession, setCurrentAuctionSession] = useState<AuctionSession | null>(null);
    const [isloading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [showTrigger, setShowTrigger] = useState(false);
    const { id } = useParams<{ id: string }>();

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // setIsLoading(true);
        // // Do something with the form values.
        // // ✅ This will be type-safe and validated.
        // console.log(values);
        // updateAuctionSession(values).then((res) => {
        //     console.log(res);
        //     toast.success('Auction Session Updated Successfully',{
        //         position:"bottom-right",
        //     });
        //     setIsLoading(false);
        // }).catch((err) => {
        //     toast.error(err.response.data.message,{
        //         position:"bottom-right",
        //     })
        //     setIsLoading(false)
        // });
        setShowTrigger(true);
    }

    useEffect(() => {
        if (!auctionSession || auctionSession.auctionSessionId != Number.parseInt(id)) {
            console.log(auctionSession);
            fetchAuctionSessionById(parseInt(id)).then((res) => {
                console.log(res);
                setCurrentAuctionSession(res?.data);
                form.reset({
                    auctionSessionId: res?.data.auctionSessionId,
                    title: res?.data.title,
                    startDate: res?.data.startDate,
                    endDate: res?.data.endDate,
                    status: res?.data.status,
                });
            });
        } else {
            setCurrentAuctionSession(auctionSession);
            // form.reset({...auctionSession});
            console.log(auctionSession);
        }
    }, [auctionSession]);

    const handleFinishSession = () => {
        const finishAuctionSessionPromise = finishAuctionSession(currentAuctionSession?.auctionSessionId)
        toast.promise(finishAuctionSessionPromise, {
            loading: 'Finishing Auction Session...',
            success:()=>{
                setIsLoading(false);
                return 'Auction Session Finished Successfully'},
            error: (error) => {
                setIsLoading(false);
                return getErrorMessage(error)
            },
        })



        // finishAuctionSession(currentAuctionSession?.auctionSessionId).then((res) => {
        //     console.log(res);
        //     toast.success('Auction Session Finished Successfully',{
        //         position:"bottom-right",
        //     });
        // }).catch((err) => {
        //     showErrorToast(err)

        // });
    }

    const handleTerminateSession = () => {
        console.log("here");
        const terminateAuctionSessionPromise = terminateAuctionSession(currentAuctionSession?.auctionSessionId)
        toast.promise(terminateAuctionSessionPromise, {
            loading: 'Terminating Auction Session...',
            success: (res) => {
                setIsLoading(false);
                return 'Auction Session Terminated Successfully'
            },
            error: (error) => {
                setIsLoading(false);
                return getErrorMessage(error)
            },
        })

        // terminateAuctionSession(currentAuctionSession?.auctionSessionId).then((res) => {
        //     console.log(res);
        //     toast.success('Auction Session Terminated Successfully',{
        //         position:"bottom-right",
        //     });
        // }).catch((err) => {
        //     showErrorToast(err)
        // });
    }

    const handleInviteAll = () => {
        console.log('here')
        const inviteAllPromise = inviteAll(currentAuctionSession?.auctionSessionId)
        toast.promise(inviteAllPromise, {
            loading: 'Inviting All Users...',
            success: (res) => {
                setIsLoading(false);
                return 'Invite All to Auction Successfully'
            },
            error: (error) => {
                setIsLoading(false);
                return getErrorMessage(error)
            },
        })

        // inviteAll(currentAuctionSession?.auctionSessionId).then((res) => {
        //     console.log(res);
        //     toast.success(`Invite All to Auction ${currentAuctionSession?.auctionSessionId} Successfully`,{
        //         position:"bottom-right",
        //     });
        // }).catch((err) => {
        //     showErrorToast(err)

        // });
    }

    const handleConfirmed = (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values);
        const updateAuctionSessionPromise = updateAuctionSession(values)
        toast.promise(updateAuctionSessionPromise, {
            loading: 'Updating Auction Session...',
            success: () => {
                setIsLoading(false);
                return 'Auction Session Updated Successfully'
            },
            error: (error) => {
                setIsLoading(false);
                return getErrorMessage(error)
            },
        })




        // updateAuctionSession(values).then((res) => {
        //     console.log(res);
        //     toast.success('Auction Session Updated Successfully',{
        //         position:"bottom-right",
        //     });
        //     setIsLoading(false);
        // }).catch((err) => {
        //     showErrorToast(err)
        //     setIsLoading(false)
        // });
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

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="flex flex-col w-full gap-3 p-3">
                        <div className="flex gap-2">
                            <div className="w-full basis-4/12  my-auto">
                                <TotalValuation sessionItems={currentAuctionSession?.auctionItems} />
                            </div>
                            <div className="w-full basis-4/12  my-auto">
                                <NumberOfParticipants totalParticipants={currentAuctionSession?.deposits?.length} />
                            </div>
                            <div className="w-full basis-4/12  my-auto">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Actions</CardTitle>
                                        <CardDescription>Actions that can be performed on the auction session</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex">
                                        {
                                            isloading ? <Button><Loader2 className="animate-spin" /></Button>
                                                : <Button type="submit" className="m-2">Update Session</Button>
                                        }

                                        {
                                            currentAuctionSession?.status === AuctionSessionStatus.PROGRESSING
                                            &&
                                            // <Button type="button" onClick={handleFinishSession} className="m-2">Finish Session</Button>
                                            <ConfirmationButton onSuccess={handleFinishSession} message={"Are you sure to Finish this session?"} title={"Confirmation"} label={"Ok"} description={"This action cannot be undone."} className="m-2">Finish Session</ConfirmationButton>
                                        }

                                        {
                                            currentAuctionSession?.status !== AuctionSessionStatus.FINISHED &&
                                            currentAuctionSession?.status !== AuctionSessionStatus.TERMINATED
                                            &&
                                            <>
                                                {/* <Button type="button" onClick={handleTerminateSession} className="m-2">Terminate Session</Button> */}
                                                <ConfirmationButton onSuccess={handleTerminateSession} message={"Are you sure to Terminate this session?"} title={"Confirmation"} label={"Terminate"} description={"This action cannot be undone."} className="m-2">Terminate Session</ConfirmationButton>
                                                {/* <Button type="button" onClick={handleInviteAll} className="m-2">Invite All User</Button> */}
                                                <ConfirmationButton onSuccess={handleInviteAll} message={"Are you sure to Invite all users to this session?"} title={"Confirmation"} label={"Ok"} description={"This action cannot be undone."} className="m-2">Invite All</ConfirmationButton>
                                            </>
                                        }
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                        <div className="w-full flex flex-row gap-2">
                            <div className="basis-8/12">
                                <ItemsList sessionItems={currentAuctionSession?.auctionItems} />
                            </div>
                            <div className="basis-4/12 flex flex-col gap-2">
                                <Status form={form} />
                                <Details form={form} />
                            </div>
                        </div>
                    </div>
                </form>
            </Form>
            <ConfirmationDialog
                description='This action cannot be undone.'
                label='Ok'
                message='Are you sure to Update this session?'
                onSuccess={confirm}
                open={showTrigger}
                onOpenChange={setShowTrigger}
                title='Confirmation'
            />
        </>
    );
}
