import { Suspense, lazy } from "react";
const RegisterForm = lazy(() => import("@/pages/authentication/RegisterForm"));
export default function RegisterLayout() {
  return (
    <>
      <div className="flex h-screen justify-center align-middle items-center bg-blue-500 ">
        <Suspense fallback={<div>Loading...</div>}>
          <RegisterForm />
          {/* <RegisterForm /> */}
        </Suspense>
      </div>
    </>
  );
}
