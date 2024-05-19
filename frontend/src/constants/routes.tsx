import HomeLayout from "@/layout/HomeLayout/HomeLayout";
import LoginLayout from "@/layout/LoginLayout/LoginLayout";
import path from "path";

const routes = [
  {
    path: "/",
    element: <HomeLayout />,
  },
  {
    path: "/login",
    element: <LoginLayout />,
  },
  {
    path: "/sign-up",
    element: <LoginLayout />,
  },
];

export default routes;
