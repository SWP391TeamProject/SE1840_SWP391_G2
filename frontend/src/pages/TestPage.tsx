import { Button } from "@/components/ui/button";
import { fetchAllAuctionSessions } from "@/services/AuctionSessionService";
import React, { useEffect } from "react";
import RegisterToBid from "./global_popup/RegisterToBid";

export default function TestPage() {
    const [item, setItem] = React.useState<any>();
    const handleClick = () => {

        fetchAllAuctionSessions().then((res) => {
            console.log(res.data);
            setItem(res.data);
        }).catch((err) => {
            console.log(err);
        }
        );
        // truyen ham vao day

    }

    useEffect(() => {
        console.log("Hello");
    }, [item]);
    return <div>
        <Button onClick={handleClick}>Click Me</Button>


        <div className="flex flex-col p-4 bg-white rounded-md shadow-md">
            <div className="flex justify-between">
                    {JSON.stringify(item)}
                    <RegisterToBid />
            </div>
        </div>
    </div>;
}
