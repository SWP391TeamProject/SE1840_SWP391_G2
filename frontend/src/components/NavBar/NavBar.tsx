import "./styles.css";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { ChevronDownIcon, MenuIcon } from "lucide-react";
import { useAuth } from "@/AuthProvider.tsx";
import ModeToggle from "../component/ModeToggle";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "../ui/navigation-menu";
import logo from "@/assets/icon.png";
import ProfileDropdownMenu from "@/components/NavBar/ProfileDropdownMenu.tsx";

export default function NavBar() {
  const auth = useAuth();

  return (
    <>
      <header className="z-10 px-4 lg:px-6 h-2/5 flex items-center  shadow-md drop-shadow w-full p-1 bg-background text-foreground dark:shadow-gray-600">
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
              {auth?.isAuthenticated() && <ProfileDropdownMenu></ProfileDropdownMenu>}
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
            {auth?.isAuthenticated() && <ProfileDropdownMenu></ProfileDropdownMenu>}
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
