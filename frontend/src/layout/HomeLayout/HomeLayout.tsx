import NavBar from "@/components/NavBar/NavBar";
import { Outlet } from "react-router-dom";

export default function HomeLayout() {
  return (
    <div>
      <NavBar />
      <Outlet></Outlet>
    </div>
  );
}
