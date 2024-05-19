import { Suspense, lazy } from "react";
const LoginForm = lazy(() => import("@/pages/authentication/LoginForm"));
const Rectangle = lazy(() => import("./Rectangle"));
export default function LoginLayout() {
  return (
    <>
      <div className="flex h-screen justify-center align-middle items-center ">
        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm />
          <Rectangle />
          <div>hehehe</div>
        </Suspense>
      </div>
    </>
  );
}
