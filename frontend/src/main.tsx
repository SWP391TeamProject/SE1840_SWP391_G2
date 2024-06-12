import ReactDOM from "react-dom/client";
import "./index.css";
import {
  BrowserRouter,
  Route, Routes,
  createBrowserRouter
} from "react-router-dom";
import routes from "./constants/routes.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.tsx";
import { TooltipProvider } from "./components/ui/tooltip.tsx";
import Administration from "./layout/Administration/Administration.tsx";
import AccountsList from "./pages/Administration/Account/AccountsList.tsx";
import DashBoard from "./pages/Administration/dashboard/DashBoard.tsx";
// import { LandingPageLayout } from "./layout/HomeLayout/landing-page-layout.tsx";
import PrivateRoute from "./pages/authentication/PrivateRoute.tsx";
import { AuthProvider } from "./AuthProvider.tsx";
import { Roles } from "./constants/enums.tsx";
import AuctionList from "./pages/CustomerSite/Auctions/AuctionList.tsx";
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AccountEdit from "./pages/Administration/Account/AccountEdit.tsx";
import AccountCreate from "./pages/Administration/Account/AccountCreate.tsx";
import AuctionSessionList from "./pages/Administration/Auction-session/AuctionSessionList.tsx";
import AuctionSessionCreate from "./pages/Administration/Auction-session/AuctionSessionCreate.tsx";
import { GoogleOAuthProvider } from '@react-oauth/google';
import AuthenticationLayout from "./layout/AuthenticationLayout/AuthenticationLayout.tsx";
import RegisterForm from "./pages/authentication/RegisterForm.tsx";
import LoginForm from "./pages/authentication/LoginForm.tsx";
import ConsignmentList from "./pages/Administration/consignments/ConsignmentList.tsx";
import ConsignmentDetail from "./pages/Administration/consignments/ConsignmentDetail.tsx";
import ItemsList from "./pages/Administration/item/ItemsList.tsx";
import SendEvaluationForm from "./pages/Administration/consignments/SendEvaluation.tsx";
import ProfileLayout from "./pages/CustomerSite/Profile/Profile.tsx";
import ProfileSetting from "./pages/CustomerSite/Profile/ProfileSetting.tsx";
import ProfileDetail from "./pages/CustomerSite/Profile/ProfileDetail.tsx";
import { getCookie } from "./utils/cookies.ts";
import AddAuctionItems from "./pages/Administration/Auction-session/AddAuctionItems.tsx";
import ItemDetail from "./pages/Administration/item/itemDetail/ItemDetail.tsx";
import AboutScreen from "./pages/CustomerSite/About/AboutScreen.tsx";
import { Contact } from "./pages/CustomerSite/Contact/Contact.tsx";
import UnactivatedWarning from "@/pages/authentication/UnactivatedWarning.tsx";
import CustomerLayout from "./layout/CustomerSite/CustomerLayout.tsx";
import { LandingPage } from "./pages/CustomerSite/LandingPage/LandingPage.tsx";
import Consignment from "./pages/CustomerSite/Consignment/Consignment.tsx";
import AuctionSession from "./pages/CustomerSite/Auctions/AuctionSession.tsx";
import ForgotPasswordForm from "@/pages/authentication/ForgotPasswordForm.tsx";
import ActivationForm from "@/pages/authentication/ActivationForm.tsx";
import ResetPasswordForm from "@/pages/authentication/ResetPasswordForm.tsx";
import CustomerDashBoard from "./layout/CustomerSite/CustomerDashBoard.tsx";

import { ErrorPage } from "./components/component/error-page.tsx";
import AuctionJoin from "./pages/CustomerSite/Auctions/AuctionJoin.tsx";
import CustomerDashboard from "./pages/CustomerSite/dashboard/CustomerDashboard.tsx";
import CustomerConsignmentList from "./pages/CustomerSite/dashboard/CustomerConsignmentList.tsx";
import TestPage from "./pages/TestPage.tsx";
import { Bids } from "./pages/CustomerSite/dashboard/bids/Bids.tsx";
import NotificationsList from "@/pages/CustomerSite/Profile/Notification.tsx";
import ItemCreate from "./pages/Administration/item/ItemCreate.tsx";
import Balance from "./pages/CustomerSite/Profile/Balance.tsx";
import PaymentStatus from "./pages/CustomerSite/Profile/PaymentStatus.tsx";
import ThemeProvider from "./components/component/ThemeProvider.tsx";
import AssignAuctionItem from "./pages/Administration/Auction-session/AssignAuctionItem.tsx";
import ToBeImplemented from "./pages/ToBeImplemented.tsx";
import AuctionSessionDetail from "./pages/Administration/Auction-session/Auction-Session-Detail/AuctionSessionDetail.tsx";


