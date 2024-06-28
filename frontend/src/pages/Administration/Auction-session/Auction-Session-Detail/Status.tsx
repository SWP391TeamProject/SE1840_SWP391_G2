import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { AuctionSessionStatus } from "@/models/newModel/auctionSession"
  
  export default function Status({...props}) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Session Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <FormField
                name="status"
                control={props.form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field?.value} value={field?.value}>
                        <SelectTrigger id="status" aria-label="Select status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(AuctionSessionStatus).map((item: any) => {
                            return <SelectItem value={item}>{item}</SelectItem>
                          })}
                        </SelectContent>
                      </Select>
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
  