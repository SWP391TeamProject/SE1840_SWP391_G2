import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Payment } from "@/models/newModel/payment";
import React from "react";

interface RegisterToBidProps {
    accountId: number;
    auctionId: number;
    amount: number;
}

export default function RegisterToBid() {


    return <AlertDialog>
        <AlertDialogTrigger asChild>
            <button className="btn btn-primary">Register to Bid</button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <div className="flex flex-col p-4 bg-white rounded-md shadow-md">
                <div className="flex flex-col items-center justify-center w-full">
                    <img src="/src/assets/icon.png" alt="logo" className="h-16 w-16" />
                    <h2 className="text-lg font-bold text-center">Register to Bid</h2>
                </div>
                <div className="flex justify-between">
                    <p className="indent-5">
                        We require you to place a deposit on any item
                        you wish to bid on. You can do this by clicking the button below.
                        Once you have placed your deposit you can bid on any item in the auction.
                        If you are outbid your deposit will be returned to you.
                        If you win the auction your deposit will be deducted from the total cost of the item.
                        If you wish to withdraw your deposit at any time please contact us.
                        Please note that the deposit is non-refundable.
                    </p>
                </div>
            </div>
            <AlertDialogFooter>
                <AlertDialogCancel >
                    <button className="btn btn-secondary">Cancel</button>
                </AlertDialogCancel>
                <AlertDialogAction >
                    <button className="btn btn-primary">Register</button>
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>


    </AlertDialog>;
}
