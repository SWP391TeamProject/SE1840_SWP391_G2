import { Loader2 } from "lucide-react";
import React from "react";

export default function LoadingAnimation() {
  return <div className="w-screen max-w-screen-lg h-[80%] bg-transparent flex justify-center items-center absolute ">
    <Loader2 className="w-10 h-10 animate-spin" />
  </div>;
}
