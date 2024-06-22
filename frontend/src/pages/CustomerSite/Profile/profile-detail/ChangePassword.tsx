import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {changePassword} from "@/services/AuthService";
import { useAuth } from "@/AuthProvider";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
    oldPassword: z.string({
        message: "Old password is required",
    }).min(8, "Old password must contain at leats 8 characters").max(50, "Old password must contain at most 50 characters"),
    newPassword: z.string({
        message: "New password is required",
    }).min(8, "New password must contain at leats 8 characters").max(50, "New password must contain at most 50 characters"),
    confirmPassword: z.string(),
}).superRefine((data, ctx) => {
    if (data.oldPassword === data.newPassword) {
        ctx.addIssue({
            path: ["newPassword"],
            message: "New password is the same as the old one",
            code: "custom",
        });
    }
    if (data.newPassword !== data.confirmPassword) {
        ctx.addIssue({
            path: ["confirmPassword"],
            message: "Passwords do not match",
            code: "custom",
        });
    }
});

export default function ChangePassword({ setIsLoading, isLoading }) {
    const auth = useAuth()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        changePassword(auth?.user?.accountId, values).then(res => {
            console.log(res)
            setIsLoading(false)
            toast.success('Password changed successfully!')
            form.reset({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        }).catch(err => {
            toast.error(err.response.data.message)
            console.log(err)
            setIsLoading(false)
        })
    }

    return <>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Change Password</CardTitle>
                        <CardDescription>
                            Update your password.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="oldPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Current Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Enter current password" {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Enter new password" {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Confirm new password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        {
                            isLoading ?
                                <Button disabled>
                                    <Loader2 className="animate-spin" />
                                </Button>
                                : <Button type="submit">Change Password</Button>
                        }

                    </CardFooter>
                </Card>

            </form>
        </Form>
    </>;
}
