import { useEffect, useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AccountStatus, RoleName, Roles } from '@/constants/enums';
import { createAccountService } from '@/services/AccountsServices.ts';
import { useNavigate } from 'react-router-dom';
import { Role } from '@/models/newModel/account';
import { AlertCircle, Loader2 } from 'lucide-react';
import { ConfirmationDialog } from '@/components/confirmation/confirmation-dialog';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { getErrorMessage, showErrorToast } from '@/lib/handle-error';

const phoneRegex = new RegExp(/^[0-9\-\+]{10}$/);

const emailRegex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);

const formSchema = z.object({
  // accountId: z.number(),
  nickname: z.string(),
  email: z.string().regex(emailRegex, 'Invalid email!'),
  phone: z.string().regex(phoneRegex, 'Invalid Number!'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.enum([RoleName.MEMBER, RoleName.STAFF, RoleName.MANAGER, RoleName.ADMIN]),
  balance: z.coerce.number().optional(),
  dummy: z.boolean(),
});

export default function AccountCreate() {
  // const account = useAppSelector((state) => state.accounts.currentAccount);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showTrigger, setShowTrigger] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // accountId: 0,
      nickname: '',
      email: '',
      phone: '',
      balance: 0,
      role: RoleName.MEMBER,
      dummy: false,
    },
  });
  const handleConfirmed = (data: z.infer<typeof formSchema>) => {
    setIsConfirmed(true);
    setShowTrigger(false);
    let createdAccount = {
      // accountId: data.accountId,
      email: data.email,
      nickname: data.nickname ?? '',
      phone: data.phone,
      avatar: null,
      balance: data.balance,
      role: data.role,
      password: data.password,
      status: AccountStatus.ACTIVE,
      dummy: data.dummy,
    };

    const createAccountServicePromise = createAccountService(createdAccount);

    toast.promise(createAccountServicePromise, {
      loading: 'Creating account...',
      success: () => {
        setIsSubmitting(false);
        return 'Account created successfully';
      },
      error: (err) => {
        setIsSubmitting(false);
        return getErrorMessage(err);
      },
    });

    // createAccountService(createdAccount).then((res) => {
    //     console.log(res);
    //     toast.success("Account created successfully");
    //     setIsSubmitting(false);
    // })
  };

  const confirm = () => {
    setIsConfirmed(true);
    setShowTrigger(false);
    setIsSubmitting(true);
  };

  useEffect(() => {
    if (isConfirmed) {
      if (form.getValues) {
        const values = form.getValues();
        handleConfirmed(values);
        setIsConfirmed(false);
      } else {
        setIsSubmitting(false);
      }
    }
  }, [isConfirmed, form.getValues]);

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
    console.log('validated');
    setShowTrigger(true);
  }

  useEffect(() => {
    // console.log(account);
    // console.log(form.formState.defaultValues);
  }, []);

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8" style={{ float: 'left' }}>
      <div key="1" className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Create Account</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            ___________________________________________________________________________________________________________________________________________
          </p>
          {/* <p className="mt-2 text-gray-500 dark:text-gray-400">
          Fill out the form below to list your item for consignment. We'll
          review your submission and get back to you within 2 business days.
        </p> */}
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* <FormField
                            control={form.control}
                            name="accountId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>accountId</FormLabel>
                                    <FormControl>
                                        <Input disabled
                                            // defaultValue={JSON.parse(getCookie("user"))?.id}
                                            // {...field}
                                            // defaultValue={}
                                            placeholder="account id" {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}
            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Name</FormLabel>
                  <FormControl>
                    <Input placeholder="enter your prefer user name here" {...field} />
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
                    <Input placeholder="adasd" {...field} />
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
                    <Input placeholder="shadcn" {...field} />
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
                  <FormLabel>Balance</FormLabel>
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
                      // disabled={field.value === RoleName.ADMIN}
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
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={Roles.ADMIN} />
                        </FormControl>
                        <FormLabel className="font-normal">{Roles.ADMIN}</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
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
