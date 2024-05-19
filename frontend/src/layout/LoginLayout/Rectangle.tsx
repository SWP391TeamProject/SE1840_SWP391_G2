import React from "react";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function Rectangle() {
  const rectangleObject = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      gsap.from(rectangleObject.current, {
        x: -10000,
        duration: 2,
        scaleX: 0.5,
        scaleY: 0.5,
        rotate: 360,
        animation: "bounce 2s infinite",
        ease: "power2.inOut",
      });
    },
    { scope: rectangleObject }
  );

  return (
    <div
      ref={rectangleObject}
      className="xs: hidden md:w-[360px] h-[360px] bg-blue-500 rounded-md fixed bottom-[8px] left-[80px]  "
    >
      <img
        className="w-full h-full object-cover"
        src="https://th.bing.com/th/id/OIP.YnUTPsTWTIqLTL_-R5qcmgHaE8?w=238&h=180&c=7&r=0&o=5&pid=1.7"
        alt="diamond"
      />
    </div>
  );
}
