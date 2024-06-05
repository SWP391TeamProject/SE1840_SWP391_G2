import { useAppSelector } from "@/redux/hooks";
import React, { useEffect, useState } from "react";
import ProductDetail from "./ProductDetail";
import ProductStatus from "./ProductStatus";
import ProductCategory from "./ProductCategory";
import ProductImageGallery from "./ProductImageGallery";
import { useParams } from "react-router-dom";
import { getItemById } from "@/services/ItemService";
import { it } from "node:test";
import { Item } from "@/models/Item";
import { Loader2 } from "lucide-react";
import LoadingAnimation from "@/components/loadingAnimation/LoadingAnimation";

interface Props {

}




export default function ItemDetail() {
  let item = useAppSelector((state) => state.items.currentItem);
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const { id } = useParams<{ id: string }>();
  useEffect(() => {
    if (!item) {
      console.log(item);
      getItemById(parseInt(id)).then((res) => {
        item = res.data;
        setCurrentItem(item);
      });
    } else {
      setCurrentItem(item);
    }

  }, []);

  return (
    <>
      {currentItem?.name === undefined
        ? <LoadingAnimation />
        : <div className="container flex flex-row flex-nowrap">
          <div className="basis-8/12 p-3 flex flex-col gap-3">
            <ProductDetail name={currentItem?.name} description={currentItem?.description} />
            <ProductImageGallery />
          </div>
          <div className="basis-4/12 p-3 flex flex-col gap-3">
            <ProductStatus />
            <ProductCategory />
          </div>
        </div>
      }
    </>
  );

}
