import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import {Item, ItemStatus} from '@/models/Item.ts';
import {UseFormReturn} from 'react-hook-form';
import ItemCategorySelector
  from '@/pages/Administration/item/ItemCategorySelector.tsx';
import {Button} from "@/components/ui/button.tsx";

export default function ProductCategory(props: {
  item: Item;
  form: UseFormReturn
}) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Category</CardTitle>
        </CardHeader>
        <CardContent>
          {props.item.status == ItemStatus.REMOVED ?
            <Button variant="secondary"
                    className="w-full" disabled>{props.item.category.name}</Button>
            :
            <FormField
              control={props.form.control}
              name="categoryId"
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <ItemCategorySelector defaultValue={field.value}
                                          onValueChange={field.onChange}/>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />}
        </CardContent>
      </Card>
    </>
  );
}