const router = createBrowserRouter(routes);
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")!).render(

  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme" >

    <GoogleOAuthProvider clientId="456982582712-hhilqsfqccnkfvrc8mnqkcf0klchmesm.apps.googleusercontent.com">
      <QueryClientProvider client={queryClient}>
        <ToastContainer />
        <Provider store={store}>
          <AuthProvider>
            <TooltipProvider>
              <BrowserRouter>
                <Routes>
                  {/* <Route path="/" element={<HomeLayout />}> */}
                  {/* Customer Site */}
                  <Route path="/" element={<CustomerLayout />}>


                    <Route path="/" element={<LandingPage />}></Route>
                    <Route path="contact" element={<Contact />}></Route>
                    <Route path="about" element={<AboutScreen />}></Route>
                    <Route path="Auctions" element={<AuctionList />}></Route>
                    <Route path="Auctions/details" element={<AuctionSession />}></Route>
                    <Route path="Auctions/:id" element={<AuctionSession />}></Route>
                    <Route path="Auctions/:id/:id" element={<AuctionJoin />} />
                    <Route element={<PrivateRoute allowedRoles={[Roles.ADMIN, Roles.STAFF, Roles.MANAGER, Roles.MEMBER]} />}>
                      <Route
                        path="create-consignment"
                        element={<Consignment />}
                      ></Route>
                      <Route path="consignments" element={<CustomerConsignmentList />}>
                        <Route path="consignments/:id" element={<CustomerConsignmentList />}></Route>
                      </Route>
                      <Route path="/profile" element={<ProfileLayout />}>
                        <Route path="overview" element={<ProfileDetail />}></Route>
                        <Route path="/profile/settings" element={<ProfileSetting />}></Route>
                        <Route path="/profile/notification" element={<NotificationsList />}></Route>
                        <Route path="/profile/balance" element={<Balance />}></Route>

                      </Route>
                    </Route>
                  </Route>
                  <Route path="/dashboard" element={<CustomerDashBoard />}>
                    <Route path="" element={<CustomerDashboard />}></Route>
                    <Route path="consignments" element={<CustomerConsignmentList />}></Route>
                    <Route path="bids" element={<Bids />}></Route>
                  </Route>
                  {/* Administration */}
                  <Route
                    element={
                      <PrivateRoute
                        allowedRoles={[Roles.ADMIN, Roles.STAFF, Roles.MANAGER]}
                      />
                    }
                  >
                    <Route path="/admin" element={<Administration />}>
                      <Route path="dashboard" element={<ToBeImplemented />}></Route>
                      <Route element={<PrivateRoute allowedRoles={[Roles.ADMIN]} />} >
                        <Route path="accounts" element={<AccountsList />}></Route>
                        <Route path="accounts/:id" element={<AccountEdit />}></Route>
                        <Route path="accounts/create" element={<AccountCreate />}></Route>
                      </Route>
                      <Route element={<PrivateRoute allowedRoles={[Roles.MANAGER, Roles.ADMIN]} />} >
                        <Route path="auction-sessions" element={<AuctionSessionList />}></Route>
                        <Route path="auction-sessions/create" element={<AuctionSessionCreate />}></Route>
                        <Route path="auction-sessions/:id" element={<AuctionSessionDetail />}></Route>
                        <Route path="auction-sessions/:id/assign-items" element={<AssignAuctionItem />}></Route>

                        {/* <Route path="accounts/create" element={<AccountCreate />}></Route> */}
                      </Route>
                      <Route element={<PrivateRoute allowedRoles={[Roles.MANAGER, Roles.ADMIN, Roles.STAFF]} />} >
                        <Route path="consignments" element={<ConsignmentList />}></Route>
                        <Route path="consignments/:id" element={<ConsignmentDetail />}></Route>
                        {/* <Route path="consignments/:id/sendEvaluation" element={<SendEvaluationForm />}></Route> */}
                        {/* <Route path="accounts/create" element={<AccountCreate />}></Route> */}
                      </Route>
                      <Route element={<PrivateRoute allowedRoles={[Roles.MANAGER, Roles.ADMIN]} />} >
                        <Route path="items" element={<ItemsList />}></Route>
                        <Route path="items/:id" element={<ItemDetail />}></Route>
                        <Route path="items/create" element={<ItemCreate />}></Route>
                      </Route>

                    </Route>
                  </Route>

                  <Route path="/auth" element={<AuthenticationLayout />}>
                    <Route path="login" element={<LoginForm />}></Route>
                    <Route path="register" element={<RegisterForm />}></Route>
                    <Route path="unactivated" element={<UnactivatedWarning />}></Route>
                    <Route path="forgot-password" element={<ForgotPasswordForm />}></Route>
                    <Route path="reset-password" element={<ResetPasswordForm />}></Route>
                    <Route path="activate" element={<ActivationForm />}></Route>
                  </Route>

                  <Route path="/unauthorized" element={<ErrorPage />} />
                  {/* <RouterProvider router={router} /> */}
                  <Route path="*" element={<ErrorPage />} />
                  {/* <Route path="/test" element={<TestPage />} /> */}
                </Routes>
              </BrowserRouter>
              {/* <RouterProvider router={router} /> */}

            </TooltipProvider>
          </AuthProvider>

        </Provider>
      </QueryClientProvider>
    </GoogleOAuthProvider>

  </ThemeProvider >



);
