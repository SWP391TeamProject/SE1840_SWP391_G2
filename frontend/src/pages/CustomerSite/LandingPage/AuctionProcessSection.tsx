import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";

export default function AuctionProcessSection() {
  return (
    <>
      {" "}
      <section className="w-full container bg-background text-foreground">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Our Auction Process
            </h2>
            <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Learn about our streamlined auction process and how we ensure a
              seamless experience for both buyers and sellers.
            </p>
            <Button  variant="default" asChild>
              <Link
                className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                to="/about#how-it-works"
              >
                View Auction Process
              </Link>
            </Button>

          </div>
        </div>
      </section>
    </>
  );
}
