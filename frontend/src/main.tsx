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
import Home from "./pages/Home/Home.tsx";
import LoginLayout from "./layout/LoginLayout/LoginLayout.tsx";
import LoginForm from "./pages/authentication/LoginForm.tsx";
import RegisterForm from "./pages/authentication/RegisterForm.tsx";
import RegisterLayout from "./layout/RegisterLayout/RegisterLayout.tsx";
import { LandingPage } from "./components/component/landing-page.tsx";
import { LandingPageLayout } from "./layout/HomeLayout/landing-page-layout.tsx";

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeLayout />}>
            <Route path="/" element={<LandingPageLayout />}></Route>
          </Route>
          <Route path="/admin" element={<Administration />}>
            <Route path="/admin" element={<DashBoard />}></Route>
            <Route path="accounts" element={<AccountsList />}></Route>
          </Route>
          <Route path="/auth">
            <Route path="/auth/login" element={<LoginLayout />}></Route>
            <Route path="/auth/register" element={<RegisterLayout />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
      {/* <RouterProvider router={router} /> */}
    </TooltipProvider>
  </Provider>
);
