import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Separator } from '@/components/ui/separator';
import CountDownTime from '@/components/countdownTimer/CountDownTime';
import { useEffect, useState } from 'react';
import { CurrencyType, useCurrency } from '@/CurrencyProvider';

import { useAuth } from '@/AuthProvider';
import { useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function PlaceBid({ ...props }) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showBidDialog, setShowBidDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const currency = useCurrency();
  const auth = useAuth();
  const location = useLocation();
  const [bidIncrement, setBidIncrement] = useState(500);
  const [preparedBid, setPreparedBid] = useState([]);
  const formSchema = z.object({
    bidAmount: z.coerce
      .number({
        message: 'Bid amount must be a number',
      })
      .min(parseFloat(props?.currentBid) ? parseFloat(props?.currentBid) + bidIncrement : bidIncrement, {
        message: `Bid must be greater than the current bid amount + ${bidIncrement} `,
      })
      .refine(
        (data) => {
          return data < (parseFloat(props?.currentBid) < 100 ? 100 : parseFloat(props?.currentBid) * 2);
        },
        {
          message: 'Bid amount must be smaller than twice the current bid amount',
        }
      ),
  });
  useEffect(() => {
    if (!loc?.state) {
      let currentBid = Number(props.currentBid);
      if (currentBid < 15000) {
        setBidIncrement(100);
      } else if (currentBid >= 15000 && currentBid < 50000) {
        setBidIncrement(250);
      } else if (currentBid >= 50000 && currentBid < 200000) {
        setBidIncrement(500);
      } else {
        setBidIncrement(1000);
      }
    }
    form.setValue('bidAmount', Number(props.currentBid) + bidIncrement + 1);
  }, [loc?.state, props.currentBid]);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { bidAmount: Number(props?.currentBid) + bidIncrement + 1 },
  });
  useEffect(() => {
    if (!props.isSending) {
      setOpen(false);
      setShowBidDialog(false);
      // setShowBidDialog(false);
      setShowConfirmDialog(false);
    }
  }, [props.isSending]);
  // 2. Define a submit handler.

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // if (!showConfirmDialog) return
    // console.log(values);

    if (!showConfirmDialog) return;
    // console.log(values);
    if (props.client != null) {
      props.setIsSending(true);
      props.client.publish({
        destination: '/app/chat.sendMessage/' + props?.auctionId + '/' + props?.itemId,
        body: JSON.stringify({
          auctionItemId: {
            auctionSessionId: props?.auctionId,
            itemId: props?.itemId,
          },
          accountId: auth.user.accountId,
          amount: values.bidAmount,
        }),
      });
    }
  }

  const { isDirty, isValid } = form.formState;

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={true}>
      <DialogTrigger>
        <Button variant="default">Place Bid</Button>
      </DialogTrigger>
      <DialogContent className="h-fit">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {showConfirmDialog ? (
              <DialogHeader>
                <DialogDescription>
                  <div className="min-h-[60%] h-full flex-col items-center justify-center gap-2 ">
                    <h1 className=" text-center text-foreground">{props.name}</h1>
                    <div className="flex gap-2 items-center justify-center w-full">
                      <div>
                        <CountDownTime end={new Date(props?.endDate)} />
                      </div>
                      <div>
                        <p className="text-foreground">
                          Current Bid: <span>{currency.format(props.currentBid)}</span>
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="w-full text-foreground">
                      <div className=" w-full flex justify-between">
                        <p className="font-semibold">Your bid : </p>
                        <span>{currency.format(form.watch('bidAmount'))}</span>
                      </div>
                      <div className=" w-full flex justify-between">
                        <p className="font-semibold">Biddify Buyer's Fee:</p>
                        <p>
                          {currency.format(
                            0.045 * form.watch('bidAmount') > 4500
                              ? 4500
                              : 0.045 * form.watch('bidAmount') < 225
                                ? 225
                                : 0.045 * form.watch('bidAmount')
                          )}
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="text-foreground">
                      <p>
                        <strong>Bidding will instantly reach {currency.format(form.watch('bidAmount'))}.</strong> The
                        winning bidder pays Biddify a 4.5% buyer's fee on top of the winning bid (minimum $225, maximum
                        $4,500).
                      </p>
                      <p>
                        We will place a hold on your credit card for the buyer's fee. If you win, your card will be
                        charged the non-refundable buyer’s fee at the end of the auction, and you will pay the seller
                        directly for the vehicle. If you don't win, your hold will be released at auction end.
                      </p>
                      <p>
                        <strong>Bids are binding and cannot be retracted.</strong> You are responsible for completing
                        all due diligence prior to bidding. By placing this bid, you agree to the Biddify
                        <a href="/terms-of-use" target="_blank" rel="noopener noreferrer">
                          Terms of Use
                        </a>
                        .
                      </p>
                    </div>
                    <div className="flex flex-col justify-center items-center p-4 gap-2">
                      {props.isSending ? (
                        <Button className="min-w-48 " disabled>
                          <Loader2 className="animate-spin" />
                        </Button>
                      ) : (
                        <Button className="min-w-48" type="submit">
                          Bid {currency.format(form.watch('bidAmount'))}
                        </Button>
                      )}

                      <Button
                        className=""
                        variant="link"
                        onClick={() => {
                          setShowConfirmDialog(false);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>
            ) : (
              <DialogHeader>
                <DialogDescription>
                  <div className="min-h-[60%] w-fit h-full flex flex-col justify-center items-center gap-3">
                    <img
                      src={props.image}
                      alt="placeholder"
                      className="w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-full mx-auto"
                    />
                    <h1 className=" text-center text-foreground">{props.name}</h1>
                    <div className="flex gap-2 items-center">
                      <div>
                        <CountDownTime end={new Date(props?.endDate)} />
                      </div>
                      <div>
                        <p className="text-foreground">
                          Current Bid: <span>{currency.format(props.currentBid)}</span>
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex gap-2   items-start justify-start flex-wrap md:flex-nowrap">
                      <div className="w-80 text-foreground h-20 m-auto">
                        <FormField
                          control={form.control}
                          name="bidAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  className="w-full text-foreground"
                                  // defaultValue={2}
                                  placeholder={`amount equal or greater than ${currency.format(parseFloat(props?.currentBid) + bidIncrement)}`}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button
                        className="mx-auto "
                        variant="default"
                        type="submit"
                        onClick={() => {
                          if (isValid) {
                            setShowConfirmDialog(true);
                          }
                        }}
                      >
                        Place Bid
                      </Button>
                    </div>

                    <DialogFooter>
                      <div className="flex justify-center items-center flex-col text-foreground">
                        <p>
                          Bid increment is <span className="font-semibold">{currency.format(bidIncrement)} </span>
                        </p>
                        <span className="text-red-600 font-semibold">
                          Disclaimer:
                          <span>
                            All bid amounts are in USD. Currency conversions provided are for reference only and the
                            final amount may vary slightly.
                          </span>
                        </span>
                      </div>
                    </DialogFooter>
                  </div>
                </DialogDescription>
              </DialogHeader>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
