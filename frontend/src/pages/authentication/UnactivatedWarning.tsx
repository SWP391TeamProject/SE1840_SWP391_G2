import { Card } from "@/components/ui/card";
import { useRef } from "react";
import {Button} from "@/components/ui/button.tsx";
import {getCookie} from "@/utils/cookies.ts";
import {AuthResponse} from "@/models/AuthResponse.ts";

function UnactivatedWarning() {
    const UnactivatedWarning = useRef<HTMLDivElement>(null);
    const user = JSON.parse(getCookie('unactivated-user')) as AuthResponse;

    return (
        <Card
            className="w-3/6 h-3/4 mt-20 border drop-shadow-md rounded-xl"
            ref={UnactivatedWarning}
        >
            <div className="basis-full md:basis-1/2 w-full p-10">
                <h1 className="text-3xl mb-3">Activate your account</h1>
                <p>Hello {user.nickname}</p>
                <p>Please activate your account to proceed. Check your email for activation instructions or contact customer support for assistance.</p>
                <div className="flex flex-row gap-10 justify-center mt-10">
                    <Button className="flex items-center gap-2" variant="outline">
                        Resend activation code
                    </Button>
                    <Button className="flex items-center gap-2" variant="outline">
                        Contact support
                    </Button>
                </div>
            </div>
        </Card>
    );
}
export default UnactivatedWarning;