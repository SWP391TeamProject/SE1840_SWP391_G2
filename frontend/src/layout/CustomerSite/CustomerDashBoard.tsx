import DashBoardNavBar from "@/components/NavBar/DashBoardNavBar";
import NavBar from "@/components/NavBar/NavBar";
import Footer from "@/components/footer/Footer";
import React from "react";
import { Outlet } from "react-router-dom";

export default function CustomerDashBoard() {
    return <div>
        <div className="sticky top-0 z-10 w-full">
            <DashBoardNavBar />
        </div>
        <div className="min-h-screen">
            <Outlet></Outlet>
        </div>
        <div className="sticky min z-10 w-full">
            <Footer />
        </div>
    </div>
}
