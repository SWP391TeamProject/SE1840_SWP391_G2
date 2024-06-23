import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";
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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setAccounts, setCurrentAccount, setCurrentPageList, setCurrentPageNumber } from "@/redux/reducers/Accounts";
import { fetchAccountsService, deleteAccountService, fetchAccountsByName, activateAccountService } from "@/services/AccountsServices.ts";
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
import { AccountStatus, Roles } from "@/constants/enums";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import PagingIndexes from "@/components/pagination/PagingIndexes";
import { set } from "date-fns";

export default function AccountsList() {
  const accountsList: any = useAppSelector((state) => state.accounts);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [roleFilter, setRoleFilter] = useState("");
  const url = new URL(window.location.href);
  let search = url.searchParams.get("search");
  const [reload, setReload] = useState(false);

  const fetchAccounts = async (pageNumber: number, role?: Roles) => {
    try {
      console.log(role);
      let res;
      res = await fetchAccountsService(pageNumber, 5, role);
      if (search && search?.length > 0) {
        res = await fetchAccountsByName(pageNumber, 5, search);
      }
      if (role != undefined) {
        res = await fetchAccountsService(pageNumber, 5, role);
      }
      if (res) {
        console.log(res);
        dispatch(setCurrentPageList(res.data.content)); // Update currentPageList here
        let paging: any = {
          pageNumber: res.data.number,
          totalPages: res.data.totalPages
        }
        dispatch(setCurrentPageNumber(paging));
      }
    } catch (error) {
      console.log(error);
    }
  };



  const handleEditClick = (accountId: number) => {
    let account = accountsList.currentPageList.find(account => account.accountId == accountId);
    // return (<EditAcc account={account!} key={account!.accountId} hidden={false} />);
    dispatch(setCurrentAccount(account));
    navigate(`/admin/accounts/${accountId}`);
  }

  const handleCreateClick = () => {
    // let account = accountsList.value.find(account => account.accountId == accountId);
    // // return (<EditAcc account={account!} key={account!.accountId} hidden={false} />);
    // dispatch(setCurrentAccount(account));
    navigate("/admin/accounts/create");
  }

  const handleSuspendClick = (accountId: number) => {
    // return (<EditAcc account={account!} key={account!.accountId} hidden={false} />);
    // dispatch(setCurrentAccount(account));
    // navigate("/admin/accounts/edit");
    deleteAccountService(accountId.toString()).then((res) => {
      console.log(res);
    })
    setReload(!reload);
  }
  
  const handleActiveClick = (accountId: number) => {
    // return (<EditAcc account={account!} key={account!.accountId} hidden={false} />);
    // dispatch(setCurrentAccount(account));
    // navigate("/admin/accounts/edit");
    activateAccountService(accountId.toString()).then((res) => {
      console.log(res);
    })
    setReload(!reload);
  }

  const handleFilterClick = (roles: Roles[], filter: string) => {
    // let filteredList = accountsList.value.filter(x => status.includes(x.status));
    // dispatch(setCurrentPageList(filteredList));
    // if (filter != roleFilter) {
    url.searchParams.delete("search");
    window.history.replaceState(null, "", url.toString());
    search = null;
    if (filter == "all") {
      fetchAccounts(0);
      setRoleFilter(filter);
    }
    else {
      console.log(roles);
      fetchAccounts(0, roles[0]);
      setRoleFilter(filter);
    }

    // }
  }

  useEffect(() => { }, [accountsList.currentPageList]);

  const handlePageSelect = (pageNumber: number) => {
    fetchAccounts(pageNumber, accountsList.filter);
  }

  useEffect(() => {
    fetchAccounts(accountsList.currentPageNumber);
    // data.then((data) => {
    //   dispatch(setCurrentPageList(data.content));
    // })
    setRoleFilter("all");

  }, []);
  useEffect(() => {
    fetchAccounts(accountsList.currentPageNumber);
    fetchAccounts(accountsList.currentPageNumber); 
    setRoleFilter("all");

  }, [reload]);

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger onClick={() => handleFilterClick([Roles.ADMIN, Roles.MANAGER, Roles.STAFF, Roles.MEMBER], "all")} value="all">All</TabsTrigger>
            <TabsTrigger onClick={() => handleFilterClick([Roles.ADMIN], "admin")} value="admin">Admin</TabsTrigger>
            <TabsTrigger onClick={() => handleFilterClick([Roles.MANAGER], "manager")} value="manager">Manager</TabsTrigger>
            <TabsTrigger onClick={() => handleFilterClick([Roles.STAFF], "staff")} value="staff">Staff</TabsTrigger>
            <TabsTrigger onClick={() => handleFilterClick([Roles.MEMBER], "member")} value="member">Member</TabsTrigger>
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
        <TabsContent value={roleFilter}>
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader >

              <CardTitle className="flex justify-between items-center">
                Accounts
                <div className="w-full basis-1/2">
                  <PagingIndexes className="basis-1/2" pageNumber={accountsList.currentPageNumber ? accountsList.currentPageNumber : 0} size={10} totalPages={accountsList.totalPages} pageSelectCallback={handlePageSelect}></PagingIndexes>
                </div>
              </CardTitle>
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
                    <TableHead className="md:table-cell">
                      Email
                    </TableHead>
                    <TableHead className="md:table-cell">
                      Phone
                    </TableHead>
                    <TableHead className="md:table-cell">
                      Role
                    </TableHead>
                    <TableHead className="md:table-cell w-28">
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
                      <TableCell className=" md:table-cell">
                        <div className="flex items-center ">
                          <Avatar className="mr-5">
                            <AvatarImage src={account.avatar != null ? account.avatar.link : 'https://github.com/shadcn.png'} />
                            <AvatarFallback>SOS</AvatarFallback>
                          </Avatar>
                          {account.nickname}
                        </div>

                      </TableCell>
                      <TableCell className=" md:table-cell">
                        {account.email}
                      </TableCell>
                      <TableCell className=" md:table-cell">
                        {account.phone}
                      </TableCell>
                      <TableCell className=" md:table-cell">
                        {account.role}
                      </TableCell>
                      <TableCell className=" md:table-cell">
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
                            {
                              account.status == AccountStatus.ACTIVE ?
                              <DropdownMenuItem onClick={() => { handleSuspendClick(account.accountId) }}>Suspend</DropdownMenuItem>:
                              <DropdownMenuItem onClick={() => { handleActiveClick(account.accountId) }}>Activate</DropdownMenuItem>
                            }
                            
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>

                  ))}
                </TableBody>
              </Table>
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
