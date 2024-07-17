import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {Item, ItemStatus} from "@/models/Item.ts";
import {UseFormReturn} from "react-hook-form";
import {useCurrency} from "@/CurrencyProvider.tsx";

export default function ProductPrice(props: {
  item: Item,
  form: UseFormReturn
}) {
  const currency = useCurrency();

  return <Card>
    <CardHeader>
      <CardTitle>Pricing</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col gap-3">
        <FormField
          control={props.form.control}
          name="reservePrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reserve Price: {currency.format({amount: props.form.getValues("reservePrice")})}</FormLabel>
              <FormControl>
                <Input type="number" disabled={props.item.status != ItemStatus.QUEUE} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={props.form.control}
          name="buyInPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Buy In Price: {currency.format({amount: props.form.getValues("buyInPrice")})}</FormLabel>
              <FormControl>
                <Input type="number" disabled={props.item.status != ItemStatus.QUEUE} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {props.item.status != ItemStatus.QUEUE &&
          <p className="text-red-600 text-sm">You cannot change price at this moment</p>}
      </div>
    </CardContent>
  </Card>;
}
