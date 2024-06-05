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
import DashBoard from "./pages/dashboard/DashBoard.tsx";
import { LandingPageLayout } from "./layout/HomeLayout/landing-page-layout.tsx";
import PrivateRoute from "./pages/authentication/PrivateRoute.tsx";
import Unauthorized from "./pages/authentication/Unauthorized.tsx";
import { AuthProvider } from "./AuthProvider.tsx";
import { Roles } from "./constants/enums.tsx";
import ConsignmentLayout from "./layout/ConsignmentLayout/ConsignmentLayout.tsx";
import AuctionsLayout from "./layout/AuctionsLayout/AuctionsLayout.tsx";
import AuctionList from "./pages/Auctions/AuctionList.tsx";
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
import AuctionSessionDetail from "./pages/Administration/Auction-session/AuctionSessionDetail.tsx";
import ProfileLayout from "./layout/ProfileLayout/ProfileLayout.tsx";
import ProfileSetting from "./layout/ProfileLayout/ProfileSetting.tsx";
import ProfileDetail from "./layout/ProfileLayout/ProfileDetail.tsx";
import { getCookie } from "./utils/cookies.ts";
import AddAuctionItems from "./pages/Administration/Auction-session/AddAuctionItems.tsx";
import About from "./pages/about/About.tsx";
import ItemDetail from "./pages/Administration/item/itemDetail/ItemDetail.tsx";


const router = createBrowserRouter(routes);
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId="456982582712-hhilqsfqccnkfvrc8mnqkcf0klchmesm.apps.googleusercontent.com">
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      <Provider store={store}>
        <TooltipProvider>
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                {/* <Route path="/" element={<HomeLayout />}> */}
                <Route path="/" element={<LandingPageLayout />}></Route>

                {/* Administration */}
                <Route
                  element={
                    <PrivateRoute
                      allowedRoles={[Roles.ADMIN, Roles.STAFF, Roles.MANAGER]}
                    />
                  }
                >
                  <Route path="/admin" element={<Administration />}>
                    <Route path="dashboard" element={<DashBoard />}></Route>
                    <Route element={<PrivateRoute allowedRoles={[Roles.ADMIN]} />} >
                      <Route path="accounts" element={<AccountsList />}></Route>
                      <Route path="accounts/edit" element={<AccountEdit />}></Route>
                      <Route path="accounts/create" element={<AccountCreate />}></Route>
                    </Route>
                    <Route element={<PrivateRoute allowedRoles={[Roles.MANAGER, Roles.ADMIN]} />} >
                      <Route path="auction-sessions" element={<AuctionSessionList />}></Route>
                      <Route path="auction-sessions/create" element={<AuctionSessionCreate />}></Route>
                      <Route path="auction-sessions/:id" element={<AuctionSessionDetail/>}></Route>

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
                      {/* <Route path="accounts/create" element={<AccountCreate />}></Route> */}
                    </Route>

                  </Route>
                </Route>

                  <Route path="/about" element={<About/>}></Route>
                <Route path="/auth" element={<AuthenticationLayout />}>
                  <Route path="login" element={<LoginForm />}></Route>
                  <Route path="register" element={<RegisterForm />}></Route>
                </Route>
                <Route element={<PrivateRoute allowedRoles={[Roles.ADMIN, Roles.STAFF, Roles.MANAGER, Roles.MEMBER]} />}>
                  <Route
                    path="/consignment"
                    element={<ConsignmentLayout />}
                  ></Route>
                  <Route path="/profile" element={<ProfileLayout />}>
                    {/* <Route path="" element={<ProfileDetail profileData={JSON.parse(getCookie('user'))} />}></Route> */}
                    <Route path="/profile/settings" element={<ProfileSetting/>}></Route>

                  </Route>

                </Route>
                <Route path="/Auctions" element={<AuctionsLayout />}>
                  <Route path="/Auctions" element={<AuctionList />}></Route>
                </Route>
                <Route path="/unauthorized" element={<Unauthorized />} />
                {/* <RouterProvider router={router} /> */}
              </Routes>
            </BrowserRouter>
          </AuthProvider>
          {/* <RouterProvider router={router} /> */}
        </TooltipProvider>
      </Provider>
    </QueryClientProvider>
  </GoogleOAuthProvider>


);
