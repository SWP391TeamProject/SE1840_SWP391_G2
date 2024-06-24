import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import {currencyNames, CurrencyType, useCurrency} from "@/CurrencyProvider.tsx";
import {toast} from "react-toastify";

const formSchema = z.object({
  themeMode: z.enum(["light", "dark", "system"]),
  currencyType: z.nativeEnum(CurrencyType)
});

export default function ProfilePreferences() {
  const { setTheme } = useTheme();
  const currency = useCurrency();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      themeMode: getCookie("themeMode") ? JSON.parse(getCookie("themeMode")) : "light",
      currencyType: currency.getCurrencyType()
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setCookie("themeMode", JSON.stringify(data.themeMode), 2147483647);
    setTheme(data.themeMode);
    currency.setCurrencyType(data.currencyType);
    toast.success('Update preferences successfully!');
  };

  return <div>

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Set preference settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-col gap-2 w-1/2">
              <FormField
                control={form.control}
                name="themeMode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Theme</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a theme to display" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="light" key="light">Light</SelectItem>
                        <SelectItem value="dark" key="dark">Dark</SelectItem>
                        <SelectItem value="system" key="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currencyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency Format</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a currency to display" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(CurrencyType).map((type) => (
                            <SelectItem key={type} value={type}>{currencyNames[type]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                    <div className="text-sm">
                      <p>Preview</p>
                      <ul className="list-disc list-inside">
                        <li>Exchange rate: 1 USD = {currency.format({
                          amount: 1,
                          currency: field.value,
                          fractionDigits: 8,
                        })}</li>
                        <li>Standard format: {currency.format({
                          amount: 123456.789,
                          currency: field.value,
                          exchangeMoney: false
                        })}</li>
                        <li>Compact format: {currency.format({
                          amount: 123456.789,
                          currency: field.value,
                          compact: true,
                          exchangeMoney: false
                        })}</li>
                      </ul>
                    </div>
                  </FormItem>
                )}
              />
            </div>
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
