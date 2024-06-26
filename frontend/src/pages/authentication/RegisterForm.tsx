import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {useRef, useState} from "react";
import gsap from "gsap";
import {useGSAP} from "@gsap/react";
import {useForm} from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {register} from "@/services/AuthService";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {setCookie} from "@/utils/cookies.ts";
import {Loader2} from "lucide-react";

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
        position: "bottom-right",
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
        position: "bottom-right",
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
    {scope: RegisterForm}
  );

  return (
    <Card
      className="login-form mx-auto min-w-[360px] w-1/3 my-16 h-fit border drop-shadow-md rounded-xl"
      ref={RegisterForm}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader className="">
            <CardTitle className="text-4xl text-center text-bold">
              Register 👋
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input id="name" type="text"
                               placeholder="Your name" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Your email" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password"
                               placeholder="******" {...field} />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password"
                               placeholder="******" {...field} />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
              </div>

              {isLoading
                ? <Button disabled className="bg-orange-600">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                  Please wait
                </Button>
                : <Button
                  type="submit"
                  className="w-full bg-orange-600 rounded-xl text-white hover:bg-orange-700"
                >
                  Register
                </Button>}
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?&nbsp;
              <a href="/auth/login" className="underline hover:text-blue-700">
                Sign in
              </a>
            </div>
          </CardContent>

        </form>
      </Form>
    </Card>
  );
}

export default RegisterForm;
