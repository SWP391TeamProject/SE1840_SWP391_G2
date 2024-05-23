import ReactDOM from "react-dom/client";
import "./index.css";
import {
  BrowserRouter,
  Route,
  RouterProvider,
  Routes,
  createBrowserRouter,
} from "react-router-dom";
import routes from "./constants/routes.tsx";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { store } from "./redux/store.tsx";
import { TooltipProvider } from "./components/ui/tooltip.tsx";
import HomeLayout from "./layout/HomeLayout/HomeLayout.tsx";
import Administration from "./layout/Administration/Administration.tsx";
import AccountsList from "./pages/Administration/AccountsList.tsx";
import DashBoard from "./pages/dashboard/DashBoard.tsx";
import LoginLayout from "./layout/LoginLayout/LoginLayout.tsx";
import RegisterLayout from "./layout/RegisterLayout/RegisterLayout.tsx";
import { LandingPageLayout } from "./layout/HomeLayout/landing-page-layout.tsx";
import PrivateRoute from "./pages/authentication/PrivateRoute.tsx";
import Unauthorized from "./pages/authentication/Unauthorized.tsx";
import { AuthProvider } from "./AuthProvider.tsx";
import { Roles } from "./constants/enums.tsx";
import ConsignmentLayout from "./layout/ConsignmentLayout/ConsignmentLayout.tsx";

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <TooltipProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* <Route path="/" element={<HomeLayout />}> */}
            <Route path="/" element={<LandingPageLayout />}></Route>

            {/* </Route> */}
            <Route
              element={
                <PrivateRoute
                  allowedRoles={[Roles.ADMIN, Roles.STAFF, Roles.MANAGER]}
                />
              }
            >
              <Route path="/admin" element={<Administration />}>
                <Route path="/admin" element={<DashBoard />}></Route>
                <Route path="accounts" element={<AccountsList />}></Route>
              </Route>
            </Route>
            <Route path="/auth">
              <Route path="/auth/login" element={<LoginLayout />}></Route>
              <Route path="/auth/register" element={<RegisterLayout />}></Route>
            </Route>
            <Route path="/unauthorized" element={<Unauthorized />} />
            {/* <RouterProvider router={router} /> */}
            {/* <Route element={<PrivateRoute allowedRoles={[Roles.MEMBER]} />}> */}
            <Route path="/consignment" element={<ConsignmentLayout />}></Route>
            {/* </Route> */}
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      {/* <RouterProvider router={router} /> */}
    </TooltipProvider>
  </Provider>
);
