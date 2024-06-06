import NavBar from "@/components/NavBar/NavBar";
import React from "react";
import { Outlet } from "react-router-dom";

export default function CustomerDashBoard() {
    return <div>
        <div className="sticky top-0 z-10 w-full">
            <NavBar />
        </div>
        <Outlet></Outlet>
    </div>
}
