import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {useNavigate, useSearchParams} from "react-router-dom";
import {toast} from "react-toastify";
import {Loader2} from "lucide-react";
import {resetPassword} from "@/services/AuthService.ts";
import {InputOTP, InputOTPGroup, InputOTPSlot,} from "@/components/ui/input-otp"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {zodResolver} from "@hookform/resolvers/zod"
import {z} from "zod"
import {REGEXP_ONLY_DIGITS} from "input-otp";
import {Input} from "@/components/ui/input.tsx";

const formSchema = z.object({
    code: z.string().length(6, {
        message: "Code must be 6 characters.",
    }).regex(/\d+/g, {
        message: "Code must only contain digits.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string()
}).refine(
    (data) => {
        return data.password === data.confirmPassword;
    },
    {
        message: "Passwords do not match.",
        path: ["confirmPassword"],
    }
);

function ResetPasswordForm() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [locked, setLocked] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: searchParams.get("code") ?? "",
            password: "",
            confirmPassword: ""
        },
    })

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        setLocked(true);
        resetPassword(data).then(() => {
            setLocked(false);
            navigate("/auth/login");
            toast.success("Password reset successfully",{
                position:"bottom-right",
            });
        }).catch(err => {
            if (err.response.status == 406) {
                toast.error("Invalid reset code!",{
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
            className="login-form mx-auto min-w-[360px] w-1/3 mt-32 h-fit border drop-shadow-md rounded-xl">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardHeader className="">
                        <CardTitle className="text-4xl text-center text-bold">
                            Reset password
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({field}) => (
                                    <FormItem
                                        className="flex flex-col items-center justify-center">
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
                                            digits reset code
                                        </FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password"
                                                   placeholder="******" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input type="password"
                                                   placeholder="******" {...field} />
                                        </FormControl>
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
                                    Confirm
                                </Button>}
                        </div>
                    </CardContent>
                </form>
            </Form>
        </Card>
    );
}

export default ResetPasswordForm;
