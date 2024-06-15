import NavBar from "@/components/NavBar/NavBar";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/AuthProvider";

export default function CustomerLayout() {
  const auth = useAuth();
  // const nav = useNavigate();
  // useEffect(() => {
  //   document.title = "Consignment | Biddify";

  //   // fetchConsignmentsService();
  // }, [nav]);  
  return (

    <div className="bg-background text-foreground min-h-screen">
      <div className="sticky top-0 z-20 w-full ">
        <NavBar />
      </div>
      <Outlet></Outlet>
    </div>
  );
}
