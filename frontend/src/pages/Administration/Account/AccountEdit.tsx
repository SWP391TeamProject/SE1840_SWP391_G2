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
import { useAppSelector } from "@/redux/hooks";
import { Roles } from '@/constants/enums';
import { fetchAccountById, updateAccountService } from "@/services/AccountsServices.ts";
import { useNavigate, useParams } from "react-router-dom";
import { setCurrentAccount } from '@/redux/reducers/Accounts';

const formSchema = z.object({
    accountId: z.number(),
    nickname: z.string().min(5, "Nickname must be at least 5 characters")
      .max(20, "Nickname must not be longer than 20 characters"),
    email: z.string().email({
      message: "Invalid email address.",
    }),
    phone: z.string().max(15, "Phone must not be longer than 15 characters").optional(),
    role: z.nativeEnum(Roles),
    balance: z.coerce.number().min(0, "Balance must not be negative"),
});


export default function AccountEdit() {
    const account = useAppSelector((state) => state.accounts.currentAccount);
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            accountId: account?.accountId,
            nickname: account?.nickname ?? "",
            email: account?.email,
            phone: account?.phone ?? "",
            balance: account?.balance ?? 0,
            role: account ? account.role : Roles.MEMBER,
        },
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        // Remove FormData creation and file handling

        let updatedAccount = {
            accountId: data.accountId,
            email: data.email,
            nickname: data.nickname,
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
        if (!account || account.accountId != parseInt(id)) {
            fetchAccountById(parseInt(id)).then((res) => {
                console.log(res);
                setCurrentAccount(res?.data);
                form.reset({
                    accountId: res?.data?.accountId,
                    nickname: res?.data?.nickname ?? "",
                    email: res?.data?.email,
                    phone: res?.data?.phone ?? "",
                    balance: res?.data?.balance ?? 0,
                    role: res?.data ? res?.data.role : Roles.MEMBER,
                });
            });
        } else {
            setCurrentAccount(account);
        }
    }, [account]);

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
                                    <FormLabel>Nickname</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nickname"
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
                                        <Input placeholder="Email" {...field} />
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
                                        <Input placeholder="Phone number" type="phone" {...field} />
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
                                            disabled={field.value === Roles.ADMIN}
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
