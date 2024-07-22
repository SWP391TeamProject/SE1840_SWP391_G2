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
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {  GetProp, Upload, UploadFile, UploadProps  } from 'antd';

import { z } from 'zod';
import { Input } from '@/components/ui/input';
import ImgCrop from 'antd-img-crop';
import { Image } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const formSchema = z.object({
  frontImage: z
    .any()
    .refine((files) => files?.fileList?.length > 0 , `Front Image is required`)
    .refine((files) => files?.fileList[0]?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.fileList[0]?.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported.'
    ),

  backImage: z
    .any()
    .refine((files) => files?.fileList?.length > 0, `Back Image is required`)
    .refine((files) => files?.fileList[0]?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.fileList[0]?.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported.'
    ),
});

export default function KycVerification() {
  const [isLoading, setIsLoading] = React.useState(false);
  const auth = useAuth();
  const [kycDetail, setKycDetail] = React.useState<any>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      frontImage: {
        file: null,
        fileList: []
      },
      backImage: {
        file: null,
        fileList: []
      },
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
    console.log(values);
    let params = {
      frontImage: values.frontImage.file,
      backImage: values.backImage.file,
    }

    let param = new FormData();
    param.append('frontImage', values.frontImage.fileList[0].originFileObj);
    param.append('backImage', values.backImage.fileList[0].originFileObj);

    console.log(param);

    axios
      .post(`${import.meta.env.VITE_API_SERVER}/kyc/verify`, param, {
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

  const onChange = (event: any) => {
    console.log(event);
  }

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleRemove = (field, fileId) => {
    // const { fileList } = this.state;
    // this.setState({ fileList: fileList.filter(item => item.uid !== fileId) });

    // const filterList = form.control._formValues[field].fileList.filter((item) => item.uid !== fileId);
    form.setValue(field, {file: null, fileList: []});
  };

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
                                <div>
                                <ImgCrop
                                  cropShape="rect"
                                  cropperProps={{
                                    cropSize: { width: 300, height: 160 },
                                    style: {},
                                    zoomSpeed: 0.1,
                                    restrictPosition: false,
                                    mediaProps: {},
                                  }}
                                  rotationSlider
                                  modalWidth={800}
                                  aspect={4 / 3}
                                  quality={0.1}
                                  minZoom={0.1}
                                >
                                  <Upload
                                    customRequest={({ file, onSuccess }) => {
                                      dummyRequest({ file, onSuccess });
                                    }}
                                    listType="picture-card"
                                    onPreview={handlePreview}
                                    {...field}
                                  >
                                    {(!field.value.file || field.value.fileList.length < 1) && '+ Upload'}
                                  </Upload>
                                </ImgCrop>
                                {previewImage && (
                                    <Image
                                      wrapperStyle={{ display: 'none' }}
                                      preview={{
                                        visible: previewOpen,
                                        onVisibleChange: (visible) => setPreviewOpen(visible),
                                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                                      }}
                                      src={previewImage}
                                    />
                                  )}
                                </div>
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
                                {/* <DropzoneComponent
                                  {...field}
                                  maxFiles={1}
                                  fieldMessage="Drag 'n' drop your front identity images here, or click to select images"
                                /> */}

                                <div>
                                  <ImgCrop
                                    cropShape="rect"
                                    cropperProps={{
                                      cropSize: { width: 300, height: 160 },
                                      style: {},
                                      zoomSpeed: 0.1,
                                      restrictPosition: false,
                                      mediaProps: {},
                                    }}
                                    rotationSlider
                                    modalWidth={800}
                                    aspect={4 / 3}
                                    quality={0.1}
                                    minZoom={0.1}
                                  >
                                    <Upload
                                      customRequest={({ file, onSuccess }) => {
                                        dummyRequest({ file, onSuccess });
                                      }}
                                      listType="picture-card"
                                      onPreview={handlePreview}
                                      // onRemove={() => {handleRemove('backImage', field.value.fileList[0].uid)}}
                                      // itemRender={(originNode, file, currFileList) => {
                                      //   // if (!file.url && !file.preview) {
                                      //   //   file.preview = await getBase64(file.originFileObj as FileType);
                                      //   // }
                                      //   const reader = new FileReader();
                                      //   reader.readAsDataURL(file.originFileObj as FileType);
                                      //   reader.onload = () => {
                                      //     file.preview = reader.result as string;
                                      //   };
                                      //   return (
                                      //     field.value.fileList.length > 0 && field.value.file != null ? (
                                      //       <div>
                                      //         <DeleteOutlined
                                      //           onClick={() => {
                                      //             // this.props.onRemove(file);
                                      //             handleRemove('backImage', field.value.fileList[0].uid);
                                      //           }}
                                      //         />
                                      //         <Image width={200} src={file.preview} />
                                      //       </div>
                                      //     ) : <></>
                                      //   );
                                      // }}
                                      {...field}
                                      
                                    >
                                      {(!field.value.file || field.value.fileList.length < 1) && '+ Upload'}
                                    </Upload>
                                  </ImgCrop>
                                  {previewImage && (
                                    <Image
                                      wrapperStyle={{ display: 'none' }}
                                      preview={{
                                        visible: previewOpen,
                                        onVisibleChange: (visible) => setPreviewOpen(visible),
                                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                                      }}
                                      src={previewImage}
                                    />
                                  )}
                                </div>

                                {/* <Input  {...field} type="file" /> */}
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {/* {form.getFieldState('backImage').invalid && form.control._formValues['backImage'].fileList.length < 1 ? (
                          <p className="text-red-400 font-bold">*Image for back of id card is required</p>
                        ) : null} */}
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
