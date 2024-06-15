import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export default function Details({ ...props }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Session Detail</CardTitle>
        <CardDescription>
          this is the detail of the session
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <FormField
            control={props.form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>title</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-3">
            <FormField
              control={props.form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>start date</FormLabel>
                  <FormControl>
                    {/* <DateTimePicker {...field} />  */}
                    <Input type="datetime-local"  className="bg-background text-foreground"  {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={props.form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End date</FormLabel>
                  <FormControl>
                    <Input type="datetime-local"  className="bg-background text-foreground"  {...field} />
                    {/* <DateTimePicker {...field} /> */}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
