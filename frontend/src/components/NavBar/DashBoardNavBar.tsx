import "./styles.css";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, redirect } from "react-router-dom";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "../ui/navigation-menu";
import { useAuth } from "@/AuthProvider.tsx";
import { useAppSelector } from "@/redux/hooks.tsx";
import { logout } from "@/services/AuthService.ts";
import { MenuIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { removeCookie } from "@/utils/cookies";

export default function DashBoardNavBar() {
  const auth = useAuth();
  const unreadNoti = useAppSelector((state) => state.unreadNotificationCount);

  const handleSignout = function () {
    logout().then(function () {
      removeCookie("user");
      removeCookie('token')
      window.location.href = '/auth/login';
    })
  };

  return (
    <>
      <header className="  px-4 lg:px-6 h-14 flex items-center bg-white text-gray-900 shadow-md drop-shadow w-full dark:bg-black text-foreground dark:shadow-gray-800">
        <Link className="flex items-center justify-center" to="/">
          <img src="https://github.com/SWP391TeamProject/SE1840_SWP391_G2/raw/develop/images/logo-cut.svg" className="w-16 h-10 object-contain" alt="logo" />
        </Link>
        <NavigationMenu className="hidden lg:flex items-center gap-6 ml-auto">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild >
                <Link to="/dashboard" className={navigationMenuTriggerStyle()}>Home</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild >
                <Link to="/dashboard/consignments" className={navigationMenuTriggerStyle()}>Consignments</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild >
                <Link to="/dashboard/bids" className={navigationMenuTriggerStyle()}>Bids</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <nav className="hidden lg:flex items-center gap-6 ml-auto">
          {
            auth.isAuthenticated() &&
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {auth &&
                  <Avatar className="hover:cursor-pointer ">
                    <AvatarImage src={auth.user.avatar?.link} alt="avatar" />
                    <AvatarFallback > {auth?.user?.nickname[0]}</AvatarFallback>

                  </Avatar>}
              </DropdownMenuTrigger>
              {unreadNoti.count > 0 ? <span className="absolute right-[-5px] top-[-5px] w-6 h-6 bg-red-500 text-white rounded-full text-center">{unreadNoti.count}</span> : null}

              <DropdownMenuContent align="end" className="xmd:hidden lg:block w-fit p-4">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to={'/profile'}>Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to={'/profile/notification'} className="flex gap-2">
                    <div>Notification</div>
                    <div className="flex justify-center items-center w-5 h-5 bg-red-500 text-white rounded-full text-xs">
                      <div>{unreadNoti.count}</div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to={'/'}>Switch to auctioning</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem style={{ pointerEvents: "none" }}>
                  <div className="flex justify-between items-center gap-2">
                    <div className="basis-1/2">
                      Balance:
                    </div>
                    <div className="basis-1/2 font-medium text-left block">
                      <p >
                        {auth.user && auth.user.balance !== null ? auth.user.balance : '0'}
                      </p>
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignout} className="cursor-pointer">Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          }

        </nav>
        <Sheet >
          <SheetTrigger asChild>
            <Button className="lg:hidden ml-auto" size="icon" variant="outline">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-white" side="top">
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
