import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {useRef, useState} from "react";
import {useForm} from "react-hook-form";
import {useNavigate, useSearchParams} from "react-router-dom";
import {toast} from "react-toastify";
import {Loader2} from "lucide-react";
import {activateAccount} from "@/services/AuthService.ts";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import {zodResolver} from "@hookform/resolvers/zod"
import {z} from "zod"
import {REGEXP_ONLY_DIGITS} from "input-otp";

const formSchema = z.object({
    code: z.string().length(6, {
        message: "Code must be 6 characters.",
    }).regex(/\d+/g, {
        message: "Code must only contain digits.",
    }),
})

function ActivationForm() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const activationForm = useRef<HTMLDivElement>(null);
    const [locked, setLocked] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: searchParams.get("code") ?? ""
        },
    })

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        setLocked(true);
        activateAccount(data.code).then(() => {
            setLocked(false);
            navigate("/auth/login");
            toast.success("Account activated successfully",{
                position:"bottom-right",
            });
        }).catch(err => {
            if (err.response.status == 406) {
                toast.error("Invalid activation code!",{
                    position:"bottom-right",
                });
            } else {
                toast.error(err.message,{
                    position:"bottom-right",
                });
            }
            setLocked(false);
        });
    }

    return (
        <Card
            className="login-form mx-auto min-w-[360px] w-1/3 mt-32 h-fit border drop-shadow-md rounded-xl"
            ref={activationForm}
        >

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardHeader className="">
                        <CardTitle className="text-4xl text-center text-bold">
                            Activate your account
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({field}) => (
                                    <FormItem className="flex flex-col items-center justify-center">
                                        <FormControl>
                                            <InputOTP maxLength={6}
                                                      pattern={REGEXP_ONLY_DIGITS}
                                                      {...field}>
                                                <InputOTPGroup>
                                                    <InputOTPSlot
                                                        index={0}/>
                                                    <InputOTPSlot
                                                        index={1}/>
                                                    <InputOTPSlot
                                                        index={2}/>
                                                    <InputOTPSlot
                                                        index={3}/>
                                                    <InputOTPSlot
                                                        index={4}/>
                                                    <InputOTPSlot
                                                        index={5}/>
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </FormControl>
                                        <FormDescription>
                                            Check your email inbox for a 6
                                            digits activation code
                                        </FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            {locked
                                ? <Button disabled className="bg-orange-600">
                                    <Loader2
                                        className="mr-2 h-4 w-4 animate-spin"/>
                                    Please wait
                                </Button>
                                : <Button
                                    type="submit"
                                    className="w-full bg-orange-600 rounded-xl text-white  hover:bg-orange-700"
                                >
                                    Activate
                                </Button>}
                        </div>
                    </CardContent>
                </form>
            </Form>
        </Card>
    );
}

export default ActivationForm;
