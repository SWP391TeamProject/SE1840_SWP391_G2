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
import DropzoneComponent from "../../../components/drop-zone/DropZoneComponent";
import { getCookie } from "@/utils/cookies";
import { createConsignmentService } from "@/services/ConsignmentService";
import LoadingAnimation from "@/components/loadingAnimation/LoadingAnimation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { mailRegex, phoneRegex } from "@/constants/regex";
const MAX_FILE_measurement = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
import thumbnail1 from "@/assets/thumnail1.jpg";
import { useAuth } from "@/AuthProvider";
import { Link } from "react-router-dom";


const formSchema = z.object({
  accountId: z.number(),
  email: z.string().regex(mailRegex, { message: "Invalid email address" }),
  phone: z.string().regex(phoneRegex, { message: "Invalid phone number. Must be a 10-digit phone number." }),
  contactName: z.string().min(1, { message: "Contact name cannot be empty" }),
  // age: z.coerce.number().min(0, { message: "Age must be a positive number" }),
  metal: z.string().optional(),
  condition: z.string().optional(),
  gemstone: z.string().optional(),
  measurement: z.string().optional(),
  stamped: z.string().optional(),
  weight: z.coerce.number().max(10000, { message: "Weight cannot exceed 10000g" }).min(0, { message: "Weight must be a positive number" }),
  preferContact: z.enum(["email", "phone", "text", "any"]),
  description: z.string().min(10, { message: "Description must be between 10 and 500 characters" }).max(500, { message: "Description must be between 10 and 500 characters" }),
  files: z.array(z.any()).min(1, { message: "You must upload at least 1 image" }).max(5, { message: "You can only upload up to 5 images" })
});

export default function ConsignmentInititalForm() {
  // 1. Define your form.
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(false)
  const auth = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountId: auth.user.accountId,
      email: auth.user.email,
      phone: auth.user.phone,
      contactName: auth.user.nickname,
      preferContact: "any",
      description: "",
      metal: "",
      condition: "",
      gemstone: "",
      measurement: "",
      stamped: "",
      weight: 0,
      files: [],
    },
  });
  useEffect(() => {
    setUser(JSON.parse(getCookie("user")));
    console.log(user);
    window.scrollTo(0, 0)
  }, [])

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
    setIsLoading(true);
    // Remove FormData creation and file handling
    createConsignmentService(data).then((res) => {
      console.log(res);
      if (res.status >= 200 && res.status < 300) {
        form.resetField("files");
        form.resetField("description");
        toast.success("Consignment created successfully", {
          position: "bottom-right",
        });
      }
      setIsLoading(false);
    }).catch((err) => {
      if (err.response.status === 413) {
        toast.error("File measurement is too large", {
          position: "bottom-right",
        });
      } else {
        toast.error("Failed to create consignment", {
          position: "bottom-right",
        });
      }
      setIsLoading(false);
    }
    );
    console.log(data);

  };

  return (
    <>
      {
        isLoading ?
          <LoadingAnimation />
          :

          <div className="w-full min-h-screen flex flex-row flex-nowrap container">

            <div key="1" className="flex justify-start align-top flex-col basis-4/4 md:basis-2/4 max-w-6xl p-4 sm:p-6 md:p-8">
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
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                  <input type="hidden" name="accountId" value={JSON.parse(getCookie("user"))?.id} />

                  <FormField
                    control={form.control}
                    name="contactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your preferred contact name here"
                            defaultValue={JSON.parse(getCookie("user"))?.nickname}
                            
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>This is the name we use to contact you</FormDescription>
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
                          <Input
                            placeholder="Your Email"
                            defaultValue={JSON.parse(getCookie("user"))?.email}
                            
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>This is the email we use to contact you</FormDescription>
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
                          <Input
                            placeholder="Enter your phone number here"
                            
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>This is the phone we use to contact you</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <h3 className="text-md font-semibold text-red-600">
                    If you want to modify this information, please navigate to your
                    <span className="underline">
                      <Link to={"/profile/overview"}>profile</Link>
                    </span>.
                  </h3>

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
                              <FormLabel className="font-normal">Text message</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="any" />
                              </FormControl>
                              <FormLabel className="font-normal">Any of the above</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-row justify-start gap-3">
                    <FormField
                      control={form.control}
                      name="metal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Metal</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="Enter item metal" {...field} className="w-36" />
                          </FormControl>
                          <FormDescription>
                            Enter the metal of the item (e.g. gold, silver, etc.)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="condition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Condition</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter item condition" {...field} className="w-36" />
                          </FormControl>
                          <FormDescription>
                            Enter the condition of the item (e.g. new, used, etc.)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gemstone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gemstone</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter item gemstone" {...field} className="w-36" />
                          </FormControl>
                          <FormDescription>
                            Enter the gemstone of the item (if any)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex flex-row justify-start gap-3">
                    <FormField
                      control={form.control}
                      name="measurement"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>measurement</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter item measurement" {...field} className="w-36" />
                          </FormControl>
                          <FormDescription>
                            Enter the measurement of the item in cm(e.g 2-1/4 x 1/2 cm)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="Enter item weight" {...field} className="w-36" />
                          </FormControl>
                          <FormDescription>
                            Enter the weight of the item in grams
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="stamped"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stamped</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="Enter stamp details" {...field} className="w-36" />
                          </FormControl>
                          <FormDescription>
                            Enter any stamp details on the item (e.g. 925, 14k, etc.)
                          </FormDescription>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                  </div>



                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter your item description here" {...field} />
                        </FormControl>
                        <FormDescription>
                          Provide any additional detail of the  item you'd like to consign. Include any relevant details about the item's condition, history, and provenance.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <ScrollArea className="h-[200px]">
                    <FormField
                      control={form.control}
                      name="files"
                      render={({ field }) => (
                        <DropzoneComponent {...field} />
                      )}
                    />
                  </ScrollArea>

                  {form.getFieldState("files").invalid && form.control._formValues["files"].length <= 0 ? (
                    <p className="text-red-400 font-bold">*You must include at least one image of your item</p>
                  ) : null}

                  {form.getFieldState("files").invalid && form.control._formValues["files"].length > 5 ? (
                    <p className="text-red-400 font-bold">*You can only upload up to 5 images</p>
                  ) : null}

                  {isLoading ? (
                    <Button variant={"default"} disabled>
                      Loading
                    </Button>
                  ) : (
                    <div className="sticky bottom-2 flex flex-col justify-center w-full">
                      <Separator className="my-2 w-full" />
                      <Button variant={"default"} type="submit">
                        Submit
                      </Button>
                    </div>
                  )}
                </form>
              </Form>

            </div>

            <div className="hidden md:block basis-2/4 p-5">
              <img
                src={thumbnail1}
                alt="Side Image"
                className="object-cover w-full h-full border rounded-lg shadow-lg"
              />
            </div>
          </div>

      }

    </>

  );
}
