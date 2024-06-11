import { Button } from "@/components/ui/button";
import {
  AntennaIcon,
  CrownIcon,
  HistoryIcon,
  HotelIcon,
  VenetianMaskIcon,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

export default function CategoriesSection() {
  return (
    <>
      {" "}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background text-foreground">
        <div className="container space-y-12 px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center ">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Browse Our Antique & Vintage Collection
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Discover a curated selection of rare and unique antique and
                vintage jewelry, from the 19th century to the mid-20th century.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            <Link
              className="group flex flex-col items-center justify-center space-y-2 rounded-lg bg-white p-4 transition-colors hover:bg-gray-100 dark:bg-gray-950 dark:hover:bg-gray-800"
              to="#"
            >
              <AntennaIcon className="h-8 w-8 text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-50" />
              <span className="text-sm font-medium text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-50">
                Antique
              </span>
            </Link>
            <Link
              className="group flex flex-col items-center justify-center space-y-2 rounded-lg bg-white p-4 transition-colors hover:bg-gray-100 dark:bg-gray-950 dark:hover:bg-gray-800"
              to="#"
            >
              <HistoryIcon className="h-8 w-8 text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-50" />
              <span className="text-sm font-medium text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-50">
                Vintage
              </span>
            </Link>
            <Link
              className="group flex flex-col items-center justify-center space-y-2 rounded-lg bg-white p-4 transition-colors hover:bg-gray-100 dark:bg-gray-950 dark:hover:bg-gray-800"
              to="#"
            >
              <CrownIcon className="h-8 w-8 text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-50" />
              <span className="text-sm font-medium text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-50">
                Edwardian
              </span>
            </Link>
            <Link
              className="group flex flex-col items-center justify-center space-y-2 rounded-lg bg-white p-4 transition-colors hover:bg-gray-100 dark:bg-gray-950 dark:hover:bg-gray-800"
              to="#"
            >
              <HotelIcon className="h-8 w-8 text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-50" />
              <span className="text-sm font-medium text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-50">
                Art Deco
              </span>
            </Link>
            <Link
              className="group flex flex-col items-center justify-center space-y-2 rounded-lg bg-white p-4 transition-colors hover:bg-gray-100 dark:bg-gray-950 dark:hover:bg-gray-800"
              to="#"
            >
              <VenetianMaskIcon className="h-8 w-8 text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-50" />
              <span className="text-sm font-medium text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-50">
                Victorian
              </span>
            </Link>
          </div>
          <div className="flex justify-center">
            <Button
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
              variant="outline"
            >
              View More
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
