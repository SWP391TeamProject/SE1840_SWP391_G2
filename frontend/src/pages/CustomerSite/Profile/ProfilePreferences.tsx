import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { getCookie, setCookie } from '@/utils/cookies';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/components/component/ThemeProvider';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const formSchema = z.object({
  themeMode: z.enum(['light', 'dark', 'system']),
});

export default function ProfilePreferences() {
  const { setTheme } = useTheme();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      themeMode: getCookie('themeMode') ? JSON.parse(getCookie('themeMode')) : 'light',
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setCookie('themeMode', JSON.stringify(data.themeMode), 2147483647);
    setTheme(data.themeMode);
    toast.success('Update preferences successfully!', {
      position: 'bottom-right',
    });
  };

  return (
    <div>
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
                          <SelectItem value="light" key="light">
                            Light
                          </SelectItem>
                          <SelectItem value="dark" key="dark">
                            Dark
                          </SelectItem>
                          <SelectItem value="system" key="system">
                            System
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex gap-4">
                <Button type="submit">Save</Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
