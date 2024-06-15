import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { register } from "@/services/AuthService";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from '../../assets/registration_logo.jpg';
import { setCookie } from "@/utils/cookies.ts";
import { Loader2 } from "lucide-react";

gsap.registerPlugin(useGSAP);

const formSchema = z
  .object({
    name: z.string().min(5, {
      message: "Name must be at least 5 characters.",
    }),
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
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    register(values).then((res) => {
      console.log(res);
      toast.success("Account created successfully. Please login.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setIsLoading(false)
      setCookie("unactivated-user", JSON.stringify(res), 30000);
      nav("/auth/unactivated");
    }).catch((err) => {
      setIsLoading(false)
      console.log(err)
      toast.error(err.response.data.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    });

    console.log(values);
  }
  useGSAP(
    () => {
      gsap.from(RegisterForm.current, {
        y: -50,
        duration: 2,
        ease: "power2.inOut",
      });
    },
    { scope: RegisterForm }
  );

  return (
    <Card
      className="w-3/6 h-3/5 mt-10 border drop-shadow-md rounded-xl flex "
      ref={RegisterForm}
    >
      <div className="flex  basis-full md:basis-1/2 w-full p-3 items-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
            <p className="text-2xl font-bold text-center">Register</p>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="enter your name here" {...field} />
                  </FormControl>
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
                    <Input type="password" placeholder="******" {...field} />
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
                    <Input type="password" placeholder="******" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Link to="/auth/login" className="text-center text-blue-500"> Already have an account? Login</Link>

            <div className="flex w-full justify-center">
              {
                isLoading ?
                  <Button disabled className="w-4/6   rounded-2xl">
                    <Loader2 className="animate-spin" />

                  </Button>
                  :
                  < Button type="submit" className="w-4/6   rounded-2xl">
                    Register
                  </Button>
              }

            </div>
          </form>
        </Form>
      </div>
      {/* <div className="hidden md:flex w-full h-full  bg-gray-200 rounded-2xl"> */}
      <CardContent className="hidden md:flex justify-center items-center basis-1/2  h-full p-0 m-0 rounded-2xl">
        <img
          src={logo}
          className="w-full h-full object-contain rounded-2xl "
          alt="auction registration logo"
        />

      </CardContent>
      {/* </div> */}
    </Card >
  );
}
export default RegisterForm;
