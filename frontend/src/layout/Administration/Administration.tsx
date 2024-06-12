import FetchButton from '@/components/button/FetchButton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import Accounts from '@/pages/Administration/Account/AccountsList'
import { fetchAllAuctionSessions } from '@/services/AuctionSessionService'
import { fetchAllConsignmentsService } from '@/services/ConsignmentService'
import { Bell, FolderMinus, Home, LineChart, Package, Package2, Settings, ShoppingCart, Users, Users2, PanelLeft, Search, AreaChartIcon, FolderClosed, Backpack, User2, Menu } from 'lucide-react'
import React, { createContext, useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
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
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useLocation, useNavigate } from "react-router-dom";
import { getCookie, removeCookie } from "@/utils/cookies";
import { fetchAccountById } from '@/services/AccountsServices'

export const ConsignmentsContext = createContext([]);

export default function Administration() {
    const [user, setUser] = React.useState<any>();
    useEffect(() => {
        const userCookie = getCookie("user");
        if (userCookie) {
            try {
                const userData = JSON.parse(userCookie);
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
    const [consignments, setConsignments] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
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

    const handleSignout = () => {
        removeCookie("user");
        removeCookie("token");
        navigate("/admin");
        // nav("/auth/login");
    };

    useEffect(() => {
        // console.log(location);
        let tempArrayPath = location.pathname.split("/");
        setArrayPath(tempArrayPath);
        console.log(breadcrumbs);
    }, [location])


    useEffect(() => {
        console.log(consignments);
    }, [consignments])

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] bg-background text-foreground">
            <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 ">
                        <Link to="" className="flex items-center gap-2 font-semibold">
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
                                Accounts
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
                                Auction Session
                            </Link>
                            <Link
                                to="items"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:text-primary"
                            >
                                <Backpack />
                                Manage Item
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
                                    <Link
                                        to=""
                                        className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                                    >
                                        <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                                        <span className="sr-only">BIDDIFY</span>
                                    </Link>
                                    <Link
                                        to=""
                                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                                    >
                                        <Home className="h-5 w-5" />
                                        Dashboard
                                    </Link>
                                    <Link
                                        to=""
                                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                                    >
                                        <ShoppingCart className="h-5 w-5" />
                                        Orders
                                    </Link>
                                    <Link
                                        to=""
                                        className="flex items-center gap-4 px-2.5 text-foreground"
                                    >
                                        <Package className="h-5 w-5" />
                                        Products
                                    </Link>
                                    <Link
                                        to=""
                                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                                    >
                                        <Users2 className="h-5 w-5" />
                                        Customers
                                    </Link>
                                    <Link
                                        to=""
                                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                                    >
                                        <LineChart className="h-5 w-5" />
                                        Settings
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
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar className="mr-5 hover:cursor-pointer">
                                    <AvatarImage src={user != null ? user?.avatar?.link : 'https://github.com/shadcn.png'} />
                                    <AvatarFallback>SOS</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Settings</DropdownMenuItem>
                                <DropdownMenuItem>Support</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleSignout}>Logout</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </header>
                    <Outlet ></Outlet></div>
            </ConsignmentsContext.Provider>
        </div>
    )
}
