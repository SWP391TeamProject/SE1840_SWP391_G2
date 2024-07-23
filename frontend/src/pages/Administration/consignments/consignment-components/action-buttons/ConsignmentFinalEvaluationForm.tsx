import Consignment from '@/models/consignment.ts';
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog.tsx';
import { Button } from '@/components/ui/button.tsx';
import { toast } from 'sonner';
import { useAuth } from '@/AuthProvider.tsx';
import { Roles } from '@/constants/enums.tsx';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { Input } from '@/components/ui/input.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import DropzoneComponent from '@/components/drop-zone/DropZoneComponent.tsx';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFinalEvaluation } from '@/services/ConsignmentDetailService.tsx';
import { useCurrency } from '@/CurrencyProvider.tsx';

interface ConsignmentFinalEvaluationFormProps {
  consignment: Consignment;
  setConsignment: (v: Consignment) => void;
}

const formSchema = z
  .object({
    accountId: z.number(),
    evaluation: z.string().min(10, {
      message: 'Evaluation must be at least 10 characters long',
    }),
    price: z
      .string()
      .regex(/^\d+(\.\d+)?$/, {
        message: 'Price must be a number',
      })
      .min(2, {
        message: 'Price must be at least 10',
      }),
    consignmentId: z.number(),
    files: z.any(),
  })
  .required({
    accountId: true,
    evaluation: true,
    price: true,
    consignmentId: true,
    files: true,
  });

const ConsignmentFinalEvaluationForm: React.FC<ConsignmentFinalEvaluationFormProps> = ({
  consignment,
  setConsignment,
}) => {
  const auth = useAuth();
  const currency = useCurrency();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountId: auth.user.accountId,
      consignmentId: consignment.consignmentId,
      files: [],
      evaluation: '',
      price: '0',
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    toast.promise(createFinalEvaluation(data), {
      loading: 'Updating consignment...',
      success: (res) => {
        setLoading(false);
        const cloned = { ...consignment };
        cloned.consignmentDetails.unshift(res.data);
        setConsignment(cloned);
        return `Final evaluation sent successfully!`;
      },
      error: (err) => `An error occurred: ${err.message}`,
    });
  };

  return auth.user.role === Roles.STAFF ? (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="default" disabled={loading}>
          Send final evaluation
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Send final evaluation</AlertDialogTitle>
          <AlertDialogDescription>
            The initial evaluation cannot be changed. A manager will review your evaluation. If it is accepted, the
            customer will take turn to respond to your evaluation. Otherwise, you might re-evaluate this consignment.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => {})} className="space-y-2">
            <input type="hidden" {...form.register('accountId')} />
            <input type="hidden" {...form.register('consignmentId')} />
            <FormField
              control={form.control}
              name="evaluation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Evaluation:</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter your evaluation here" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Evaluation Worth: {currency.format(Number(field.value))}</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter the worth of the item" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <ScrollArea className="h-[200px] min-w-[350px] rounded-md border p-4">
              <FormField control={form.control} name="files" render={({ field }) => <DropzoneComponent {...field} />} />
            </ScrollArea>
          </form>
        </Form>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={loading} onClick={() => onSubmit(form.getValues())}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ) : (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 w-full">
      <h2 className="text-2xl font-bold mb-4">Information</h2>
      <p>Waiting for staff to send final evaluation</p>
    </div>
  );
};

export default ConsignmentFinalEvaluationForm;
