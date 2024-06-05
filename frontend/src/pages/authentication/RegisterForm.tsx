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
import { register } from "@/services/AuthService";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from '../../assets/registration_logo.jpg';
gsap.registerPlugin(useGSAP);

const formSchema = z
  .object({
    name: z.string().min(5, {
      message: "Name must be at least 8 characters.",
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema), // Use the zodResolver function
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    register(values).then((res) => {
      console.log(res);
      if (res.status === 200) {
        // toast.play("Account created successfully. Please login.",);
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
        nav("/");
      } 
    }).catch((err) => {
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
        y: -100,
        duration: 2,
        ease: "power2.inOut",
      });
    },
    { scope: RegisterForm }
  );

  return (
    <Card
      className="w-3/6 h-3/4 mt-20 border drop-shadow-md rounded-xl flex "
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
            <Link to="/auth/login" className="text-center text-blue-500"> Already have an account? Login</Link>

            <div className="flex w-full justify-center">
              <Button type="submit" className="w-4/6   rounded-2xl">
                Register
              </Button>
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
    </Card>
  );
}
export default RegisterForm;
