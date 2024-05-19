import React, { useEffect } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
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

export default function NavBar() {
  const [isLogin, setIsLogin] = React.useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLogin(true);
    }
  }, []);

  return (
    <>
      <nav className="max-w-full  w-full flex border border-red-400  justify-between p-2">
        <Avatar>
          <AvatarImage src="src\assets\icon.png" />
        </Avatar>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src="https://avatars.githubusercontent.com/u/139426" />
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <a href="#">Profiles</a>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <a href="#">Notification</a>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <a href="#">Switch to seller account</a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {isLogin ? <a href="#">Signout</a> : <a href="#">Signin</a>}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </>
  );
}
