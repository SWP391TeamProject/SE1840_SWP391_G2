import NavBar from "@/components/NavBar/NavBar";
import { Outlet } from "react-router-dom";
import { LandingPageLayout } from "./landing-page-layout";

export default function HomeLayout() {
  return (
    <div>
      {/* <NavBar /> */}
      <LandingPageLayout />
      <Outlet></Outlet>
    </div>
  );
}
