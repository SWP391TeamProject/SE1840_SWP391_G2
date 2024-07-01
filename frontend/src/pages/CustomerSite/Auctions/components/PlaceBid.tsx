import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CountDownTime from "@/components/countdownTimer/CountDownTime";
import { useState } from "react";
import { useCurrency } from "@/CurrencyProvider";
import { toast } from "react-toastify";
import { getCookie } from "@/utils/cookies";
import { useAuth } from "@/AuthProvider";
import { useLocation } from "react-router-dom";



export default function PlaceBid({ ...props }) {
    const [showConfirmDialog, setshowConfirmDialog] = useState(false);
    const currency = useCurrency();
    const auth = useAuth();
    const location = useLocation();
    const formSchema = z.object({
        bidAmount: z.coerce.number().min(props.currentBid ? props.currentBid : 0, {
            message: "Bid must be greater than the current bid amount + increment ",
        }).refine((data) => {
            return data < 2
        }, {
            message: "Bid amount must be smaller than twice the current bid amount",
        })
    })
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        },
    })

    // 2. Define a submit handler.

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values);
        if (props.client != null) {
            props.client.publish({
                destination: '/app/chat.sendMessage/' + props.auctionId + '/' + props.itemId,
                body: JSON.stringify({
                    auctionItemId: location.state.id,
                    payment: {
                        accountId: auth.user.accountId,
                        amount: values.bidAmount
                    }
                })
            });
        }
    }

    // Render the success message conditionally



    return (
        <>
            <Dialog defaultOpen={false} onOpenChange={() => {
                setshowConfirmDialog(false);
            }}  >
                <DialogTrigger asChild>
                    <Button variant="default">Place Bid</Button>
                </DialogTrigger>
                <DialogContent className="h-fit" onInteractOutside={(e) => {
                    e.preventDefault();
                }}>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            {
                                showConfirmDialog
                                    ?
                                    <DialogHeader>
                                        <DialogDescription>
                                            <div className="min-h-[60%] h-full flex-col items-center justify-center gap-2 ">
                                                <h1 className=" text-center text-foreground">{props.name}</h1>
                                                <div className="flex gap-2 items-center justify-center w-full">
                                                    <div>
                                                        <CountDownTime end={new Date(props.endDate)} />
                                                    </div>
                                                    <div>
                                                        <p className="text-foreground">Current Bid: <span>{props.currentBid}</span></p>
                                                    </div>
                                                </div>
                                                <Separator />
                                                <div className="w-full text-foreground">
                                                    <div className=" w-full flex justify-between">
                                                        <p className="font-semibold">Your bid : </p>
                                                        <span>{form.watch('bidAmount')}</span>
                                                    </div>
                                                    <div className=" w-full flex justify-between">
                                                        <p>Biddify Buyer's Fee</p>
                                                        <p>{currency.format(
                                                            {
                                                                amount: 0.045 * form.watch('bidAmount'),
                                                            }
                                                        )}</p>
                                                    </div>
                                                </div>
                                                <Separator />
                                                <div className="text-foreground">
                                                    <p><strong>Bidding will instantly reach {form.watch('bidAmount')}.</strong> The winning bidder pays Cars &amp; Bids a 4.5% buyer's fee on top of the winning bid (minimum $225, maximum $4,500).</p><p>We will place a hold on your credit card for the buyer's fee. If you win, your card will be charged the non-refundable buyer’s fee at the end of the auction, and you will pay the seller directly for the vehicle. If you don't win, your hold will be released at auction end.</p><p><strong>Bids are binding and cannot be retracted.</strong> You are responsible for completing all due diligence prior to bidding. By placing this bid, you agree to the Cars &amp; Bids <a href="/terms-of-use" target="_blank" rel="noopener noreferrer">Terms of Use</a>.</p>
                                                </div>
                                                <div className="flex flex-col justify-center items-center p-4 gap-2">
                                                    <Button className="min-w-48" type="submit">Bid {form.watch("bidAmount")}</Button>
                                                    <Button className="" variant="link" onClick={() => {
                                                        setshowConfirmDialog(false);
                                                    }}>Cancel</Button>
                                                </div>
                                            </div>
                                        </DialogDescription>
                                    </DialogHeader>
                                    :
                                    <DialogHeader>
                                        <DialogDescription>
                                            <div className="mt-12 md:mt-16 lg:mt-20 flex flex-col justify-center items-center gap-3">
                                                <img src={props.image} alt="placeholder" className="w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-full mx-auto" />
                                                <h1 className=" text-center text-foreground">{props.name}</h1>
                                                <div className="flex gap-2 items-center">
                                                    <div>
                                                        <CountDownTime end={new Date(props.endDate)} />
                                                    </div>
                                                    <div>
                                                        <p className="text-foreground">Current Bid: <span>{props.currentBid}</span></p>
                                                    </div>
                                                </div>
                                                <Separator />
                                                <div className="flex gap-2">
                                                    <FormField
                                                        control={form.control}
                                                        name="bidAmount"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Input className="w-80" placeholder={`please enter amount greater than ${props.currentBid + 500}`} {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <Button variant="default" type="button" onClick={() => {
                                                        setshowConfirmDialog(true);
                                                    }}>Place Bid</Button>
                                                </div>
                                                <DialogFooter>
                                                    <h6>Bid increment is 500 </h6>
                                                </DialogFooter>
                                            </div>
                                        </DialogDescription>
                                    </DialogHeader>
                            }
                        </form>
                    </Form>
                </DialogContent>

            </Dialog >

        </>
    );
}
