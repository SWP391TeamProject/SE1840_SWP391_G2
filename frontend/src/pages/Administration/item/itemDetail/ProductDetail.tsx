import TextEditor from '@/components/component/TextEditor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {Item, ItemStatus} from '@/models/Item.ts';
import { UseFormReturn } from 'react-hook-form';

export default function ProductDetail(props: { item: Item; form: UseFormReturn }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Jewelry Details</CardTitle>
        <CardDescription>Details of the Jewelry.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="flex justify-content-center gap-5">
            <p className="font-semibold tracking-tight">Owner:</p>
            <p>
              {props.item.owner.nickname} (#{props.item.owner.accountId})
            </p>
          </div>
          <FormField
            control={props.form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" disabled={props.item.status == ItemStatus.REMOVED} placeholder="Enter name here" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {props.item.status == ItemStatus.REMOVED ?
            <div dangerouslySetInnerHTML={{ __html: props.item.description }}></div> :
            <FormField
              control={props.form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <TextEditor placeholder="Enter description here..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          }
        </div>
      </CardContent>
    </Card>
  );
}
