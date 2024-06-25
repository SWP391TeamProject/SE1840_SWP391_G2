import {useAuth} from "@/AuthProvider.tsx";
import {useCurrency} from "@/CurrencyProvider.tsx";
import {useAppSelector} from "@/redux/hooks.tsx";
import {logout} from "@/services/AuthService.ts";
import {removeCookie} from "@/utils/cookies.ts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Link} from "react-router-dom";
import React, {ReactNode} from "react";
import {Roles} from "@/constants/enums.tsx";

interface ProfileDropdownMenuProps {
  children?: ReactNode;
}

export default function ProfileDropdownMenu({ children }: ProfileDropdownMenuProps) {
  const auth = useAuth();
  const currency = useCurrency();
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="relative inline-block">
            <Avatar className="hover:cursor-pointer">
              <AvatarImage src={auth.user.avatar?.link} alt="avatar" />
              <AvatarFallback> {auth.user.nickname[0]}</AvatarFallback>
            </Avatar>
            {unreadNoti.count > 0 ? <span className="absolute right-[-5px] top-[-5px] w-6 h-6 bg-red-500 text-white rounded-full text-center">{unreadNoti.count}</span> : null}
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-fit p-4">
          <DropdownMenuLabel>{auth.user.nickname}</DropdownMenuLabel>
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
          {[Roles.ADMIN, Roles.MANAGER, Roles.STAFF].includes(auth.user.role) && (
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link to={'/admin'}>Administration</Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem style={{ pointerEvents: "none" }}>
            <div className="flex justify-between items-center gap-2">
              <div className="basis-1/2">
                Balance:
              </div>
              <div className="basis-1/2 font-medium text-left block">
                <p>
                  {currency.format({
                    amount: auth.user.balance,
                    compact: true
                  })}
                </p>
              </div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {React.Children.count(children) > 0 && (
            <>
              {children}
            </>
          )}
          <DropdownMenuItem onClick={handleSignout} className="cursor-pointer">Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}