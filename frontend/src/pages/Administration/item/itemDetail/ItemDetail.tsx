import { useAppSelector } from "@/redux/hooks";
import React, { useEffect, useLayoutEffect, useState } from "react";
import ProductDetail from "./ProductDetail";
import ProductStatus from "./ProductStatus";
import ProductCategory from "./ProductCategory";
import ProductImageGallery from "./ProductImageGallery";
import { useParams } from "react-router-dom";
import { getItemById, updateItem } from "@/services/ItemService";
import { it } from "node:test";
import { Item } from "@/models/Item";
import { Loader2 } from "lucide-react";
import LoadingAnimation from "@/components/loadingAnimation/LoadingAnimation";
import ProductPrice from "./ProductPrice";

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

const formSchema = z.object({
  description: z.string(),
  buyInPrice: z.string(),
  status: z.string(),
  itemId: z.number(),
  name: z.string(),
  category: z.object({
    itemCategoryId: z.string(),
  })
})




export default function ItemDetail() {
  let item = useAppSelector((state) => state.items.currentItem);
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const { id } = useParams<{ id: string }>();
  const [isloading, setIsLoading] = useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
    },
  })
  useLayoutEffect(() => {
    if (!item) {
      console.log(item);
      getItemById(parseInt(id)).then((res) => {
        item = res.data;
        setCurrentItem(item);
        form.reset({
          itemId: item.itemId,
          description: item.description,
          buyInPrice: String(item.buyInPrice),
          category: {
            itemCategoryId: item.category?.itemCategoryId.toString()
          },
          name: item.name,
          status: item?.status,
        });
      });

    } else {
      setCurrentItem(item);
      form.reset({
        itemId: item.itemId,
        description: item.description,
        buyInPrice: String(item.buyInPrice),
        category: {
          itemCategoryId: item.category?.itemCategoryId.toString()
        },
        name: item.name,
        status: item?.status,
      });
    }
  }, []);


  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log("validated")
    console.log(values)

    updateItem(values).then((res) => {

      console.log(res)
      toast.success('Item updated successfully!');
      setIsLoading(false);
    }).catch((err) => {
      setIsLoading(false);
      toast.error('There was an error!', err.response.data.message);
      console.error(err)
    })

  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {currentItem?.name === undefined
            ? <LoadingAnimation />
            : <div className="container flex flex-row flex-nowrap">

              <div className="basis-8/12 p-3 flex flex-col gap-3">
                <ProductDetail item={currentItem} name={currentItem?.name} description={currentItem?.description} form={form} />
                <ProductImageGallery images={currentItem?.attachments} />
              </div>
              <div className="basis-4/12 p-3 flex flex-col gap-3">
                {isloading
                  ? <Button type="submit" disabled>
                    <Loader2 className="animate-spin"/>
                  </Button>
                  : <Button type="submit" >
                    save
                  </Button>

                }

                <ProductStatus form={form} />
                <ProductCategory form={form} />
                <ProductPrice item={currentItem} form={form} />

              </div>
            </div>

          }

        </form>
      </Form>
    </>
  );

}
