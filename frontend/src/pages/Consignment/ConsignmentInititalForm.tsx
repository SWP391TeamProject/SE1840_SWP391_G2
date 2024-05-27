import React from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { UploadIcon } from "lucide-react";
import DropzoneComponent from "./DropZoneComponent";
import { getCookie } from "@/utils/cookies";
import { SERVER_DOMAIN_URL } from "@/constants/Domain";
const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const formSchema = z.object({
  accountId: z.number(),
  email: z.string(),
  phone: z.string(),
  contactName: z.string(),
  preferContact: z.enum(["email", "phone", "text", "any of the above"]),
  description: z.string(),
  image: z
    .instanceof(FileList, { message: "Required" })
    .refine((file) => file?.length > 0, "A file is required.")
    .refine((files) => {
      for (let i = 0; i < files.length; i++) {
        console.log(i, files[i]);
        if (files[i].type in ACCEPTED_IMAGE_TYPES) {
          if (!ACCEPTED_IMAGE_TYPES.includes(files[i].type)) return false; // Check if it's an accepted image type
        }
      }
      return true;
    }, "Must be a valid image.")
    .refine((files) => {
      for (let i = 0; i < files.length; i++) {
        if (files[i].size > MAX_FILE_SIZE) return false; // Check if size exceeds max size
      }
      return true;
    }, "Max size reached."),
});

export default function ConsignmentInititalForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountId: JSON.parse(getCookie("user"))?.id,
      email: "",
      phone: "",
      contactName: "",
      preferContact: "any of the above",
      description: "",
      files: [],
    },
  });
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Remove FormData creation and file handling

    // Extract the relevant JSON data (excluding files)
    const jsonData = Object.keys(data).reduce((acc, key) => {
      if (key !== "files") {
        acc[key] = data[key];
      }
      return acc;
    }, {} as Record<string, any>);

    // Log the JSON data
    console.log(JSON.stringify(jsonData, null, 2)); // Pretty-print for readability
  };

  return (
    <div key="1" className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          List your item for consignment
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Fill out the form below to list your item for consignment. We'll
          review your submission and get back to you within 2 business days.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="accountId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>accountId</FormLabel>
                <FormControl>
                  <Input
                    defaultValue={JSON.parse(getCookie("user"))?.id}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  this is the Name we used to contact you
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="enter your prefer contact name here"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  this is the Name we used to contact you
                </FormDescription>
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
                <FormDescription>
                  this is the email we used to contact you
                </FormDescription>
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
                <FormDescription>
                  this is the phone we used to contact you
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="preferContact"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Communication Preferences</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="email" />
                      </FormControl>
                      <FormLabel className="font-normal">Email</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="phone" />
                      </FormControl>
                      <FormLabel className="font-normal">Phone calls</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="text" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Text message
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="any of the above" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Any of the above
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
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
                  {/* <Input type="" placeholder="sadasd" {...field} /> */}
                  <Textarea placeholder="nihaoma" {...field} />
                </FormControl>
                <FormDescription>
                  this is the account ID we used to contact you
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="files"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload Files</FormLabel>
                <FormControl>
                  <Input
                    id="files"
                    type="file"
                    accept={ACCEPTED_IMAGE_TYPES.join(", ")}
                    multiple
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Select the files you want to upload.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <DropzoneComponent />

          <Button variant={"destructive"} type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
