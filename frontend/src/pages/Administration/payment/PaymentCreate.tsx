import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/AuthProvider.tsx';
import LoadingAnimation from '@/components/loadingAnimation/LoadingAnimation.tsx';
import { ConfirmationDialog } from '@/components/confirmation/confirmation-dialog';
import { getErrorMessage } from '@/lib/handle-error';
import { createPayment } from '@/services/PaymentsService.ts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCurrency } from '@/CurrencyProvider.tsx';

enum PaymentType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
}

const FormSchema = z.object({
  accountId: z.coerce.number(),
  amount: z.coerce.number(),
  type: z.nativeEnum(PaymentType),
});

export default function PaymentCreate() {
  const currency = useCurrency();
  const auth = useAuth();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showTrigger, setShowTrigger] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      accountId: auth.user.accountId,
      amount: 0,
      type: undefined,
    },
  });

  function onSubmit(_: z.infer<typeof FormSchema>) {
    setShowTrigger(true);
  }

  const handleConfirmed = (data: z.infer<typeof FormSchema>) => {
    toast.promise(createPayment(data), {
      loading: 'Finishing Auction Session...',
      success: (res) => {
        console.log(res);
        nav('/admin/payments');
        return 'Payment created successfully!';
      },
      error: (error) => {
        console.error(error);
        setLoading(false);
        return getErrorMessage(error);
      },
    });
  };

  const confirm = () => {
    setIsConfirmed(true);
    setShowTrigger(false);
    setLoading(true);
  };

  useEffect(() => {
    if (isConfirmed) {
      if (form.getValues) {
        const values = form.getValues();
        handleConfirmed(values);
        setIsConfirmed(false);
      } else {
        setLoading(false);
      }
    }
  }, [isConfirmed, form.getValues]);

  return (
    <>
      {loading ? (
        <LoadingAnimation />
      ) : (
        <div className="p-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
              <FormField
                control={form.control}
                name="accountId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account ID</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount: {currency.format(form.getValues('amount'))}</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select the payment type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(PaymentType).map((type) => {
                          return <SelectItem value={type}>{type}</SelectItem>;
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Submit</Button>
            </form>
          </Form>
          <ConfirmationDialog
            description="This action cannot be undone."
            label="Ok"
            message="Are you sure to Create this payment?"
            onSuccess={confirm}
            open={showTrigger}
            onOpenChange={setShowTrigger}
            title="Confirmation"
          />
        </div>
      )}
    </>
  );
}
