import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {Item, ItemStatus} from '@/models/Item.ts';
import { UseFormReturn } from 'react-hook-form';

export default function ProductProperties(props: { item: Item; form: UseFormReturn }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Properties</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <div className="flex flex-col gap-3">
            <FormField
              control={props.form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} disabled={props.item.status == ItemStatus.REMOVED} />
                  </FormControl>
                  <FormDescription>The color of the item</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={props.form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} disabled={props.item.status == ItemStatus.REMOVED} />
                  </FormControl>
                  <FormDescription>
                    <span>Weight in grams</span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={props.form.control}
              name="metal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Metal</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} disabled={props.item.status == ItemStatus.REMOVED} />
                  </FormControl>
                  <FormDescription>The type of metal used in the item</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={props.form.control}
              name="gemstone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gemstone</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} disabled={props.item.status == ItemStatus.REMOVED} />
                  </FormControl>
                  <FormDescription>The type of gemstone used in the item</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={props.form.control}
              name="measurement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Measurement</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} disabled={props.item.status == ItemStatus.REMOVED} />
                  </FormControl>
                  <FormDescription>
                    <span>Measurement in millimeters (mm)</span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={props.form.control}
              name="stamped"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stamped</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} disabled={props.item.status == ItemStatus.REMOVED} />
                  </FormControl>
                  <FormDescription>
                    <span>Brand/Stamped of the item</span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={props.form.control}
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condition</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} disabled={props.item.status == ItemStatus.REMOVED} />
                  </FormControl>
                  <FormDescription>
                    <span>Condition of the item</span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
