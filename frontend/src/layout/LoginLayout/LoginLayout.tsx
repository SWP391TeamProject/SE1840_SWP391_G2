import RegisterForm from "@/pages/authentication/RegisterForm";
import { Suspense, lazy } from "react";
const LoginForm = lazy(() => import("@/pages/authentication/LoginForm"));
export default function LoginLayout() {
  return (
    <>
      <div className="flex h-screen justify-center align-middle items-center ">
        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm />
          <RegisterForm />
        </Suspense>
      </div>
    </>
  );
}
