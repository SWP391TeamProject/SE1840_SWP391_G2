import { useCurrency } from "@/CurrencyProvider";
import CountDownTime from "@/components/countdownTimer/CountDownTime";
import {  ArrowUp, HashIcon, Timer } from "lucide-react";

export default function BidsInformation({...props}) {
    const currency = useCurrency();
    return <>
        <div className={`flex flex-col md:flex-row border   rounded-xl   text-foreground p-5 ${new Date(props.auctionSession.endDate).getTime() < 300000 ? 'bg-red-500' : ''}`} >
            <div className='basis-4/12  flex justify-center gap-2 items-center w-full '>
                <p><Timer /></p>
                <p>Time left</p>
                <p className='font-semibold'><CountDownTime className='' end={new Date(props.auctionSession.endDate)} /> </p>
            </div>
            <div className='basis-4/12 flex justify-center gap-2  items-center w-full '>
                <p><ArrowUp /></p>
                <p>High Bid </p>
                <p className='font-semibold '> {currency.format({
                    amount: props.price ?? (props.bids.length > 0 ? props.bids[0].price : 0)
                })}</p>
            </div>
            <div className='basis-4/12 flex  justify-center gap-2 items-center w-full '>
                <p><HashIcon /></p>
                <p>Bids</p>
                <p className='font-semibold'>{props.bids.length}</p>
            </div>
        </div>
    </>;
}
