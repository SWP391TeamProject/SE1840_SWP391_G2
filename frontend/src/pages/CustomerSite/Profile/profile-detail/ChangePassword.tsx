import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { requestChangePassword } from "@/services/AuthService";
import { useAuth } from "@/AuthProvider";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
    oldPassword: z.string({
        message: "Old password is required",
    }).min(2).max(50),
    newPassword: z.string({
        message: "New password is required",
    }).min(2).max(50),
    confirmPassword: z.string(),
}).superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
        // Pushing an error if passwords do not match
        ctx.addIssue({
            path: ["confirmPassword"], // Path of the field that failed validation
            message: "Passwords do not match",
            // Adjusting the code to 'custom' or another appropriate value
            code: "custom", // Assuming 'custom' is a valid code for your use case
            // If Zod expects 'expected' and 'received' properties, you might need to add them, 
            // but based on your use case, it seems you're creating a custom validation error, 
            // so they might not be strictly necessary.
        });
    }
});

export default function ChangePassword({ setIsLoading, isLoading }) {
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
