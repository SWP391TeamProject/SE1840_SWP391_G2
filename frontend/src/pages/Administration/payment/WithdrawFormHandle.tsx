import {Button} from '@/components/ui/button';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {useAuth} from '@/AuthProvider.tsx';
import {useCurrency} from '@/CurrencyProvider.tsx';
import axios from "@/config/axiosConfig.ts";
import {API_SERVER} from "@/constants/domain.ts";
import {toast} from "sonner";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Payment} from "@/models/payment.ts";
import {PaymentStatus} from "@/constants/enums.tsx";

const formSchema = z.object({
  reason: z.string().optional(),
  accepted: z.boolean()
});

export default function WithdrawFormHandle({payment}: { payment: Payment }) {
  const auth = useAuth();
  const currency = useCurrency();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'all',
    defaultValues: {
      reason: "",
      accepted: false
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    axios
      .post(
        `${API_SERVER}/payments/${payment.id}`,
        {
          failedReason: values.reason,
          type: 'WITHDRAW',
          status: values.accepted ? PaymentStatus.SUCCESS : PaymentStatus.FAILED,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + auth.user.accessToken,
          },
        }
      )
      .then(() => {
        toast.success("Payment updated successfully", {
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
          <Button size="sm">Handle request</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl">Withdraw Request</DialogTitle>
          </DialogHeader>
          <p>{payment.account.nickname} requested to withdraw {currency.format(payment.paymentAmount)}</p>
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="accepted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>I accept this request</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reason"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Reason for rejection</FormLabel>
                    <FormControl>
                      <Textarea {...field} disabled={form.getValues().accepted} />
                    </FormControl>
                    <FormDescription>Enter your reason for rejecting this request.</FormDescription>
                    <FormMessage/>
                  </FormItem>
                )}/>
              <Button className="w-full">Submit</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
