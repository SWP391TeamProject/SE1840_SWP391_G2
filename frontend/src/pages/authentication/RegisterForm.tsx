import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SubmitHandler, useForm } from "react-hook-form";
gsap.registerPlugin(useGSAP);
type FormValues = {
  email: string;
  password: string;
};

function RegisterForm() {
  const RegisterForm = useRef<HTMLDivElement>(null);
  const { register, handleSubmit } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        localStorage.setItem("token", data.accessToken);
      });
  };

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
      className="mx-auto  min-w-[360px] w-3/6  mt-10 h-fit border drop-shadow-md rounded-xl flex justify-center items-center flex-row"
      ref={RegisterForm}
    >
      <div className="flex basis-1/2">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader className="">
            <CardTitle className="text-4xl text-center text-bold">
              Register here
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  required
                />
              </div>
              <Button
                type="submit"
                className=" w-full  bg-orange-600 rounded-xl text-white hover:bg-orange-700"
              >
                Login
              </Button>
              <Button variant="outline" className="w-full">
                Login with Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don't have an account?{" "}
              <a href="/signup" className="underline">
                Sign up
              </a>
            </div>
          </CardContent>
        </form>
      </div>
      <div className="hidden md:flex w-full h-full  basis-1/2 bg-gray-200 ">
        <CardContent className="bg-red-500 h-fit"></CardContent>
      </div>
    </Card>
  );
}
export default RegisterForm;
