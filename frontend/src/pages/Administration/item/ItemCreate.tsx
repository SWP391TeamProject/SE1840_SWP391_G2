import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import DropzoneComponent from '@/components/drop-zone/DropZoneComponent';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { createItem, uploadItemAttachment } from '@/services/ItemService';
import TextEditor from '@/components/component/TextEditor';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/AuthProvider.tsx';
import LoadingAnimation from '@/components/loadingAnimation/LoadingAnimation.tsx';
import ItemCategorySelector from '@/pages/Administration/item/ItemCategorySelector.tsx';
import { ConfirmationDialog } from '@/components/confirmation/confirmation-dialog';
import { showErrorToast } from '@/lib/handle-error';
import Consignment from "@/models/consignment.ts";
import {ConsignmentDetailType} from "@/constants/enums.tsx";
import ItemCreateCustomerCard
  from "@/pages/Administration/item/ItemCreateCustomerCard.tsx";
import ItemConsignmentInfoCard
  from "@/pages/Administration/item/ItemConsignmentInfoCard.tsx";

const FormSchema = z.object({
  categoryId: z.string().regex(/\d+/, {
    message: 'Please select a category.',
  }),
  name: z
    .string()
    .min(5, {
      message: 'Name must be at least 5 characters long.',
    })
    .max(50, {
      message: 'Name must not exceed 50 characters.',
    }),
  description: z
    .string()
    .min(5, {
      message: 'Description must be at least 5 characters long.',
    })
    .max(50000, {
      message: 'Description must not exceed 50000 characters.',
    }),
  reservePrice: z.coerce
    .number({
      message: 'Reserve price must be a number.',
    })
    .min(0, {
      message: 'Reserve price must be at least 0.',
    }),
  buyInPrice: z.coerce
    .number({
      message: 'Buy in price must be a number.',
    })
    .min(0, {
      message: 'Buy in price must be at least 0.',
    }),
  ownerId: z.coerce.number({
    message: 'Owner must be specified.',
  }),
  color: z.string().optional(),
  weight: z.string().optional(),
  metal: z.string().optional(),
  gemstone: z.string().optional(),
  measurement: z.string().optional(),
  condition: z.string().optional(),
  stamped: z.string().optional(),
  files: z.any(),
});

function getManagerAcceptedPrice(consignment: Consignment): number | undefined {
  const managerAcceptedDetails = consignment.consignmentDetails
    .filter(detail => detail.type === ConsignmentDetailType.MANAGER_ACCEPTED)
    .sort((a, b) => (b.consignmentDetailId ?? 0) - (a.consignmentDetailId ?? 0));
  console.log(managerAcceptedDetails);

  return managerAcceptedDetails.length > 0 ? managerAcceptedDetails[0].price : undefined;
}

export default function ItemCreate() {
  const auth = useAuth();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showTrigger, setShowTrigger] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const location = useLocation();
  const consignment = location?.state?.consignment as Consignment;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      categoryId: '1',
      name: '',
      description: '',
      reservePrice: consignment ? getManagerAcceptedPrice(consignment) : 0,
      buyInPrice: consignment ? getManagerAcceptedPrice(consignment) * 10 : 0,
      ownerId: consignment ? consignment.user.accountId : auth.user.accountId,
      color: consignment ? consignment.color :'',
      weight: consignment && consignment.weight ? consignment.weight.toString() :'',
      metal: consignment ? consignment.metal :'',
      gemstone: consignment ? consignment.gemstone :'',
      measurement: consignment ? consignment.measurement :'',
      condition: consignment ? consignment.condition :'',
      stamped: consignment ? consignment.stamped :'',
      files: [],
    },
  });
  const watchForm = form.watch();

  function onSubmit(_: z.infer<typeof FormSchema>) {
    setShowTrigger(true);
  }

  const handleConfirmed = (data: z.infer<typeof FormSchema>) => {
    interface DTO extends Omit<z.infer<typeof FormSchema>, 'categoryId' | 'weight' | 'files'> {
      categoryId?: number;
      weight?: number;
      consignmentId?: number;
    }

    const dto: DTO = {
      ...data,
      categoryId: parseInt(data.categoryId),
      weight: data.weight.length == 0 ? undefined : parseInt(data.weight),
      consignmentId: consignment && consignment.consignmentId,
    };

    createItem(dto)
      .then(async (res) => {
        console.log(res);
        if (data.files.length > 0) {
          await uploadItemAttachment(res.data.itemId, { files: data.files })
            .then(() => {
              toast.success('Attachment uploaded successfully!', {});
            })
            .catch((error) => {
              console.error(error);
              showErrorToast(error);
            });
        }
        toast.success('Item created successfully!', {});
        nav('/admin/items');
      })
      .catch((error) => {
        console.error(error);
        showErrorToast(error);

        setLoading(false);
      });
  };

  const confirm = () => {
    setIsConfirmed(true);
    setShowTrigger(false);
    setLoading(true);
  };

  useEffect(() => {
    if (isConfirmed) {
      if (form.getValues) {
        const values = form.getValues();
        handleConfirmed(values);
        setIsConfirmed(false);
      } else {
        setLoading(false);
      }
    }
  }, [isConfirmed, form.getValues]);

  return (
    <>
      {loading ? (
        <LoadingAnimation />
      ) : (
        <div className="p-10">
          <Form {...form}>
            <div className="flex flex-row gap-20">
              <form onSubmit={form.handleSubmit(onSubmit)} className="basis-3/5 flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="ownerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Owner ID</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} disabled={consignment !== undefined} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item name</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <ItemCategorySelector defaultValue={field.value} onValueChange={field.onChange} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <TextEditor {...field} placeholder="description..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reservePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reserve Price</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>Reserve Price is the initial price of the item.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="buyInPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Buy In Price</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>Buy in price is the price to purchase item straight away.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /><FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

                <FormField
                  control={form.control}
                  name="metal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Metal</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gemstone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gemstone</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="measurement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Measurement</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Condition</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stamped"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stamped</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <ScrollArea className="h-[200px]">
                  <FormField
                    control={form.control}
                    name="files"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Attachments</FormLabel>
                        <FormControl>
                          <DropzoneComponent {...field} control={form.control} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </ScrollArea>

                <Button type="submit">Submit</Button>
              </form>
              <div className="grow flex flex-col gap-6">
                <ItemCreateCustomerCard userId={watchForm.ownerId} />
                {consignment && <ItemConsignmentInfoCard consignment={consignment} />}
              </div>
            </div>
          </Form>
          <ConfirmationDialog
            description="This action cannot be undone."
            label="Ok"
            message="Are you sure to Create this Item?"
            onSuccess={confirm}
            open={showTrigger}
            onOpenChange={setShowTrigger}
            title="Confirmation"
          />
        </div>
      )}
    </>
  );
}
