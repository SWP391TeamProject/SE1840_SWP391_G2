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
import { GavelIcon, MenuIcon } from "lucide-react";
import {useAuth} from "@/AuthProvider.tsx";
import {useAppSelector} from "@/redux/hooks.tsx";
import {logout} from "@/services/AuthService.ts";

export default function NavBar() {
  const auth = useAuth();
  const unreadNoti = useAppSelector((state) => state.unreadNotificationCount);

  const handleSignout = function () {
    logout().then(function() {
      redirect("/");
    })
  };

  return (
    <>
      <header className="  px-4 lg:px-6 h-14 flex items-center bg-white text-gray-900 shadow-md drop-shadow w-full">
        <Link className="flex items-center justify-center" to="/">
          <GavelIcon className="h-6 w-6" />
          <span className="font-semibold text-lg">Biddify</span>
        </Link>
        <nav className="hidden lg:flex items-center gap-6 ml-auto">

          {auth.isAuthenticated() ? '' : (
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
              auth.isAuthenticated() &&
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full relative"
                >
                  <img
                    src={auth.user.avatar ?? './placeholder.svg'}
                    width={36}
                    height={36}
                    alt="Avatar"
                    className="overflow-hidden rounded-full"
                  />
                  {unreadNoti.count > 0 ? <span className="absolute right-[-5px] top-[-5px] w-5 h-5 bg-red-500 text-white rounded-full text-center">{unreadNoti.count}</span> : null}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-fit p-4">
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
                  <Link to={'/dashboard'}>Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem style={{pointerEvents: "none"}}>
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
