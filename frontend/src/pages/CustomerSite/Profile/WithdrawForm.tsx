import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { useAuth } from '@/AuthProvider.tsx';
import { useCurrency } from '@/CurrencyProvider.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import axios from '@/config/axiosConfig.ts';
import { API_SERVER } from '@/constants/domain.ts';
import { toast } from 'sonner';

const formSchema = z.object({
  amount: z.coerce.number(),
});

export default function WithdrawForm() {
  const auth = useAuth();
  const currency = useCurrency();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'all',
    defaultValues: {
      amount: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    axios
      .post(
        `${API_SERVER}/payments/create`,
        {
          ...values,
          type: 'WITHDRAW',
          status: 'PENDING',
          accountId: auth.user.accountId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + auth.user.accessToken,
          },
        }
      )
      .then(() => {
        toast.success('Withdraw request submitted!', {
          position: 'top-right',
        });
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
        toast.error(error, {
          position: 'top-right',
        });
      });
  }

  return (
    <>
      <Dialog>
        <DialogTrigger>
          <Button size="sm">Withdraw</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl">Withdraw Request</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormDescription>Enter the amount of balance to deposit.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Separator />
              <div className="flex flex-col gap-3">
                <div className="flex flex-row justify-between">
                  <p>Gross Amount</p>
                  <p>{currency.format(form.getValues().amount)}</p>
                </div>
                <div className="flex flex-row justify-between">
                  <p>Fee</p>
                  <p>{currency.format(0)}</p>
                </div>
                <div className="flex flex-row justify-between">
                  <p>Net Amount</p>
                  <p>{currency.format(form.getValues().amount)}</p>
                </div>
                <div className="flex flex-row justify-between">
                  <p>Balance Remain</p>
                  <p>{currency.format(auth.user.balance - form.getValues().amount)}</p>
                </div>
              </div>
              {auth.user.balance - form.getValues().amount <= 0 && (
                <p className="text-red-500">You do not have enough balance.</p>
              )}
              <Button className="w-full" disabled={auth.user.balance - form.getValues().amount <= 0}>
                Submit
              </Button>
              <p className="text-sm text-muted-foreground">
                Your request will be manually processed. It may take up to 24 hours. If the request is cancelled for any
                reason, your withdrawal amount will be refunded.
              </p>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
