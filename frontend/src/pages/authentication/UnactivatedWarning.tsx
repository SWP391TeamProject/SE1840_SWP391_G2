import {Card} from "@/components/ui/card";
import {useRef, useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {getCookie} from "@/utils/cookies.ts";
import {AuthResponse} from "@/models/AuthResponse.ts";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Loader2} from "lucide-react";
import {SubmitHandler, useForm} from "react-hook-form";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import {requestActivateAccount} from "@/services/AuthService.ts";

type FormValues = {
    email: string;
};

function UnactivatedWarning() {
    const UnactivatedWarning = useRef<HTMLDivElement>(null);
    const user = JSON.parse(getCookie('unactivated-user') ?? "{}") as AuthResponse;
    const { register, handleSubmit } = useForm<FormValues>({
        defaultValues: {
            email: user.email ?? ""
        }
    });
    const [locked, setLocked] = useState(false);
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        setLocked(true);
        requestActivateAccount(data)
            .then(() => {
                setLocked(false);
                navigate("/auth/login");
                toast.success('Sent activation code')
            })
            .catch(err => {
                toast.error(err.response.data.message);
                setLocked(false);
            });
    };

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
                    <Dialog>
                        <DialogTrigger className="flex items-center gap-2" asChild>
                            <Button variant="outline">Resend activation code</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[660px]">
                            <DialogHeader>
                                <DialogTitle>Enter your email</DialogTitle>
                            </DialogHeader>
                            <ScrollArea className="w-full h-96">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="grid gap-4 p-10">
                                        <Input
                                            id="email"
                                            type="email"
                                            {...register("email")}
                                            placeholder="m@example.com"
                                            required
                                        />
                                        {locked
                                            ? <Button disabled className="bg-orange-600">
                                                <Loader2 className=" mr-2 h-4 w-4 animate-spin" />
                                                Please wait
                                            </Button>
                                            : <Button
                                                type="submit"
                                                className=" w-full  bg-orange-600 rounded-xl text-white  hover:bg-orange-700"
                                            >
                                                Send activation code
                                            </Button>}
                                    </div>
                                </form>
                            </ScrollArea>
                        </DialogContent>
                    </Dialog>
                    <Button className="flex items-center gap-2" variant="outline" onClick={() => navigate("/contact")}>
                        Contact support
                    </Button>
                </div>
            </div>
        </Card>
    );
}
export default UnactivatedWarning;