import { useAppSelector } from "@/redux/hooks";
import { useEffect, useLayoutEffect, useState } from "react";
import ProductDetail from "./ProductDetail";
import ProductStatus from "./ProductStatus";
import ProductCategory from "./ProductCategory";
import ProductImageGallery from "./ProductImageGallery";
import { useParams } from "react-router-dom";
import { getItemById, updateItem } from "@/services/ItemService";
import { Item } from "@/models/Item";
import { Loader2 } from "lucide-react";
import LoadingAnimation from "@/components/loadingAnimation/LoadingAnimation";
import ProductPrice from "./ProductPrice";

import { Button } from "@/components/ui/button"
import {
  Form,
} from "@/components/ui/form"
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { ConfirmationDialog } from "@/components/confirmation/confirmation-dialog";

const formSchema = z.object({
  description: z.string(),
  buyInPrice: z.coerce.number().min(0).max(100000000),
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
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showTrigger, setShowTrigger] = useState(false);
  const [formValues, setFormValues] = useState();
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
          buyInPrice: item.buyInPrice,
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
        buyInPrice: item.buyInPrice,
        category: {
          itemCategoryId: item.category?.itemCategoryId.toString()
        },
        name: item.name,
        status: item?.status,
      });
    }
  }, []);

  const confirm = () => {
    setIsConfirmed(true);
    setShowTrigger(false);
  }

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // setIsLoading(true);
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log("validated")
    console.log(values)
    setShowTrigger(true);
    setFormValues(values);

    console.log(showTrigger);

    // if (isConfirmed) {
    //   updateItem(values).then((res) => {

    //     console.log(res)
    //     toast.success('Item updated successfully!', {
    //       position: "bottom-right",
    //     });
    //     setIsLoading(false);
    //   }).catch((err) => {
    //     setIsLoading(false);
    //     toast.error(err.response.data.message, {
    //       position: "bottom-right",
    //     });
    //     console.error(err)
    //   })
    // } else {
    //   setIsLoading(false);
    // }
  }

  const handleConfirmed = (values: any) => {
    setIsLoading(true);
    updateItem(values).then((res) => {
      console.log(res)
      toast.success('Item updated successfully!', {
        position: "bottom-right",
      });
      setIsLoading(false);
    }).catch((err) => {
      setIsLoading(false);
      toast.error(err.response.data.message, {
        position: "bottom-right",
      });
      console.error(err)
    })
  }

  useEffect(() => {
    if(isConfirmed){
      if(formValues) {
        handleConfirmed(formValues);
        setIsConfirmed(false);
      }
    } 
  }, [isConfirmed])

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {currentItem?.name === undefined
            ? <LoadingAnimation message="loading item detail..." />
            : <div className="container flex flex-row flex-nowrap">

              <div className="basis-8/12 p-3 flex flex-col gap-3">
                <ProductDetail item={currentItem} name={currentItem?.name} description={currentItem?.description} form={form} />
                <ProductImageGallery images={currentItem?.attachments} />
              </div>
              <div className="basis-4/12 p-3 flex flex-col gap-3">
                {isloading
                  ? <Button type="submit" disabled>
                    <Loader2 className="animate-spin" />
                  </Button>
                  : <Button type="submit" >
                    Save
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
        <ConfirmationDialog
          open={showTrigger}
          onOpenChange={setShowTrigger}
          title="Are you sure to update this item?"
          message={"Item " + currentItem?.name}
          label="Ok"
          onSuccess={confirm}
          description=""
        />
    </>
  );

}
