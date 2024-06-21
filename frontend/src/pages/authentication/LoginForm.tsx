import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SubmitHandler, useForm } from "react-hook-form";
import {useAuth} from "@/AuthProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { setCookie } from "@/utils/cookies";
import { AccountStatus, Roles } from "@/constants/enums";
import { toast } from "react-toastify";
import axios from "axios";
import { Loader2 } from "lucide-react";
import googleIcon from "../../assets/icons8-google.svg";
import { AUTH_SERVER, SERVER_DOMAIN_URL } from "@/constants/domain";
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
  const [isLogin, setIsLogin] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');
  const { register, handleSubmit } = useForm<FormValues>();
  const auth = useAuth();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    setIsLogin(true);
    axios.post(`${AUTH_SERVER}/login`, data, {
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then((res) => {
        if (res.data.status == AccountStatus.DISABLED) {
          setCookie("unactivated-user", JSON.stringify(res.data), 30000);
          navigate("/auth/unactivated");
          return
        }
        if (res.data.redirect2fa) {
          navigate("/auth/verify-2fa");
          return
        }
        setIsLogin(false);
        setCookie("token", res.data.accessToken, 30000);
        setCookie("user", JSON.stringify(res.data), 30000);
        auth.fetchProfile();
        if ([Roles.ADMIN, Roles.STAFF, Roles.MANAGER].includes(res.data.role)) {
          navigate("/admin/accounts");
        } else {
          navigate(from, { replace: true });
        }
        toast.success("Logged in successfully!");
      })
      .catch(err => {
        toast.error(err.response.data.message);
        setIsLogin(false);
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

  useEffect(() => {
    console.log(token)
    if (token !== null) {
      axios.get(AUTH_SERVER+"/login-with-google?token=" + token)
        .then(res => {
          setIsLogin(false);
          console.log(res.data);
          setCookie("token", res.data.accessToken, 30000);
          setCookie("user", JSON.stringify(res.data), 30000);
          auth.fetchProfile();
          if ([Roles.ADMIN, Roles.STAFF, Roles.MANAGER].includes(res.data.role)) {
            navigate("/admin/accounts");
          } else {
            navigate(from, { replace: true, });
          }
          toast.success("Logged in successfully!");
        })
        .catch(err => {
          toast.error(err.response.data.message);
          setIsLogin(false);
        })
    }
  }, []);

  return (
    <Card
      className="login-form mx-auto  min-w-[360px] w-1/3 mt-32 h-fit border drop-shadow-md rounded-xl"
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
                <a href="/auth/forgot-password" className="ml-auto inline-block text-sm underline">
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



            {isLogin
              ? <Button disabled className="bg-orange-600">
                <Loader2 className=" mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
              : <Button
                type="submit"
                className=" w-full  bg-orange-600 rounded-xl text-white  hover:bg-orange-700"
              >
                Login
              </Button>}
            <div className="grid gap-4">
              {/* <GoogleLogin
                onSuccess={credentialResponse => {
                  console.log(credentialResponse);
                  axios.get('http://localhost:8080/auth/login-with-google?token=' + credentialResponse.credential)
                    .then(
                      res => {
                        console.log(res.data);
                        setCookie("token", res.data.accessToken, 30000);
                        setCookie("user", JSON.stringify(res.data), 30000);
                        setUser(res.data);
                        if (res.data.role.includes([Roles.ADMIN, Roles.STAFF, Roles.MANAGER])) {
                          navigate("/admin/accounts");
                        } else {
                          navigate(from, { replace: true });
                        }
                        toast.success('logged in successfully')
                      }
                    )
                }
                } /> */}

              {/* rest of your form */}
            </div>
          </div>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <a href="/auth/register" className="underline hover:text-blue-700">
              Sign up
            </a>
          </div>
          <Button
            type="button"
            className="h-fit bg-white text-black border rounded-xl m-0 w-full hover:bg-gray-200 mt-2"
            onClick={() => {
              window.location.href = `${SERVER_DOMAIN_URL}/oauth2/authorize/google?redirect_uri=${import.meta.env.VITE_FRONTEND_SERVER}/auth/login?type=google`;
            }}
          >
            <img src={googleIcon} alt="google icon" className="object-contain" width={'30px'} height={'30px'} />
            Login with Google
          </Button>
        </CardContent>

      </form>
      <div className="hidden">

        <Button >
          <a href={`${SERVER_DOMAIN_URL}/oauth2/authorize/facebook?redirect_uri=http://localhost:5173/auth/login?type=facebook`}>
            login with Facebook
          </a>
        </Button>
      </div>
    </Card>
  );
}
export default LoginForm;
