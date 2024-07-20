import { useAuth } from '@/AuthProvider';
import DropzoneComponent from '@/components/drop-zone/DropZoneComponent';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { showErrorToast } from '@/lib/handle-error';
import { getCookie } from '@/utils/cookies';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from '@/config/axiosConfig.ts';
import { Loader2 } from 'lucide-react';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { z } from 'zod';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const formSchema = z.object({
  frontImage: z
    .any()
    // .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported.'
    ),

  backImage: z
    .any()
    // .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported.'
    ),
});

export default function KycVerification() {
  const [isLoading, setIsLoading] = React.useState(false);
  const auth = useAuth();
  const [kycDetail, setKycDetail] = React.useState<any>(null);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      frontImage: '',
      backImage: '',
    },
  });

  useEffect(() => {
    if (auth.user?.kyc === true) {
      const kycPromise = axios.get(`${import.meta.env.VITE_API_SERVER}/kyc/detail`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + getCookie('token'),
        },
      });

      toast.promise(kycPromise, {
        loading: 'Loading KYC details...',
        success: (res) => {
          console.log(res.data);
          setKycDetail(res.data);
          return 'KYC details loaded successfully!';
        },
        error: (err) => {
          return 'Failed to load KYC details';
        },
      });

      // .then((res) => {
      //   console.log(res.data);
      //   setKycDetail(res.data);
      // })
      // .catch((error) => {
      //   console.log(error);
      // });
    }
  }, []);

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true);

    axios
      .post(`${import.meta.env.VITE_API_SERVER}/kyc/verify`, values, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + getCookie('token'),
        },
      })
      .then((res) => {
        console.log('success');
        console.log(res.data);
        showStatusModal(submissionStatus.SUCCESS);
        setIsLoading(false);
        setKycDetail(res.data);
        toast.success(
          'Your KYC verification has been submitted successfully. You can now participate in the auction on our platform.'
        );
        auth.fetchProfile();
        // Handle success...
      })
      .catch((error) => {
        setIsLoading(false);
        showStatusModal(submissionStatus.ERROR);
        showErrorToast(error);

        // Handle error...
      });

    console.log(values);
  }

  return (
    <>
      <div className="w-full lg:w-3/4 xl:w-1/2 flex flex-col gap-12">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>Ekyc Detail</CardTitle>
                <CardDescription>View and manage your verification details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    {kycDetail === null ? (
                      <div>
                        <FormField
                          control={form.control}
                          name="frontImage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Front Image</FormLabel>
                              <FormControl>
                                <DropzoneComponent
                                  {...field}
                                  maxFiles={1}
                                  fieldMessage="
                                                Drag 'n' drop your front identity images here, or click to select images
                                                "
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="backImage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Back Image</FormLabel>
                              <FormControl>
                                <DropzoneComponent
                                  {...field}
                                  maxFiles={1}
                                  fieldMessage="Drag 'n' drop your front identity images here, or click to select images"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ) : (
                      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
                        <div className="space-y-4">
                          <div className="text-gray-900">
                            <p className="font-semibold">
                              CardID: <span className="font-normal">{kycDetail.cardId}</span>
                            </p>
                            <p className="font-semibold">
                              FullName: <span className="font-normal">{kycDetail.fullName}</span>
                            </p>
                            <p className="font-semibold">
                              Birthday: <span className="font-normal">{kycDetail.birthday}</span>
                            </p>
                            <p className="font-semibold">
                              Gender: <span className="font-normal">{kycDetail.gender ? 'Male' : 'Female'}</span>
                            </p>
                            <p className="font-semibold">
                              Address: <span className="font-normal">{kycDetail.address}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="grid gap-2"></div>
                </div>
              </CardContent>
              <CardFooter>
                {!kycDetail && (
                  <div className="flex gap-4">
                    {isLoading ? (
                      <Button disabled>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Please wait
                      </Button>
                    ) : (
                      <Button type="submit">Verify</Button>
                    )}
                  </div>
                )}
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </>
  );
}

enum submissionStatus {
  SUCCESS,
  ERROR,
}

const showStatusModal = (status: submissionStatus) => {
  return (
    <AlertDialog defaultOpen>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{status === submissionStatus.ERROR ? 'Error' : 'Success'}</AlertDialogTitle>
        </AlertDialogHeader>
        {status === submissionStatus.ERROR
          ? '  There was an error submitting your KYC verification. Please upload a better images and try again.'
          : ' Your KYC verification has been submitted successfully.You can now participate in the auction on our platform.'}
        Your KYC verification has been submitted successfully. You can now participate in the auction on our platform.
        <AlertDialogFooter>
          <AlertDialogAction>
            <Button>Close</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
