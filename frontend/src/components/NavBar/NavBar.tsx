import React, { useEffect } from "react";
import "./styles.css";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Col, Container, Row } from "react-bootstrap";
import { Link, redirect } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { GavelIcon, MenuIcon } from "lucide-react";
import { get } from "http";
import { getCookie, removeCookie } from "@/utils/cookies";

export default function NavBar() {
  const [isLogin, setIsLogin] = React.useState(false);
  const nav = useNavigate();
  useEffect(() => {
    if (getCookie("user")) {
      setIsLogin(true);
    }
  }, []);
  const handleSignout = () => {
    removeCookie("user");
    removeCookie("token");
    setIsLogin(false);
    redirect("/");
    // nav("/auth/login");
  };

  return (
    <>
      <header className="  px-4 lg:px-6 h-14 flex items-center bg-white text-gray-900 shadow-md drop-shadow w-full">
        <Link className="flex items-center justify-center" to="/">
          <GavelIcon className="h-6 w-6" />
          <span className="font-semibold text-lg">Biddify</span>
        </Link>
        <nav className="hidden lg:flex items-center gap-6 ml-auto">
          <Button className="flex items-center gap-2" variant="outline" asChild>
            <Link to="/consignment">Put your item for auction</Link>
          </Button>
          {isLogin ? (
            <Button
              className="flex items-center gap-2"
              variant="outline"
              onClick={handleSignout}
            >
              Sign Out
            </Button>
          ) : (
            <Button
              className="flex items-center gap-2"
              variant="outline"
              asChild
            >
              <Link to="/auth/login">Login</Link>
            </Button>
          )}

          <Link
            className="text-sm font-medium hover:underline underline-offset-4 flex items-center gap-2 scroll-smooth"
            to="/Auctions"
          >
            Auctions
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4 flex items-center gap-2"
            to="#"
          >
            About
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4 flex items-center gap-2"
            to="#"
          >
            Blog
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4 flex items-center gap-2"
            to="#"
          >
            Contact
          </Link>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button className="lg:hidden ml-auto" size="icon" variant="outline">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-white" side="right">
            <div className="grid gap-2 py-6">
              <Link
                className="flex w-full items-center py-2 text-lg font-semibold"
                to="#"
              >
                Put your item for auction
              </Link>
              <Link
                className="flex w-full items-center py-2 text-lg font-semibold"
                to="#"
              >
                Auctions
              </Link>
              <Link
                className="flex w-full items-center py-2 text-lg font-semibold"
                to="#"
              >
                About
              </Link>
              <Link
                className="flex w-full items-center py-2 text-lg font-semibold"
                to="#"
              >
                Blog
              </Link>
              <Link
                className="flex w-full items-center py-2 text-lg font-semibold"
                to="#"
              >
                Contact
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </header>
    </>
  );
}
