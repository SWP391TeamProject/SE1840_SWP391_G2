import HomeLayout from "@/layout/HomeLayout/HomeLayout";
import path from "path";

const routes = [
  {
    path: "/",
    element: <HomeLayout />,
  },
  {
    path:"/login"
    Element: <LoginLayout />
  }
];

export default routes;
