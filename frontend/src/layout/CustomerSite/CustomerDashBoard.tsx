import DashBoardNavBar from "@/components/NavBar/DashBoardNavBar";
import NavBar from "@/components/NavBar/NavBar";
import Footer from "@/components/footer/Footer";
import React from "react";
import { Outlet } from "react-router-dom";

export default function CustomerDashBoard() {
    return <div className="min-h-screen flex flex-col dark:bg-black text-foreground">
        <div className="sticky top-0 z-10 w-full h-fit">
            <DashBoardNavBar />
        </div>
        <div className="w-full grow">
            <Outlet></Outlet>
        </div>
        <div className="min z-10 w-full text-foreground h-fit">
            <Footer />
        </div>
    </div>
}
