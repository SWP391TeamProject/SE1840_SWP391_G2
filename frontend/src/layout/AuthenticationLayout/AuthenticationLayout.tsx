import NavBar from "@/components/NavBar/NavBar";
import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";

export default function AuthenticationLayout() {
    return (
        <>

            <div className="flex flex-col w-screen min-h-full justify-start align-middle  items-center ">
                <NavBar />

                <Suspense fallback={<div>Loading...</div>}>
                    <Outlet />
                </Suspense>
            </div>
        </>)
}
