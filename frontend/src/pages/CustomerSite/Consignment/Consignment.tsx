import ConsignmentInititalForm from "@/pages/CustomerSite/Consignment/ConsignmentInititalForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Consignment() {
  const nav = useNavigate();
  useEffect(() => {
    document.title = "Consignment | Biddify";

    // fetchConsignmentsService();
  }, [nav]);  
  return (
    <div>
      <ConsignmentInititalForm/>
    </div>
  );
}
