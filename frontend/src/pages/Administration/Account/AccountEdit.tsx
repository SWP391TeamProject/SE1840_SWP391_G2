import { useEffect } from 'react'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RoleName, Roles } from '@/constants/enums';
import { updateAccountService } from "@/services/AccountsServices.ts";
import { useNavigate } from "react-router-dom";
import { Role } from '@/models/newModel/account';

const phoneRegex = new RegExp(
    /^[0-9\-\+]{10}$/
);

const emailRegex = new RegExp(
    /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
);

const formSchema = z.object({
    accountId: z.number(),
    nickname: z.string(),
    email: z.string().regex(emailRegex, 'Invalid email!'),
    phone: z.string().regex(phoneRegex, 'Invalid Number!'),
    role: z.enum([RoleName.MEMBER, RoleName.STAFF, RoleName.MANAGER, RoleName.ADMIN]),
    balance: z.coerce.number().optional(),
});


export default function AccountEdit() {
    const account = useAppSelector((state) => state.accounts.currentAccount);
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            accountId: account?.accountId,
            nickname: account?.nickname ?? "",
            email: account?.email,
            phone: account?.phone ?? "",
            balance: account?.balance ?? 0,
            role: account ? account.role : RoleName.MEMBER,
        },
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        // Remove FormData creation and file handling

        let updatedAccount = {
            accountId: data.accountId,
            email: data.email,
            nickname: data.nickname ?? "",
            phone: data.phone,
            avatar: null,
            balance: data.balance,
            role: data.role,
       
            status: account?.status
        }
        updateAccountService(updatedAccount, updatedAccount.accountId).then((res) => {
            console.log(res);
            // dispatch(setCurrentAccount(res))
            navigate("/admin/accounts/");
        })

        console.log(updatedAccount);
    };

    useEffect(() => {
        console.log(account);
        console.log(form.formState.defaultValues);
    }, [])

    return (
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8" style={{float: 'left'}}>
            <div key="1" className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        Edit Account
                    </h1>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                        ___________________________________________________________________________________________________________________________________________
                    </p>
                    {/* <p className="mt-2 text-gray-500 dark:text-gray-400">
          Fill out the form below to list your item for consignment. We'll
          review your submission and get back to you within 2 business days.
        </p> */}
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="accountId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>accountId</FormLabel>
                                    <FormControl>
                                        <Input disabled
                                            // defaultValue={JSON.parse(getCookie("user"))?.id}
                                            // {...field}
                                            // defaultValue={}
                                            placeholder="account id" {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="nickname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>User Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="enter your prefer user name here"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="adasd" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                        <Input placeholder="shadcn" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="balance"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Balance (in USD)</FormLabel>
                                    <FormControl>
                                        <Input {...field} type='number'/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Role</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-col space-y-1"
                                            disabled={field.value === RoleName.ADMIN}
                                        >
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value={Roles.MEMBER} />
                                                </FormControl>
                                                <FormLabel className="font-normal">{Roles.MEMBER}</FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value={Roles.STAFF} />
                                                </FormControl>
                                                <FormLabel className="font-normal">{Roles.STAFF}</FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value={Roles.MANAGER} />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    {Roles.MANAGER}
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value={Roles.ADMIN} />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    {Roles.ADMIN}
                                                </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button variant={"destructive"} type="submit">
                            Submit
                        </Button>
                    </form>
                </Form>
            </div>
        </main>
    )
}
