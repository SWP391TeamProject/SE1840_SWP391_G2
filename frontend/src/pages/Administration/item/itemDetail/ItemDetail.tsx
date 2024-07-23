import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useEffect, useState } from 'react';
import ProductDetail from './ProductDetail';
import ProductStatus from './ProductStatus';
import ProductCategory from './ProductCategory';
import ProductImageGallery from './ProductImageGallery';
import { Link, useParams } from 'react-router-dom';
import { deleteItemAttachment, getItemById, updateItem, uploadItemAttachment } from '@/services/ItemService';
import { Loader2 } from 'lucide-react';
import LoadingAnimation from '@/components/loadingAnimation/LoadingAnimation';
import ProductPrice from './ProductPrice';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ConfirmationDialog } from '@/components/confirmation/confirmation-dialog';
import { setCurrentItem } from '@/redux/reducers/Items.tsx';
import { ItemStatus } from '@/models/Item.ts';
import ProductProperties from '@/pages/Administration/item/itemDetail/ProductProperties.tsx';
import { getErrorMessage, showErrorToast } from '@/lib/handle-error';

const formSchema = z.object({
  itemId: z.number(),
  categoryId: z.string().regex(/\d+/, {
    message: 'Please select a category.',
  }),
  name: z
    .string()
    .min(5, {
      message: 'Name must be at least 5 characters long.',
    })
    .max(300, {
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
  color: z
    .string()
    .optional(),
  measurement: z
    .string()
    .optional(),
  weight: z.string()
    .optional()
    .refine((value) => value === '' || value === undefined || (Number(value) > 0 && Number(value) < 10000), {
      message: 'Weight must be positive and below 10000. Leave blank if you do not know.',
    }),
  metal: z
    .string()
    .optional(),
  gemstone: z
    .string()
    .optional(),
  condition: z
    .string()
    .optional(),
  stamped: z
    .string()
    .optional(),
  status: z.nativeEnum(ItemStatus),
  deletedFiles: z.any(),
  files: z.array(z.any()),
});

export default function ItemDetail() {
  const itemId = parseInt(useParams().id);
  const item = useAppSelector((state) => state.items.currentItem);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [showTrigger, setShowTrigger] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemId: -1,
      categoryId: '1',
      name: '',
      description: '',
      reservePrice: 0,
      buyInPrice: 0,
      color: '',
      measurement: '',
      weight: '',
      metal: '',
      gemstone: '',
      stamped: '',
      status: ItemStatus.QUEUE,
      deletedFiles: [],
      files: [],
    },
  });

  useEffect(() => {
    toast.promise(getItemById(itemId), {
      loading: 'loading item detail...',
      success: (res) => {
        const i = res;
        dispatch(setCurrentItem(i));
        form.reset({
          itemId: i.itemId,
          categoryId: i.category.itemCategoryId.toString(),
          name: i.name,
          description: i.description,
          reservePrice: i.reservePrice,
          buyInPrice: i.buyInPrice,
          color: i.color,
          measurement: i.measurement,
          weight: typeof i.weight === 'number' ? i.weight.toString() : '',
          metal: i.metal,
          gemstone: i.gemstone,
          stamped: i.stamped,
          condition: i.condition,
          status: i.status,
          deletedFiles: [],
          files: [],
        });
        setIsLoading(false);
        return 'Item loaded successfully!';
      },
      error: (e) => {
        console.error(e);
        return getErrorMessage(e);
      },
    });
  }, []);

  async function deleteFiles(itemId, deletedFiles: []) {
    let results = [];

    await Promise.all(
      deletedFiles.map(async (attachmentId) => {
        const res = await deleteItemAttachment(itemId, attachmentId);
        results.push(res.data);
      })
    );
    return results;
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    interface DTO extends Omit<z.infer<typeof formSchema>, 'categoryId' | 'age'> {
      categoryId?: number;
      weight?: number;
    }

    const dto: DTO = {
      ...values,
      categoryId: parseInt(values.categoryId),
      weight: values.weight.length > 0 ? parseInt(values.weight) : undefined
    };

    if (item.status != ItemStatus.QUEUE) {
      dto.reservePrice = undefined;
      dto.buyInPrice = undefined;
    }

    updateItem(dto)
      .then((res) => {
        console.log(res);
        let deleted;
        let uploaded;
        let actions = [];
        let item = res.data;
        if (dto.deletedFiles.length > 0) {
          // dto.deletedFiles.forEach(attachmentId => {
          //   deleteItemAttachment(dto.itemId, attachmentId)
          // });
          // deleted = await deleteFiles(dto.itemId, dto.deletedFiles);
          actions.push(deleteFiles(dto.itemId, dto.deletedFiles));
          // console.log(deleted);
        }

        if (dto.files.length > 0) {
          actions.push(uploadItemAttachment(dto.itemId, { files: dto.files }));
          // uploaded = await uploadItemAttachment(dto.itemId, {files: dto.files})
          // console.log(uploaded.data);
        }

        if (actions.length > 0) {
          console.log(actions);
          Promise.all(actions)
            .then((result) => {
              console.log(result);
              toast.success('Item updated successfully!', {});
              dispatch(setCurrentItem(item));
              window.location.reload();
            })
            .catch((err) => {
              console.error(err);
              showErrorToast(err);
            });
        } else {
          toast.success('Item updated successfully!', {});
          dispatch(setCurrentItem(item));
        }
      })
      .catch((err) => {
        console.error(err);
        showErrorToast(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <>
      {isLoading || item == undefined ? (
        <LoadingAnimation message="loading item detail..." />
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="container flex flex-row flex-nowrap">
                <div className="basis-8/12 p-3 flex flex-col gap-3">
                  <ProductDetail item={item} form={form} />
                  <ProductImageGallery item={item} form={form} />
                </div>
                <div className="basis-4/12 p-3 flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-5">
                    {isLoading ? (
                      <Button type="button" disabled>
                        <Loader2 className="animate-spin" />
                      </Button>
                    ) : (
                      <Button
                        disabled={item.status == ItemStatus.REMOVED}
                        type="button"
                        onClick={() => {
                          setShowTrigger(true);
                        }}
                      >
                        Save
                      </Button>
                    )}
                    <Button type="submit" variant="outline" asChild>
                      <Link to={`/jewelries/${item.itemId}`}>Public view</Link>
                    </Button>
                  </div>
                  <ProductStatus item={item} form={form} />
                  <ProductCategory item={item} form={form} />
                  <ProductPrice item={item} form={form} />
                  <ProductProperties item={item} form={form} />
                </div>
              </div>
            </form>
          </Form>
          <ConfirmationDialog
            open={showTrigger}
            onOpenChange={setShowTrigger}
            title="Are you sure to update this item?"
            message={'Item ' + item?.name}
            label="Ok"
            onSuccess={() => {
              setShowTrigger(false);
              form.handleSubmit(onSubmit)();
            }}
            description=""
          />
        </>
      )}
    </>
  );
}
