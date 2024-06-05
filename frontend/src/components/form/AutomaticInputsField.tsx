import React from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

export default function AutomaticInputsField({ formSchema }: { formSchema:  }) {

    return <>

        <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                        <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    </>;
}
