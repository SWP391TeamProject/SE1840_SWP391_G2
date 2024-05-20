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
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const [isLogin, setIsLogin] = React.useState(false);
  const nav = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLogin(true);
    }
  }, []);

  return (
    <>
      <nav className=" max-w-full  w-full flex border border-red-400  justify-between p-2">
        <Avatar>
          <AvatarImage src="src\assets\icon.png" />
        </Avatar>
        {/* <div className="auction-text justify-left px-3.5 py-3 my-auto bg-white rounded border border-orange-500 border-solid">
          Put your item for auction
        </div> */}
        <div className="flex p-2 px-3">
          <div className="auction-text justify-left px-3.5 py-3 my-auto bg-white rounded border border-orange-500 border-solid">
            Put your item for auction
          </div>
          <DropdownMenu>

            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src="https://avatars.githubusercontent.com/u/139426" />
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <a href="">Profiles</a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href="#">Notification</a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href="#">Switch to seller account</a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to='./admin'>Administration</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                {isLogin ? (
                  <a href="#">Signout</a>
                ) : (
                  <a onClick={() => nav("/login")}>Signin</a>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </nav>
    </>
  );
}
