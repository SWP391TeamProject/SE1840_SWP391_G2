import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
const formSchema = z.object({
    oldPassword: z.string().min(2).max(50),
    newPassword: z.string().min(2).max(50),
    confirmPassword: z.string().min(2).max(50),
})

import React from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { requestChangePassword } from "@/services/AuthService";
import { useAuth } from "@/AuthProvider";
import { toast } from "react-toastify";

export default function ChangePassword() {
    const [isLoading, setIsLoading] = React.useState(false)
    const auth = useAuth()
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            oldPassword: "",
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        // Do something with the form values.
        // ✅ This will be type-safe and validated.

        requestChangePassword(values, auth?.user?.accountId).then(res => {
            console.log(res)
            setIsLoading(false)
            toast.success('Password changed successfully!')
        }).catch(err => {
            toast.error(err.response.data.message)
            console.log(err)
            setIsLoading(false)
        })
        console.log(values)

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
                                        <Input type="password" placeholder="enter current password" {...field} />
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
                                        <Input type="password" placeholder="enter new password" {...field} />
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
                                        <Input type="password" placeholder="confirm new password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit">Change Password</Button>
                    </CardFooter>
                </Card>

            </form>
        </Form>
    </>;
}
