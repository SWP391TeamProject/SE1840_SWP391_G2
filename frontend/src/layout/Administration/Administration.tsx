import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Bell, Home, LineChart, Package, Package2, ShoppingCart, Users2, PanelLeft, Search, AreaChartIcon, FolderClosed, User2, Menu, Newspaper, ShoppingBag } from 'lucide-react'
import React, { createContext, useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useLocation, useNavigate } from "react-router-dom";
import { getCookie, removeCookie } from "@/utils/cookies";
import { fetchAccountById } from '@/services/AccountsServices';
import logo from "@/assets/icon.png";
import {useAuth} from "@/AuthProvider.tsx";
import {useCurrency} from "@/CurrencyProvider.tsx";
import {useAppSelector} from "@/redux/hooks.tsx";
import {logout} from "@/services/AuthService.ts";
import ProfileDropdownMenu from "@/components/NavBar/ProfileDropdownMenu.tsx";

export const ConsignmentsContext = createContext([]);

export default function Administration() {
    const location = useLocation();
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

    const [consignments] = useState([]);
    const [arrayPath, setArrayPath] = useState([""]);
    const breadcrumbs = [
        <BreadcrumbItem key={1}>

        </BreadcrumbItem>
    ];

    const loadBreadcrumbs = () => {
        let tempPath = "/admin";
        // console.log(arrayPath);
        for (let i = 2; i < arrayPath.length; i++) {
            tempPath = tempPath + "/" + arrayPath[i];
            // console.log(tempPath);
            breadcrumbs.push(
                <BreadcrumbItem key={i}>
                    <BreadcrumbLink asChild>
                        <Link to={tempPath}>{arrayPath[i].toLocaleUpperCase()}</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
            );
            if (i < arrayPath.length - 1) {
                breadcrumbs.push(<BreadcrumbSeparator />);
            }
        }
        return (
            <BreadcrumbList >
                {breadcrumbs}
            </BreadcrumbList>
        );
    }

    useEffect(() => {
        // console.log(location);
        let tempArrayPath = location.pathname.split("/");
        setArrayPath(tempArrayPath);
        console.log(breadcrumbs);
    }, [location])

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] bg-background text-foreground">
            <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 ">
                        <Link to="#" className="flex items-center gap-2 font-semibold">
                            <Avatar>
                                <AvatarImage src="src\assets\icon.png" />
                            </Avatar>
                            <span className="">BIDDIFY</span>
                        </Link>
                        <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                            <Bell className="h-4 w-4" />
                            <span className="sr-only">Toggle notifications</span>
                        </Button>
                    </div>
                    <div className="flex-1">
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                            <Link
                                to="dashboard"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:text-primary"
                            >
                                <Menu />
                                Dashboard
                            </Link>

                            <Link
                                to="accounts"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:text-primary"
                            >
                                <User2 />
                                Manage Accounts
                            </Link>
                            <Link
                                to="consignments"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:text-primary"
                            >
                                <FolderClosed />
                                Manage Consignments
                            </Link>
                            <Link
                                to="auction-sessions"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:text-primary"
                            >
                                <AreaChartIcon />
                                Manage Auction Session
                            </Link>
                            <Link
                                to="items"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:text-primary"
                            >
                                <ShoppingBag />
                                Manage Items
                            </Link>
                            <Link
                                to="blogs"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:text-primary"
                            >
                                <Newspaper />
                                Manage Blogs
                            </Link>
                            <Link
                                to="notifications"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:text-primary"
                            >
                                <Bell />
                                Manage Notifications
                            </Link>

                        </nav>
                    </div>
                </div>
            </div>
            <ConsignmentsContext.Provider value={consignments}>
                <div className="flex flex-col sm:gap-4 sm:py-4">
                    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button size="icon" variant="outline" className="sm:hidden">
                                    <PanelLeft className="h-5 w-5" />
                                    <span className="sr-only">Toggle Menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="sm:max-w-xs">
                                <nav className="grid gap-6 text-lg font-medium">
                                    <Link to="#" className="flex items-center gap-2 font-semibold">
                                        <Avatar>
                                            <AvatarImage src="src\assets\icon.png" />
                                        </Avatar>
                                        <span className="">BIDDIFY</span>
                                    </Link>
                                    <Link
                                        to="dashboard"
                                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:text-primary"
                                    >
                                        <Menu />
                                        Dashboard
                                    </Link>

                                    <Link
                                        to="accounts"
                                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:text-primary"
                                    >
                                        <User2 />
                                        Manage Accounts
                                    </Link>
                                    <Link
                                        to="consignments"
                                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:text-primary"
                                    >
                                        <FolderClosed />
                                        Manage Consignments
                                    </Link>
                                    <Link
                                        to="auction-sessions"
                                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:text-primary"
                                    >
                                        <AreaChartIcon />
                                        Manage Auction Session
                                    </Link>
                                    <Link
                                        to="items"
                                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:text-primary"
                                    >
                                        <ShoppingBag />
                                        Manage Items
                                    </Link>
                                    <Link
                                        to="blogs"
                                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:text-primary"
                                    >
                                        <Newspaper />
                                        Manage Blogs
                                    </Link>
                                    <Link
                                        to="notifications"
                                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:text-primary"
                                    >
                                        <Bell />
                                        Manage Notifications
                                    </Link>
                                </nav>
                            </SheetContent>
                        </Sheet>
                        <Breadcrumb className="hidden md:flex">
                            {loadBreadcrumbs()}
                        </Breadcrumb>
                        <div className="relative ml-auto flex-1 md:grow-0">
                            <form action="" method="get">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search..."
                                    className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                                    name='search'
                                />
                            </form>
                        </div>
                        <ProfileDropdownMenu></ProfileDropdownMenu>
                    </header>
                    <Outlet></Outlet>
                </div>
            </ConsignmentsContext.Provider>
        </div>
    )
}
