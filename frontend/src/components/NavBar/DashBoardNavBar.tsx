import "./styles.css";
import {
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "../ui/navigation-menu";
import { useAuth } from "@/AuthProvider.tsx";
import { MenuIcon } from "lucide-react";
import logo from "@/assets/icon.png";
import ProfileDropdownMenu from "@/components/NavBar/ProfileDropdownMenu.tsx";


export default function DashBoardNavBar() {
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
        <nav className="hidden lg:flex items-center gap-6 ml-auto">
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
              <NavigationMenuItem>
                {
                  auth.isAuthenticated() &&
                  <ProfileDropdownMenu>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link to={'/'}>Switch to auctioning</Link>
                    </DropdownMenuItem>
                  </ProfileDropdownMenu>
                }
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>
        <Sheet >
          <SheetTrigger asChild>
            <Button className="lg:hidden ml-auto" size="icon" variant="outline">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-white" side="right">
            {auth?.isAuthenticated() &&
              <ProfileDropdownMenu>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to={'/'}>Switch to auctioning</Link>
                </DropdownMenuItem>
              </ProfileDropdownMenu>
            }
            <div className="grid gap-2 py-6">
              <Link
                className="flex w-full items-center py-2 text-lg font-semibold "
                to="/dashboard"
              >
                Home
              </Link>
              <Link
                className="flex w-full items-center py-2 text-lg font-semibold"
                to="/dashboard/consignments"
              >
                Consignments
              </Link>
              <Link
                className="flex w-full items-center py-2 text-lg font-semibold"
                to="/dashboard/bids"
              >
                Bids
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </header>
    </>
  );
}
