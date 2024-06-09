import { Loader2 } from "lucide-react";
import React from "react";

export default function LoadingAnimation() {
  return <div className="w-full h-full flex justify-center items-center ">
    <Loader2 className="w-10 h-10 animate-spin" />
  </div>;
}
