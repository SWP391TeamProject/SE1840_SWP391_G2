import { useEffect, useState } from "react";
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
import { Loader2 } from "lucide-react";
import DropzoneComponent from "../../components/drop-zone/DropZoneComponent";
import { getCookie } from "@/utils/cookies";
import { createConsignmentService } from "@/services/ConsignmentService";
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
  files: z.any()
});

export default function ConsignmentInititalForm() {
  // 1. Define your form.
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountId: JSON.parse(getCookie("user"))?.id,
      email: JSON.parse(getCookie("user"))?.email || "",
      phone: JSON.parse(getCookie("user"))?.phone || "",
      contactName: JSON.parse(getCookie("user"))?.username || "",
      preferContact: "any of the above",
      description: "",
      files: [],
    },
  });
  useEffect(() => {
    setUser(JSON.parse(getCookie("user")));
    console.log(user);
  }, [])

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    // Remove FormData creation and file handling
    createConsignmentService(data).then((res) => {
      console.log(res);
      setIsLoading(false);
    });

    console.log(data);
  };

  return (
    <>
      {
        isLoading &&
        <div className="w-screen h-screen flex justify-center items-center absolute bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 opacity-75 transition-opacity duration-500 ease-in-out">
          <div className="space-y-3 text-center">
            <Loader2 className="animate-spin text-white text-6xl" />
            <p className="text-white text-2xl">Loading...</p>
          </div>
        </div>
      }

      <div key="1" className="max-w-6xl  mx-auto p-4 sm:p-6 md:p-8">
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" name="accountId" value={JSON.parse(getCookie("user"))?.id} />
            <FormField
              control={form.control}
              name="contactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="enter your prefer contact name here"
                      defaultValue={JSON.parse(getCookie("user"))?.username}
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
                    <Input placeholder="adasd"
                      defaultValue={JSON.parse(getCookie("user"))?.email}
                      {...field}
                    />
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
                          <RadioGroupItem value="any" />
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
                    Describe the item you'd like to consign. Include any relevant
                    details about the item's condition, history, and provenance.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="files"
              render={({ field }) => (
                <DropzoneComponent {...field} />
              )}
            />

            {/* <DropzoneComponent /> */}
            {isLoading ?
              <Button variant={"default"} disabled>
                Loading
              </Button>
              :
              <Button variant={"default"} type="submit">
                Submit
              </Button>
            }
          </form>
        </Form>
      </div>


    </>

  );
}
