// import "../components/loading.css";

import LoadingAnimation from "@/components/loadingAnimation/LoadingAnimation";
import { LoaderPinwheel } from "lucide-react";
import { useEffect, useState } from "react";

const messages = [
    "Loading...",
    "Please wait...",
    "Did you know? The average human attention span is 8 seconds.",
    "The quick brown fox jumps over the lazy dog.",
    "If you're waiting for a sign, this is it.",
    "The best things come to those who wait.",
    "Good things take time.",
    "Patience is a virtue.",
    "Rome wasn't built in a day.",
    "It's worth the wait.",
    "Don't worry, be happy.",
    "Just keep swimming.",
    "The early bird catches the worm.",
    "The best is yet to come.",
    "You're almost there.",
]

export default function LoadingScreen() {
    const loadingScreenMessage = messages[Math.floor(Math.random() * messages.length)];
    
    return (
        <div className="flex items-center justify-center h-screen">
            {/* <div>
                <div className="loader m-auto ">
                    <LoaderPinwheel className=" animate-spin w-20 h-20 text-primary  " />
                </div>
                <h1 className="mt-5 text-primary">
                    Loading...
                </h1>
            </div> */}
       <LoadingAnimation message={loadingScreenMessage} />
        </div>
    )
}