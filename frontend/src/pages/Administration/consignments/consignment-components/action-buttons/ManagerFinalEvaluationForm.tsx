import Consignment from '@/models/consignment.ts';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { toast } from 'sonner';
import { acceptStaffEvaluation, rejectStaffEvaluation } from '@/services/ConsignmentService.tsx';
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
import { Roles } from '@/constants/enums.tsx';
import { useAuth } from '@/AuthProvider.tsx';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';

interface ManagerFinalEvaluationFormProps {
  consignment: Consignment;
  setConsignment: (v: Consignment) => void;
}

const formSchema = z.object({
  reason: z.string().min(10, {
    message: 'Please give a reason at least 10 characters long',
  }),
});

const ManagerFinalEvaluationForm: React.FC<ManagerFinalEvaluationFormProps> = ({ consignment, setConsignment }) => {
  const [open, setOpen] = useState(false);
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: '',
    },
  });

  const acceptEvaluation = () => {
    setLoading(true);
    toast.promise(acceptStaffEvaluation(consignment.consignmentId, auth.user.accountId), {
      loading: 'Accepting...',
      success: (res) => {
        setLoading(false);
        setConsignment(res.data);
        return 'Final Evaluation Accepted';
      },
      error: (err) => `An error occurred: ${err.message}`,
    });
  };

  const rejectEvaluation = async () => {
    const ok = await form.trigger();
    if (!ok) return;
    setOpen(false);
    setLoading(true);
    toast.promise(rejectStaffEvaluation(consignment.consignmentId, auth.user.accountId, form.getValues().reason), {
      loading: 'Rejecting...',
      success: (res) => {
        setLoading(false);
        setConsignment(res.data);
        return 'Final Evaluation Rejected';
      },
      error: (err) => `An error occurred: ${err.message}`,
    });
  };

  return auth.user.role === Roles.MANAGER ? (
    <div className="flex flex-row gap-6">
      <AlertDialog>
        <AlertDialogTrigger>
          <Button className="bg-green-500 text-white" disabled={loading}>
            I accept the evaluation
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              One you have accepted, the customer will take turn to respond to the evaluation. They might choose to
              cancel the consignment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={loading} onClick={() => acceptEvaluation()}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={open}>
        <AlertDialogTrigger>
          <Button className="bg-red-500 text-white" disabled={loading} onClick={() => setOpen(true)}>
            I decline the evaluation
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>The staff will have another opportunity to re-evaluate.</AlertDialogDescription>
          </AlertDialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(() => {})} className="space-y-2">
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your reason:</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter the reason for rejection" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={loading} onClick={() => rejectEvaluation()}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  ) : (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 w-full">
      <h2 className="text-2xl font-bold mb-4">Information</h2>
      <p>Waiting for manager to review final evaluation</p>
    </div>
  );
};

export default ManagerFinalEvaluationForm;
