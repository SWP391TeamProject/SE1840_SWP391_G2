import NavBar from "@/components/NavBar/NavBar";
import ConsignmentInititalForm from "@/pages/Consignment/ConsignmentInititalForm";
import { ConsignmentRequestForm } from "@/pages/Consignment/ConsignmentRequestForm";
import { InputForm } from "@/pages/Consignment/TestForm";
import React from "react";
import { Outlet } from "react-router-dom";

export default function ConsignmentLayout() {
  return (
    <div>
      <NavBar />
      <ConsignmentInititalForm />
    </div>
  );
}
