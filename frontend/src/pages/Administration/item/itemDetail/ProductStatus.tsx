import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { isValidTransition, Item, ItemStatus } from '@/models/Item';
import { UseFormReturn } from 'react-hook-form';

type ProductStatus = {
  status: ItemStatus;
};

export default function ProductStatus(props: { item: Item; form: UseFormReturn }) {
  const selection = Object.keys(ItemStatus).filter((key) => {
    return props.item && isValidTransition(props.item.status, key as ItemStatus);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status</CardTitle>
      </CardHeader>
      <CardContent>
        <FormField
          control={props.form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select disabled={selection.length < 2} onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger id="status" aria-label="Select status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {selection.map((item: ItemStatus) => {
                      return (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {selection.length < 2 && <p className="text-red-600 text-sm mt-5">You cannot change status at this moment</p>}
      </CardContent>
    </Card>
  );
}
