// import "../components/loading.css";

import LoadingAnimation from "@/components/loadingAnimation/LoadingAnimation";
import { LoaderPinwheel } from "lucide-react";
import { useEffect, useState } from "react";



export default function LoadingScreen() {
    
    return (
        <div className="flex items-center justify-center h-screen bg-background">
            {/* <div>
                <div className="loader m-auto ">
                    <LoaderPinwheel className=" animate-spin w-20 h-20 text-primary  " />
                </div>
                <h1 className="mt-5 text-primary">
                    Loading...
                </h1>
            </div> */}
       <LoadingAnimation />
        </div>
    )
}