import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { custom, z } from 'zod';

import DropzoneComponent from '@/components/drop-zone/DropZoneComponent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { createAuctionSession, getAuctions } from '@/services/AuctionSessionService';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { showErrorToast } from '@/lib/handle-error';
import { useNavigate } from 'react-router-dom';
import { setCurrentAuctionSession } from '@/redux/reducers/AuctionSession';
import { useAppDispatch } from '@/redux/hooks';
import { Textarea } from '@/components/ui/textarea';
import { AuctionSessionStatus } from '@/constants/enums';
import { Scheduler } from "@aldabil/react-scheduler";
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
  ConfirmationDialog
} from '@/components/confirmation/confirmation-dialog';
import {formatDateTime} from '@/lib/utils';

const FormSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  startDate: z.string(),
  endDate: z.string(),
  description: z
    .string({message: 'Description must be at least 10 characters long'})
    .min(10, {
      message: 'Description must be at least 10 characters long',
    })
    .max(1000, {
      message: 'Description cannot exceed 1000 characters long',
    }),
  files: z.any(),
});

export default function AuctionSessionCreate() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scheduledSessions, setScheduledSessions] = useState([]);
  const [events, setEvents] = useState([]);
  const [step, setStep] = useState(1);
  const [scheduleTrigger, setScheduleTrigger] = useState(false);
  const nav = useNavigate();
  const dispatch = useAppDispatch();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      files: [],
    },
  });

  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showTrigger, setShowTrigger] = useState(false);
  const handleConfirmed = (values: z.infer<typeof FormSchema>) => {
    setIsConfirmed(true);
    setShowTrigger(false);
    createAuctionSession(values)
      .then((res) => {
        setIsSubmitting(false);
        toast.success('Auction session created successfully.', {});
        dispatch(setCurrentAuctionSession(res.data));
        nav(`/admin/auction-sessions/${res.data.auctionSessionId}/assign-items`);
      })
      .catch((err) => {
        setIsSubmitting(false);
        showErrorToast(err);
      });
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

  function onSubmit(data: z.infer<typeof FormSchema>) {
    let start = form.control._formValues['startDate'];
    let end = form.control._formValues['endDate'];
    if ((start && end) && end > start ){
      if (multipleDateRangeOverlaps(events)) {
        form.setError('startDate', { type: "custom", message: "New Session time range is overlapping another Scheduled Session." });
        form.setError('endDate', { type: "custom", message: "" })
      } else {
        form.clearErrors('startDate');
        form.clearErrors('endDate');
        console.log(data);
        console.log('validated');
        setScheduleTrigger(false);
        setShowTrigger(true);
      }
    } else {
      form.setError('endDate', {type: "custom", message:"End time must be after start time"})
    }
  }

  const goNextStep = () => {
    Promise.all([form.trigger("description"), form.trigger("title")]).then((res) => {
      if(!res.includes(false))
        setStep(step + 1);
    })
  }

  const goPreviousStep = () => {
    setStep(step - 1);
  }

  const handleViewSchedule = () => {
    setScheduleTrigger(!scheduleTrigger);
  }

  const handleDateChange = () => {
    let start = form.control._formValues['startDate'];
    let end = form.control._formValues['endDate'];
    console.log(start);
    console.log(end);
    if ((start && end) && end > start ) {
      let newSession = {
        event_id: null,
        title: form.control._formValues['title'] || "New Auction Session",
        start: new Date(start),
        end: new Date(end),
        color: "orange",
      }
      console.log(scheduledSessions);
      let tempList = [...scheduledSessions];
      tempList.push(newSession);
      console.log(tempList);
      setEvents(tempList);
      if (multipleDateRangeOverlaps(tempList)) {
        form.setError('startDate', {type: "custom", message:"New Session time range is overlapping another Scheduled Session."});
        form.setError('endDate', {type: "custom", message:""})
      } else {
        form.clearErrors('startDate');
        form.clearErrors('endDate');
      }      
    } else {
      {
        form.setError('endDate', {type: "custom", message:"End time must be after start time"})
      }
    }
  }

  function dateRangeOverlaps(a_start, a_end, b_start, b_end) {
    if (a_start < b_start && b_start < a_end) return true; // b starts in a
    if (a_start < b_end && b_end < a_end) return true; // b ends in a
    if (b_start < a_start && a_end < b_end) return true; // a in b
    return false;
  }

  function multipleDateRangeOverlaps(timeEntries) {
    let i = 0, j = 0;
    let timeIntervals = timeEntries.filter(entry => entry.start != null && entry.end != null);

    if (timeIntervals != null && timeIntervals.length > 1)
      for (i = 0; i < timeIntervals.length - 1; i += 1) {
        for (j = i + 1; j < timeIntervals.length; j += 1) {
          if (
            dateRangeOverlaps(
              timeIntervals[i].start, timeIntervals[i].end,
              timeIntervals[j].start, timeIntervals[j].end
            )
          ) {
            console.log(timeIntervals[j].title, timeIntervals[i].title)
            return true
          };
        }
      }
    return false;
  }

  useEffect(() => {
    getAuctions({ page: 1, size: 100, status: AuctionSessionStatus.SCHEDULED }).then((res) => {
      console.log(res.data);
      let sessions = res.data.content.map((session) => (
        {
          event_id: session.auctionSessionId,
          title: session.title,
          start: new Date(session.startDate),
          end: new Date(session.endDate),
          editable: false,
          deletable: false,
          draggable: false,
        })
      )
      console.log(sessions)
      setScheduledSessions(sessions);
      setEvents(sessions)
    }).catch((err) => {
      showErrorToast(err);
    });
  }, [])

  return (
    <div className='p-10'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
          <h1 className='font-bold text-xl'>Step {step}</h1>
          {/* this is the title of the auction session. */}
          {step == 1 && <>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Auction Session" {...field} />
                  </FormControl>
                  <FormDescription>This is the title of the auction session.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="description of the session" {...field} />
                  </FormControl>
                  <FormDescription>This is the description of the auction session.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* This is the attachments for the auction session. */}
            <ScrollArea className="w-full h-64 overflow-hidden">
              <FormField
                control={form.control}
                name="files"
                render={({ field }) => <DropzoneComponent {...field} control={form.control} />}
              />
            </ScrollArea>
            <Button type="button" onClick={goNextStep}>Next</Button>
          </>}

          {step == 2 && <>
            <div className="flex items-center justify-start gap-4">
              {/* This is the start date of the auction session. */}
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <FormControl onChange={handleDateChange}>
                      <input type="datetime-local" className="cursor-pointer bg-background text-foreground" {...field} />
                    </FormControl>
                    {/* {form.control._formState.errors.startDate && <p className='text-red-600'>{form.control._formState.errors.startDate.message}</p>} */}
                    <FormDescription>this is the start date of the auction session</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* This is the end date of the auction session. */}
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <FormControl onChange={handleDateChange}>
                      <input type="datetime-local" className="cursor-pointer bg-background text-foreground" {...field} />
                    </FormControl>
                    <FormDescription>this is the end date of the auction session</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button variant='outline' className='mr-3' type="button" onClick={handleViewSchedule}>Togle Schedule</Button>

            </div>

            {scheduleTrigger &&
              <Scheduler
                // onConfirm={async (event, action) => {
                //   handleOnConfirm(event, action);
                //   console.log(event)
                //   console.log(action)
                //   return await event;
                // }}
                // view="week"
                // day={{
                //   startHour: 0,
                //   endHour: 24,
                //   step: 60
                // }}
                week={{
                  weekDays: [0, 1, 2, 3, 4, 5, 6],
                  weekStartOn: 1,
                  startHour: 0,
                  endHour: 24,
                  step: 60
                }}
                editable={false}
                events={events}
              // fields={[
              //   {
              //     name: "title",
              //     type: "input",
              //     default: form.control._formValues["title"],
              //     config: { label: "Title", required: true }
              //   }
              // ]}
              />
            }

            <Button variant='outline' className='mr-3' type="button" onClick={goPreviousStep}>Back</Button>

            {isSubmitting ? (
              <Button variant="default" disabled>
                <Loader2 className="animate-spin" size={24} />
                Submitting...
              </Button>
            ) : (
              <Button type="submit" variant="default">
                Submit
              </Button>
            )}
          </>}
        </form>


        <ConfirmationDialog
          open={showTrigger}
          description="Are you sure to create this auction session?"
          onOpenChange={setShowTrigger}
          title="Are you sure to create this auction session?"
          message={
            form.formState.isDirty
              ? `Auction Session ${form.getValues()?.title || ''} will be created.\n Start Date: ${form.getValues()?.startDate ? formatDateTime(form.getValues()?.startDate) : 'N/A'} \n End Date: ${form.getValues()?.endDate ? formatDateTime(form.getValues().endDate) : 'N/A'}`
              : ''
          }
          label="Confirm"
          onSuccess={confirm}
        />
      </Form>
    </div>
  );
}
