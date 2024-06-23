import "./styles.css";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { ChevronDownIcon, GavelIcon, MenuIcon } from "lucide-react";
import { useAuth } from "@/AuthProvider.tsx";
import { useAppSelector } from "@/redux/hooks.tsx";
import { logout } from "@/services/AuthService.ts";
import { removeCookie } from "@/utils/cookies";
import ModeToggle from "../component/ModeToggle";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "../ui/navigation-menu";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import logo from "@/assets/icon.png";

export default function NavBar() {
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
      <header className="px-4 lg:px-6 h-2/5 flex items-center  shadow-md drop-shadow w-full p-1 bg-background text-foreground dark:shadow-gray-600">
        <Link className="flex items-center justify-center" to="/">
          <div className="flex items-center justify-center gap-2">
            <img src={logo} className="w-8 h-8" alt="logo" />
            <span className="font-semibold text-lg text-orange-700 text-center">Biddify</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-6 ml-auto w-fit">
          <Button variant="outline" className="ml-auto" asChild>
            <Link to="/create-consignment">Put Your Item For Auction</Link>
          </Button>
          <NavigationMenu className="hidden lg:flex items-center gap-6 ml-auto">
            <NavigationMenuList>

              <NavigationMenuItem>
                {!auth.isAuthenticated() ? (
                  <Button
                    className="flex items-center gap-2  "
                    variant="default"
                    asChild
                  >
                    <Link to="/auth/login">Login</Link>
                  </Button>
                ) : ''}
              </NavigationMenuItem>


              <NavigationMenuItem>
                <ModeToggle />
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Auctions</NavigationMenuTrigger>
                <NavigationMenuContent className="md:w-36">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                    <Link to="/auctions" className={navigationMenuTriggerStyle()} >Auctions</Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                    <Link to="/auctions/featured" className={navigationMenuTriggerStyle()}>Featured</Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                    <Link to="/auctions/past" className={navigationMenuTriggerStyle()}>Past Auctions</Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                    <Link className={navigationMenuTriggerStyle()} to="/auctions/upcoming">Upcoming</Link>
                  </NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                  <Link to="/items">Item</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                  <Link to="/blogs">Blog</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                  <Link to="/about">About</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                  <Link to="/contact">Contact</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              {auth?.isAuthenticated() &&
                <NavigationMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Avatar className="hover:cursor-pointer">
                        <AvatarImage src={auth.user.avatar?.link} alt="avatar" />
                        <AvatarFallback > {auth?.user?.nickname[0]}</AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    {unreadNoti.count > 0 ? <span className="absolute right-[-5px] top-[-5px] w-6 h-6 bg-red-500 text-white rounded-full text-center">{unreadNoti.count}</span> : null}

                    <DropdownMenuContent align="end" className="w-fit p-4">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link to={'/profile/overview'}>Profile</Link>
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
                </NavigationMenuItem>}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>






        <Sheet>
          <SheetTrigger asChild>
            <Button className="lg:hidden ml-auto" size="icon" variant="outline">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-white" side="right">
            {auth?.isAuthenticated() &&
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="hover:cursor-pointer h-16 w-16 ">
                    <AvatarImage src={auth.user.avatar?.link} alt="avatar" />
                    <AvatarFallback > {auth?.user?.nickname[0]}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                {unreadNoti.count > 0 ? <span className="absolute right-[-5px] top-[-5px] w-6 h-6 bg-red-500 text-white rounded-full text-center">{unreadNoti.count}</span> : null}

                <DropdownMenuContent align="end" className="w-fit p-4">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to={'/profile/overview'}>Profile</Link>
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
            <div className="grid gap-2 py-6">
              {!auth.isAuthenticated() ? (
                <Button
                  className="flex items-center gap-2  "
                  variant="default"
                  asChild
                >
                  <Link to="/auth/login">Login</Link>
                </Button>
              ) : ''}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex w-full items-center py-2 text-lg font-semibold">
                  Auctions
                  <ChevronDownIcon className="h-4 w-4 ml-1" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem>
                    <Link to="/auctions" className={navigationMenuTriggerStyle()}>Auctions</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/auctions/featured" className={navigationMenuTriggerStyle()}>Featured</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/auctions/past" className={navigationMenuTriggerStyle()}>Past Auctions</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link className={navigationMenuTriggerStyle()} to="/auctions/upcoming">Upcoming</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link
                className="flex w-full items-center py-2 text-lg font-semibold"
                to="/about"
              >
                About
              </Link>
              <Link
                className="flex w-full items-center py-2 text-lg font-semibold"
                to="/blogs"
              >
                Blog
              </Link>
              <Link
                className="flex w-full items-center py-2 text-lg font-semibold"
                to="/contact"
              >
                Contact
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </header >
    </>
  );
}
