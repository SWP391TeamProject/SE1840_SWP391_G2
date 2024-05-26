import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod"; // Import the zodResolver function
import { date, z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { registerAccountService } from "@/services/AuthService";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(useGSAP);

const formSchema = z
  .object({
    email: z.string().email({
      message: "Invalid email address.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    // rememberMe: z.boolean(),
    confirmPassword: z.string(),
  })
  .refine(
    (data) => {
      return data.password === data.confirmPassword;
    },
    {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    }
  );
function RegisterForm() {
  const RegisterForm = useRef<HTMLDivElement>(null);
  const nav = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema), // Use the zodResolver function
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    registerAccountService(values).then((res) => {
      console.log(res);
      if (res.status === 200) {
        console.log("Account created successfully");
        nav("/");
      }
    });

    console.log(values);
  }
  useGSAP(
    () => {
      gsap.from(RegisterForm.current, {
        y: -100,
        duration: 2,
        ease: "power2.inOut",
      });
    },
    { scope: RegisterForm }
  );

  return (
    <Card
      className="w-3/6 h-3/4 border drop-shadow-md rounded-xl flex "
      ref={RegisterForm}
    >
      <div className="flex  basis-full md:basis-1/2  w-full p-3 items-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <p className="text-2xl font-bold text-center">Register</p>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="enter your email here" {...field} />
                  </FormControl>
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
                    <Input type="text" placeholder="******" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="******" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex w-full justify-center">
              <Button type="submit" className="w-4/6 rounded rounded-2xl">
                Register
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <div className="hidden md:flex w-full h-full basis-1/2 bg-gray-200">
        <CardContent className="hidden md:flex bg-red-500 h-full p-0 m-0">
          <img
            src="https://th.bing.com/th/id/OIP.s6XJW4oxNuygw7C4UBnZggHaEK?rs=1&pid=ImgDetMain"
            className="w-full h-full object-contain"
            alt="Description of the image"
          />
        </CardContent>
      </div>
    </Card>
  );
}
export default RegisterForm;
