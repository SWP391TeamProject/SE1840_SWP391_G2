import { Button } from "@/components/ui/button";
import { ItemCategory } from "@/models/newModel/itemCategory";
import { getAllItemCategories } from "@/services/ItemCategoryService";
import {
  CrownIcon,
} from "lucide-react";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function CategoriesSection() {
  const [categories, setCategories] = React.useState<ItemCategory[]>([]);
  useEffect(() => {
    getAllItemCategories(0, 5).then((res) => {
      setCategories(res.data.content);
      console.log(res.data.content);
    }).catch((err) => {
      toast.error(err.response.data.message, {
        position: "bottom-right",
      });
    });
  }, []);
  return (
    <>
      {" "}
      <section className="w-full container bg-background text-foreground">
        <div className="flex flex-col items-center justify-center space-y-4 text-center ">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Browse Our Unique & Luxurious Collection
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Discover a curated selection of rare and unique antique and
              vintage jewelry, from the 19th century to the mid-20th century.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {categories.map((category) => (

            <Link key={category.itemCategoryId}
              to="items"
              state={{ category: category }}
              className="group flex flex-col items-center justify-center space-y-2 rounded-lg bg-white p-4 transition-colors hover:bg-gray-100 dark:bg-gray-950 dark:hover:bg-gray-800"
            >
              <CrownIcon className="h-8 w-8 text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-50" />
              <span className="text-sm font-medium text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-50">
                {category.name}
              </span>
            </Link>
          ))}

        </div>
        <div className="flex justify-center">
          <Button
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
            variant="outline"
            asChild
          >
            <Link to="/items">View More</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
