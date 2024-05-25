import NavBar from "@/components/NavBar/NavBar";
import ConsignmentInititalForm from "@/pages/Consignment/ConsignmentInititalForm";
import { ConsignmentRequestForm } from "@/pages/Consignment/ConsignmentRequestForm";
import { InputForm } from "@/pages/Consignment/TestForm";
import { fetchConsignmentsService } from "@/services/ConsignmentService";
import { getCookie } from "@/utils/cookies";
import React, { useEffect } from "react";
import { Outlet, redirect, useNavigate } from "react-router-dom";

export default function ConsignmentLayout() {
  const nav = useNavigate();
  useEffect(() => {
    document.title = "Consignment | Biddify";

    // fetchConsignmentsService();
  }, [nav]);
  return (
    <div>
      <NavBar />
      <ConsignmentInititalForm />
    </div>
  );
}
