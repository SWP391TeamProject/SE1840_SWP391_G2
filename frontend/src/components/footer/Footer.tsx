import { GavelIcon } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/icon.png";

export default function Footer() {
  return (
    <>
      <footer className="w-full bg-gray-100 py-8 dark:bg-gray-800 text-foreground">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:gap-0">
          <div className="flex items-center justify-center gap-2">
            <img src={logo} className="w-8 h-8" alt="logo" />
            <span className="font-semibold text-lg text-orange-700 text-center">Biddify</span>
          </div>
          <nav className="flex gap-4 text-sm font-medium">
            <Link className="hover:underline underline-offset-4" to="/auctions">
              Auctions
            </Link>
            <Link className="hover:underline underline-offset-4" to="/about">
              About
            </Link>
            <Link className="hover:underline underline-offset-4" to="/blog">
              Blog
            </Link>
            <Link className="hover:underline underline-offset-4" to="/contact">
              Contact
            </Link>
          </nav>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2024 Biddify. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
