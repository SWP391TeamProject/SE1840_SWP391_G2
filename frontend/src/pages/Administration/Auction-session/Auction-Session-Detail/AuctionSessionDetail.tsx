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
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

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
    const { id } = useParams<{ id: string }>();

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
        updateAuctionSession(values).then((res) => {
            console.log(res);
            toast.success('Auction Session Updated Successfully',{
                position:"bottom-right",
            });
            setIsLoading(false);
        }).catch((err) => {
            toast.error(err.response.data.message,{
                position:"bottom-right",
            })
            setIsLoading(false)
        });

    }

    useEffect(() => {
        if (!auctionSession) {
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
        finishAuctionSession(currentAuctionSession?.auctionSessionId).then((res) => {
            console.log(res);
            toast.success('Auction Session Finished Successfully',{
                position:"bottom-right",
            });
        }).catch((err) => {
            toast.error(err.response.data.message,{
                position:"bottom-right",
            })
        });
    }

    const handleTerminateSession = () => {
        terminateAuctionSession(currentAuctionSession?.auctionSessionId).then((res) => {
            console.log(res);
            toast.success('Auction Session Terminated Successfully',{
                position:"bottom-right",
            });
        }).catch((err) => {
            toast.error(err.response.data.message,{
                position:"bottom-right",
            })
        });
    }

    return (
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
                                            : <Button type="submit" className="m-2">Save</Button>
                                    }

                                    {
                                        currentAuctionSession?.status === AuctionSessionStatus.PROGRESSING
                                           && <Button type="button" onClick={handleFinishSession} className="m-2">Finish Session</Button>
                                    }

                                    {
                                        isloading ? <Button><Loader2 className="animate-spin" /></Button>
                                            : <Button type="button" onClick={handleTerminateSession} className="m-2">Terminate Session</Button>

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
    );
}
