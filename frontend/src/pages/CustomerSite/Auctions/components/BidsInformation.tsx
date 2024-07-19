import { useCurrency } from '@/CurrencyProvider';
import CountDownTime from '@/components/countdownTimer/CountDownTime';
import { AuctionSessionStatus } from '@/constants/enums';
import { ArrowUp, HashIcon, Timer } from 'lucide-react';

export default function BidsInformation({ ...props }) {
  const currency = useCurrency();
  return (
    <>
      <div
        className={`flex flex-col border   rounded-xl   text-foreground p-5 ${new Date(props.auctionSession.endDate).getTime() < 300000 ? 'bg-red-500' : ''}`}
      >
        <div className="basis-4/12  flex justify-center gap-2 items-center w-full ">
          <p>
            <Timer />
          </p>
          {/* <p>Time left</p>
                <p className='font-semibold'><CountDownTime className='' end={new Date(props.auctionSession.endDate)} /> </p>

                <ClockIcon className="h-5 w-5" /> */}

          {props.auctionSession?.status === AuctionSessionStatus.PROGRESSING &&
            new Date(props.auctionSession?.endDate) > new Date() && (
              <>
                <p>Time left</p>
                <p className="font-semibold">
                  {props.auctionSession?.endDate ? (
                    <CountDownTime end={new Date(props.auctionSession.endDate)}></CountDownTime>
                  ) : (
                    <CountDownTime end={new Date()}></CountDownTime>
                  )}
                </p>
              </>
            )}

          {props.auctionSession?.status === AuctionSessionStatus.FINISHED &&
            new Date(props.auctionSession?.endDate) <= new Date() && (
              <div className="text-pink-500 dark:text-pink-400 font-semibold">Auction Ended</div>
            )}

          {props.auctionSession?.status === AuctionSessionStatus.TERMINATED && (
            <div className="text-red-500 dark:text-red-400 font-semibold">Auction has been terminated</div>
          )}

          {props.auctionSession?.status === AuctionSessionStatus.SCHEDULED && (
            <>
              <p>Starts in</p>
              <p className="font-semibold">
                {props.auctionSession?.startDate ? (
                  <CountDownTime end={new Date(props.auctionSession.startDate)}></CountDownTime>
                ) : (
                  <CountDownTime end={new Date()}></CountDownTime>
                )}
              </p>
            </>
          )}
        </div>
        <div className="basis-4/12 flex justify-center gap-2  items-center w-full ">
          <p>
            <ArrowUp />
          </p>
          <p>High Bid </p>
          <p className="font-semibold ">
            {' '}
            {currency.format(props.price ?? (props.bids.length > 0 ? props.bids[0].price : 0))}
          </p>
        </div>
        <div className="basis-4/12 flex  justify-center gap-2 items-center w-full ">
          <p>
            <HashIcon />
          </p>
          <p>Bids</p>
          <p className="font-semibold">{props.bids.length != null ? props.bids.length : props.bids}</p>
        </div>
      </div>
    </>
  );
}
