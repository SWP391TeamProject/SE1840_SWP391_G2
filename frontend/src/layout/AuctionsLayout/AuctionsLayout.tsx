import NavBar from "@/components/NavBar/NavBar";
import React from "react";
import { Outlet } from "react-router-dom";

export default function AuctionsLayout() {
  return <>
    <NavBar/>
    <Outlet/>
  </>;
}
