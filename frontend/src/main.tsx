import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, RouterProvider, Routes, createBrowserRouter } from "react-router-dom";
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


const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeLayout/>}>
            <Route path="/" element={<Home/>}></Route>
          </Route>
          <Route path="/admin" element={<Administration/>}>
            <Route path="/admin" element={<DashBoard/>}></Route>
            <Route path="accounts" element={<AccountsList/>}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
      {/* <RouterProvider router={router} /> */}
    </TooltipProvider>
  </Provider>
);
