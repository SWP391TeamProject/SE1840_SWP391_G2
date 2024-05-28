import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import Accounts from '@/pages/Administration/AccountsList'
import { Bell, FolderMinus, Home, LineChart, Package, Package2, Settings, ShoppingCart, Users, Users2 } from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'

export default function Administration() {




    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link to="" className="flex items-center gap-2 font-semibold">
                            <Avatar>
                                <AvatarImage src="src\assets\icon.png" />
                            </Avatar>
                            <span className="">BIDIFY</span>
                        </Link>
                        <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                            <Bell className="h-4 w-4" />
                            <span className="sr-only">Toggle notifications</span>
                        </Button>
                    </div>
                    <div className="flex-1">
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                            <Link
                                to="/admin"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                            >
                                <Home className="h-4 w-4" />
                                Dashboard
                            </Link>
                            {/* <Link
                                to=""
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                            >
                                <ShoppingCart className="h-4 w-4" />
                                Orders
                                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                                    6
                                </Badge>
                            </Link> */}
                            {/* <Link
                                to=""
                                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
                            >
                                <Package className="h-4 w-4" />
                                Products{" "}
                            </Link> */}
                            <Link
                                to="accounts"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:text-primary"
                            >
                                <Users className="h-4 w-4" />
                                Accounts
                            </Link>
                            <Link
                                to="consignments"
                                className={"flex items-center gap-3 rounded-lg  px-3 py-2 text-foreground transition-all hover:text-primary"}

                                
                            >
                                <FolderMinus className="h-4 w-4" />
                                Consignments
                            </Link>
                            {/* <Link
                                to=""
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                            >
                                <LineChart className="h-4 w-4" />
                                Analytics
                            </Link> */}
                        </nav>
                    </div>
                </div>
            </div>
            <Outlet></Outlet>
        </div>
    )
}
