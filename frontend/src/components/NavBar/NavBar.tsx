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
import { fetchAccountById } from "@/services/AccountsServices";
import axios from "axios";
import {countUnreadNotifications} from "@/services/NotificationService.ts";
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});
export default function NavBar() {
  const [isLogin, setIsLogin] = React.useState(false);
  const nav = useNavigate();
  const [user, setUser] = React.useState<any>();
  const [unreadNoti, setUnreadNoti] = React.useState<number>(0);

  useEffect(() => {
    const userCookie = getCookie("user");
    if (userCookie) {
      try {
        const userData = JSON.parse(userCookie);
        setIsLogin(true);
        fetchAccountById(userData?.id).then((res) => {
          console.log(res.data)
          setUser(res.data)
        }).catch((err) => {
          console.log(err);
        });
      } catch (err) {
        console.error("Failed to parse user cookie:", err);
      }
    }
  }, []);

  useEffect(() => {
    console.log('user:');
    console.log(user);
  }, [user]);

  useEffect(() => {
    countUnreadNotifications().then((r) => setUnreadNoti(r.data));
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
        
          {isLogin ? '' : (
            <Button
              className="flex items-center gap-2 bg-green-500 text-white"
              variant="default"
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
            to="/about"
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
            to="/contact"
          >
            Contact
          </Link>
          {
            isLogin &&
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full relative"
                >
                  <img
                    src={user && user.avatar ? user.avatar.link : "/placeholder-user.jpg"}
                    width={36}
                    height={36}
                    alt="Avatar"
                    className="overflow-hidden rounded-full"
                  />
                  {unreadNoti > 0 ? <span className="absolute right-[-5px] top-[-5px] w-5 h-5 bg-red-500 text-white rounded-full text-center">{unreadNoti}</span> : null}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-fit p-4">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={'/profile'}>Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={'/profile/notification'}>
                    <span>Notification</span>
                    <span className="ml-2 w-5 h-5 bg-red-500 text-white rounded-full text-center">{unreadNoti}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex justify-between items-center gap-2">
                    <div className="basis-1/2">
                      Balance:
                    </div>
                    <div className="basis-1/2 font-medium text-left block">
                      <p >
                        {user && user?.balance !== null ? user?.balance : '0'}
                      </p>
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={'/dashboard'}>Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignout}
                >Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          }

        </nav>







        {/* Mobile menu */}
        {/*TODO: Add mobile menu */}
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
