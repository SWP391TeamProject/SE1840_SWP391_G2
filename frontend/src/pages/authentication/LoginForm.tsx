import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useContext, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SubmitHandler, useForm } from "react-hook-form";
import AuthContext from "@/AuthProvider";
import { useLocation, useNavigate } from "react-router-dom";
gsap.registerPlugin(useGSAP);
type FormValues = {
  email: string;
  password: string;
};

function LoginForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";
  const loginForm = useRef<HTMLDivElement>(null);
  // const {authenticated, role} = useContext(AuthContext);
  const {user, setUser} = useContext(AuthContext);
  const { register, handleSubmit } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        localStorage.setItem("token", data.accessToken);
        setUser(data)
        navigate(from, { replace: true });
      });
  };

  useGSAP(
    () => {
      gsap.from(loginForm.current, {
        y: -100,
        duration: 2,
        ease: "power2.inOut",
      });
    },
    { scope: loginForm }
  );

  return (
    <Card
      className="login-form mx-auto  min-w-[360px] w-1/3 mt-10 h-fit border drop-shadow-md rounded-xl"
      ref={loginForm}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader className="">
          <CardTitle className="text-4xl text-center text-bold">
            Welcome Back 👋
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
                <a href="#" className="ml-auto inline-block text-sm underline">
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
            <a href="/auth/register" className="underline">
              Sign up
            </a>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
export default LoginForm;
