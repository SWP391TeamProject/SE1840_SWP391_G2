import { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AccountStatus, Roles } from '@/constants/enums';
import { createAccountService } from '@/services/AccountsServices.ts';
import { AlertCircle, Loader2 } from 'lucide-react';
import { ConfirmationDialog } from '@/components/confirmation/confirmation-dialog';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { getErrorMessage } from '@/lib/handle-error';
import { useCurrency } from '@/CurrencyProvider.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import { useNavigate } from 'react-router-dom';

const emailRegex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);

const formSchema = z.object({
  // accountId: z.number(),
  nickname: z
    .string()
    .min(5, 'Nickname must be at least 5 characters')
    .max(20, 'Nickname must not be longer than 20 characters'),
  email: z.string().regex(emailRegex, 'Invalid email!'),
  phone: z.string().max(12, 'Phone must not be longer than 12 characters').optional(),
  password: z
    .string()
    .min(8, 'Current password must contain at least 8 characters')
    .max(30, 'Current password must contain at most 30 characters'),
  role: z.nativeEnum(Roles),
  balance: z.coerce
    .number()
    .min(0, 'Balance must not be negative')
    .max(1000000000, 'Balance must not exceed 1,000,000,000'),
  dummy: z.boolean(),
  status: z.nativeEnum(AccountStatus),
});

export default function AccountCreate() {
  const nav = useNavigate();
  const currency = useCurrency();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTrigger, setShowTrigger] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickname: '',
      email: '',
      password: '',
      phone: '',
      balance: 0,
      role: Roles.MEMBER,
      status: AccountStatus.ACTIVE,
      dummy: false,
    },
  });

  const confirm = () => {
    setShowTrigger(false);
    setIsSubmitting(true);
    const data = form.getValues();
    let createdAccount = {
      nickname: data.nickname,
      email: data.email,
      password: data.password,
      phone: data.phone,
      balance: data.balance,
      role: data.role,
      dummy: data.dummy,
      status: data.status,
    };

    const createAccountServicePromise = createAccountService(createdAccount);

    toast.promise(createAccountServicePromise, {
      loading: 'Creating account...',
      success: () => {
        setIsSubmitting(false);
        nav('/admin/accounts');
        return 'Account created successfully';
      },
      error: (err) => {
        setIsSubmitting(false);
        return getErrorMessage(err);
      },
    });
  };

  function onSubmit(data: z.infer<typeof formSchema>) {
    setShowTrigger(true);
  }

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8" style={{ float: 'left' }}>
      <div key="1" className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Create Account</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            ___________________________________________________________________________________________________________________________________________
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nickname</FormLabel>
                  <FormControl>
                    <Input placeholder="The nickname of this account" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="The email of this account, must be unique" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="The phone number of this account" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="balance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Balance: {currency.format(field.value)}</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                      disabled={field.value === Roles.ADMIN}
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={Roles.MEMBER} />
                        </FormControl>
                        <FormLabel className="font-normal">{Roles.MEMBER}</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={Roles.STAFF} />
                        </FormControl>
                        <FormLabel className="font-normal">{Roles.STAFF}</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={Roles.MANAGER} />
                        </FormControl>
                        <FormLabel className="font-normal">{Roles.MANAGER}</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.keys(AccountStatus).map((v) => (
                        <SelectItem value={v}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dummy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dummy?</FormLabel>
                  <FormControl>
                    <div>
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Note</AlertTitle>
                        <AlertDescription>
                          A dummy account is an account used for testing purposes.
                          <br />
                          <b>NO email will be sent to these accounts.</b>
                        </AlertDescription>
                      </Alert>
                      <div className="mt-2">
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        <span className="ml-2">Enable dummy</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isSubmitting ? (
              <Button variant={'default'} className="w-20" disabled>
                <Loader2 className="animate-spin" />
              </Button>
            ) : (
              <Button variant={'default'} type="submit" className="w-20">
                Submit
              </Button>
            )}
          </form>
          <ConfirmationDialog
            description="This action cannot be undone."
            label="Ok"
            message="Are you sure to create this account?"
            onSuccess={confirm}
            open={showTrigger}
            onOpenChange={setShowTrigger}
            title="Confirmation"
          />
        </Form>
      </div>
    </main>
  );
}
