import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { getCookie, setCookie } from "@/utils/cookies";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme } from "@/components/component/ThemeProvider";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoonIcon } from "lucide-react";

const formSchema = z.object({
  themMode: z.enum(["light", "dark", "system"]),
});

// type ThemeMode = {
//   themMode: string;
// }

export default function ProfileSetting() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      themMode: getCookie("themeMode") ? JSON.parse(getCookie("themeMode")) : "light",
    },
  });

  const { setTheme } = useTheme();

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
    setCookie("themeMode", JSON.stringify(data.themMode), 2147483647);
    setTheme(data.themMode);
  };

  return <div>

    <Form {...form}>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <Card>
          <CardHeader>
            <CardTitle>Theme Mode</CardTitle>
            <CardDescription>Set default theme mode on your local</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="themMode"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex items-center gap-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0 gap-2 cursor-pointer">
                        <FormControl>
                          <RadioGroupItem value="light" />
                        </FormControl>
                        <FormLabel className="text-base font-medium peer-checked:font-semibold peer-checked:text-primary">
                          Light
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0  gap-2 cursor-pointer">
                        <FormControl>
                          <RadioGroupItem value="dark" />
                        </FormControl>
                        <FormLabel className="text-base font-medium peer-checked:font-semibold peer-checked:text-primary">
                          Dark
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0 gap-2 cursor-pointer">
                        <FormControl>
                          <RadioGroupItem value="system" />
                        </FormControl>
                        <FormLabel className="text-base font-medium peer-checked:font-semibold peer-checked:text-primary">
                          System
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <div className="flex gap-4">
              <Button
                type="submit"
              >Save</Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  </div>;
}
