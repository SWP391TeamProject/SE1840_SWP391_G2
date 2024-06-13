import Footer from "@/components/footer/Footer";
import { WhatIs } from "./WhatIs";
import { useEffect, useRef, useState } from "react";
import { OurTeam } from "./OurTeam";
import { About } from "./About";
import { Buy } from "./Buy";
import { Sell } from "./Sell";
import { Sidebar } from "./SideBar";

export default function AboutScreen() {
    const about = useRef(null);
    const ourTeam = useRef(null);
    const buy = useRef(null);
    const sell = useRef(null);
    const [aboutPosition, setAboutPosition] = useState(0);
    const [ourTeamPosition, setOurTeamPosition] = useState(0);
    const [buyPosition, setBuyPosition] = useState(0);
    const [sellPosition, setSellPosition] = useState(0);

    useEffect(() => {
        setAboutPosition(about?.current?.offsetTop);
        setOurTeamPosition(ourTeam?.current?.offsetTop);
        setBuyPosition(buy?.current?.offsetTop);
        setSellPosition(sell?.current?.offsetTop);
    }, [])
    const scrollToElement = () => {
        let currentLocation = window.location.href;
        const hasElementAnchor = currentLocation.includes("#");
        if (hasElementAnchor) {
            const anchorElementId = `${currentLocation.substring(currentLocation.indexOf("#") + 1)}`;
            const anchorElement = document.getElementById(anchorElementId);
            if (anchorElement) {
                scrollTo({top:anchorElement.offsetTop-100,behavior:"smooth"})
            }
        }
    }
    scrollToElement();
    return (
        <>
            <div className="flex container">
                <div className="p-3 basis-3/10">
                    <Sidebar
                        about={aboutPosition}
                        ourTeam={ourTeamPosition}
                        buy={buyPosition}
                        sell={sellPosition}
                    />
                </div>
                <div className="p-3 text-foreground basis-7/10">
                    <WhatIs />
                    <div ref={about}>
                        <About />
                    </div>
                    <div ref={ourTeam}>
                        <OurTeam />
                    </div>
                    <h1 id="how-it-works" className="mx-auto px-4 text-4xl font-extrabold my-16">How it works</h1>
                    <hr />
                    <hr />
                    <div ref={buy}>
                        <Buy />
                    </div>
                    <hr />
                    <hr />
                    <div ref={sell}>
                        <Sell />
                    </div>
                </div>

            </div>
            <div className="sticky z-10 w-full">
                <Footer />
            </div>

        </>
    )
}