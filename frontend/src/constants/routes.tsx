import Administration from "@/layout/Administration/Administration";
import HomeLayout from "@/layout/HomeLayout/HomeLayout";
import LoginLayout from "@/layout/LoginLayout/LoginLayout";
import AccountsList from "@/pages/accounts/AccountsList";

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
    path: "/admin",
    element: <Administration />,
    children: [{
      path: "accounts",
      element: <AccountsList />,
    },
    ]
  },
];

export default routes;
