import NavBar from "@/components/NavBar/NavBar";
import { Outlet } from "react-router-dom";
import { LandingPageLayout } from "./landing-page-layout";
// import { AuctionSession } from "@/components/component/auction-session";

export default function HomeLayout() {
  return (
    <div>
      {/* <NavBar /> */}
      {/* <LandingPageLayout /> */}
      {/* <AuctionSession /> */}
      <Outlet></Outlet>
    </div>
  );
}
