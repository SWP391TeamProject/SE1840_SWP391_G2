import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";

export default function ProductPrice({ ...props }) {
  return <Card>
    <CardHeader>
      <CardTitle>Pricing</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="w-full">
        <div className="grid gap-3 w-full">
          <h3 className="text-foreground">Reserve Price: {props.item.reservePrice}</h3>
          <FormField
            control={props.form.control}
            name="buyInPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Buy In Price</FormLabel>
                <FormControl>
                  <Input defaultValue={props.item.buyInPrice} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </CardContent>
  </Card>;
}
