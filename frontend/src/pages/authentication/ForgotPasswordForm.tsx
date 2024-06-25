import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Loader2} from "lucide-react";
import {useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {requestResetPassword} from "@/services/AuthService.ts";
import {toast} from "react-toastify";
import {Card} from "@/components/ui/card.tsx";

type FormValues = {
    email: string;
};

function ForgotPasswordForm() {
    const {register, handleSubmit} = useForm<FormValues>({
        defaultValues: {
            email: ""
        }
    });
    const [locked, setLocked] = useState(false);
    const [sent, setSent] = useState(false);

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        setLocked(true);
        requestResetPassword(data)
            .then(() => {
                setLocked(false);
                setSent(true);
                toast.success("Sent reset password link to your email",{
                    position:"bottom-right",
                });
            })
            .catch(err => {
                toast.error(err.response.data.message,{
                    position:"bottom-right",
                });
                setLocked(false);
            });
    };

    return (
        <Card className="w-3/6 h-3/4 mt-20 border drop-shadow-md rounded-xl">
            <div className="basis-full md:basis-1/2 w-full p-10">
                <h1 className="text-3xl mb-3">Forgot password</h1>
                <div className="flex flex-row gap-10 justify-center mt-10">
                    {sent ? (
                        <div>
                            An email has been sent to your inbox. Follow the
                            instructions inside to continue resetting the
                            password.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid gap-4">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    {...register("email")}
                                    placeholder="m@example.com"
                                    required
                                />
                                {locked
                                    ?
                                    <Button disabled className="bg-orange-600">
                                        <Loader2
                                            className=" mr-2 h-4 w-4 animate-spin"/>
                                        Please wait
                                    </Button>
                                    : <Button
                                        type="submit"
                                        className=" w-full  bg-orange-600 rounded-xl text-white  hover:bg-orange-700"
                                    >
                                        Reset password
                                    </Button>}
                                <div>
                                    An email will be sent to your inbox. Follow
                                    the instructions inside to continue
                                    resetting the password.
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </Card>
    );
}

export default ForgotPasswordForm;