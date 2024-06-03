import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { PaginationPrevious, PaginationItem, PaginationLink, PaginationEllipsis, PaginationNext, PaginationContent, Pagination } from "@/components/ui/pagination";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setAccounts, setCurrentAccount, setCurrentPageList } from "@/redux/reducers/Accounts";
import { fetchAccountsService, deleteAccountService } from "@/services/AccountsServices.ts";
import {
  Home,
  LineChart,
  ListFilter,
  Package,
  Package2,
  PanelLeft,
  Search,
  Settings,
  ShoppingCart,
  Users2,
  File,
  PlusCircle,
  MoreHorizontal,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EditAcc } from "../popup/EditAcc";
import { useLocation, useNavigate } from "react-router-dom";
import { AccountStatus } from "@/constants/enums";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function AccountsList() {
  const accountsList = useAppSelector((state) => state.accounts);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchAccounts = async () => {
    try {
      const list = await fetchAccountsService();
      if (list) {
        dispatch(setAccounts(list.data.content));
        dispatch(setCurrentPageList(list.data.content)); // Update currentPageList here
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditClick = (accountId: number) => {
    let account = accountsList.value.find(account => account.accountId == accountId);
    console.log(account);
    // return (<EditAcc account={account!} key={account!.accountId} hidden={false} />);
    dispatch(setCurrentAccount(account));
    navigate("/admin/accounts/edit");
  }

  const handleCreateClick = () => {
    // let account = accountsList.value.find(account => account.accountId == accountId);
    // console.log(account);
    // // return (<EditAcc account={account!} key={account!.accountId} hidden={false} />);
    // dispatch(setCurrentAccount(account));
    navigate("/admin/accounts/create");
  }

  const handleSuspendClick = (accountId: number) => {
    // console.log(account);
    // return (<EditAcc account={account!} key={account!.accountId} hidden={false} />);
    // dispatch(setCurrentAccount(account));
    // navigate("/admin/accounts/edit");
    deleteAccountService(accountId.toString()).then((res) => {
      console.log(res);
    })
  }

  const handleFilterClick = (status: AccountStatus[], filter: string) => {
    let filteredList = accountsList.value.filter(x => status.includes(x.status));
    console.log(filteredList);
    dispatch(setCurrentPageList(filteredList));
    setStatusFilter(filter);
  }

  useEffect(() => { }, [accountsList]);

  useEffect(() => {
    fetchAccounts();
    dispatch(setCurrentPageList(accountsList.value));
    setStatusFilter("all");
  }, []);

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger onClick={() => handleFilterClick([AccountStatus.ACTIVE, AccountStatus.DISABLED], "all")} value="all">All</TabsTrigger>
            <TabsTrigger onClick={() => handleFilterClick([AccountStatus.ACTIVE], "active")} value="active">Active</TabsTrigger>
            <TabsTrigger onClick={() => handleFilterClick([AccountStatus.DISABLED], "disabled")} value="disabled">Disabled</TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filter
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>
                  Active
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
            {/* <Button size="sm" variant="outline" className="h-8 gap-1">
                                    <File className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                        Export
                                    </span>
                                </Button> */}
            <Button size="sm" className="h-8 gap-1" onClick={() => { handleCreateClick() }}>
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Account
              </span>
            </Button>
          </div>
        </div>
        <TabsContent value={statusFilter}>
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Accounts</CardTitle>
              <CardDescription>
                Manage accounts and view their details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Id</TableHead>
                    <TableHead>User Name</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Email
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Phone
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Role
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Status
                    </TableHead>
                    {/* <TableHead className="hidden md:table-cell">
                                                    Created at
                                                </TableHead> */}
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accountsList.currentPageList.map((account) => (
                    <TableRow key={account.accountId}>
                      <TableCell className="font-medium">
                        {account.accountId}
                      </TableCell>
                      {/* <TableCell>
                                                    <Badge variant="outline">Draft</Badge>
                                                </TableCell> */}
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center ">
                          <Avatar className="mr-5">
                            <AvatarImage src={account.avatar != null ? account.avatar.link : 'https://github.com/shadcn.png'} />
                            <AvatarFallback>SOS</AvatarFallback>
                          </Avatar>
                          {account.nickname}
                          </div>

                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {account.email}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {account.phone}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {account.role}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {account.status == AccountStatus.ACTIVE ?
                          <Badge variant="default" className="bg-green-500">{AccountStatus[account.status]}</Badge> :
                          <Badge variant="destructive">{AccountStatus[account.status]}</Badge>}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => { handleEditClick(account.accountId) }}>Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { handleSuspendClick(account.accountId) }}>Suspend</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>

                  ))}
                </TableBody>
              </Table>
              {/* <div className="flex justify-center mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>
                        2
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">10</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div> */}
            </CardContent>
            <CardFooter>
              {/* <div className="text-xs text-muted-foreground">
                                        Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                                        products
                                    </div> */}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      {/* {accountsList.value.map((account) => (
        <EditAcc account={account} key={account.accountId} hidden={true} />
      ))} */}
    </main>
  );
}
