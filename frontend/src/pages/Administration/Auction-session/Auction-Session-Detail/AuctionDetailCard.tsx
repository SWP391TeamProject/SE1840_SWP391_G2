import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateAuctionSession } from '@/services/AuctionSessionService.tsx';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/handle-error.ts';
import { ConfirmationDialog } from '@/components/confirmation/confirmation-dialog.tsx';
import { AuctionSession } from '@/models/AuctionSessionModel.ts';
import { useState } from 'react';
import { DateTimePicker } from '@/components/time-picker/date-time-picker.tsx';
import { AuctionSessionStatus } from '@/constants/enums.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { formatDateToISO } from '@/lib/utils.ts';

const formSchema = z.object({
  auctionSessionId: z.number(),
  title: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  suspendDate: z.date(),
  description: z
    .string({ message: 'Description must be at least 10 characters long' })
    .min(10, {
      message: 'Description must be at least 10 characters long',
    })
    .max(1000, {
      message: 'Description cannot exceed 1000 characters long',
    }),
});

export const AuctionDetailCard: React.FC<{ auction: AuctionSession }> = ({ auction }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showTrigger, setShowTrigger] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      auctionSessionId: auction.auctionSessionId,
      title: auction.title,
      startDate: new Date(auction.startDate),
      endDate: new Date(auction.endDate),
      suspendDate: auction.suspendDate && new Date(auction.suspendDate),
      description: auction.description,
    },
  });

  function onSubmit() {
    setShowTrigger(true);
  }

  const handleConfirmed = () => {
    if (isLoading) return;
    setShowTrigger(false);
    setIsLoading(true);
    const what = form.getValues();
    toast.promise(
      updateAuctionSession({
        auctionSessionId: what.auctionSessionId,
        title: what.title,
        startDate: formatDateToISO(what.startDate),
        endDate: formatDateToISO(what.endDate),
        description: what.description,
      }),
      {
        loading: 'Updating Auction Session...',
        success: () => {
          setIsLoading(false);
          return 'Auction Session Updated Successfully';
        },
        error: (error) => {
          setIsLoading(false);
          return getErrorMessage(error);
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Session Detail</CardTitle>
        <CardDescription>This is the detail of the session</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={auction.status !== AuctionSessionStatus.SCHEDULED} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        {...field}
                        placeholder="from"
                        className="w-full"
                        disabled={auction.status !== AuctionSessionStatus.SCHEDULED}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        {...field}
                        placeholder="to"
                        className="w-full"
                        disabled={auction.status !== AuctionSessionStatus.SCHEDULED}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {auction.status === AuctionSessionStatus.TERMINATED && (
                <FormField
                  control={form.control}
                  name="suspendDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Suspension Date</FormLabel>
                      <FormControl>
                        <DateTimePicker {...field} className="w-full" disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="w-full min-h-[150px]"
                        disabled={auction.status !== AuctionSessionStatus.SCHEDULED}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {auction.status === AuctionSessionStatus.SCHEDULED && (
              <Button variant="default" size="sm" onClick={() => onSubmit()} disabled={isLoading}>
                Update
              </Button>
            )}
          </form>
        </Form>
        <ConfirmationDialog
          description="This action cannot be undone."
          label="Ok"
          message="Are you sure to Update this session?"
          onSuccess={handleConfirmed}
          open={showTrigger}
          onOpenChange={setShowTrigger}
          title="Confirmation"
        />
      </CardContent>
    </Card>
  );
};
