import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCurrentAccount } from '@/redux/reducers/Accounts';
import { fetchAccountsService, deleteAccountService, activateAccountService } from '@/services/AccountsServices.ts';
import { ListFilter } from 'lucide-react';
import { Suspense, useEffect, useState } from 'react';

import { RoleName } from '@/constants/enums';
import { useLocation, useNavigate } from 'react-router-dom';
import { DataTableSkeleton } from '@/components/data-tables/data-tables-skeleton';
import { AccountsTable } from './account-data-table/account-table';
import { Account } from '@/models/AccountModel';
import { Page } from '@/models/Page';

export default function AccountsList() {
  const accountsList: any = useAppSelector((state) => state.accounts);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [roleFilter, setRoleFilter] = useState('');
  const [seletedRole, setSelectedRole] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const url = new URL(window.location.href);
  // let search = url.searchParams.get('search');
  const [reload, setReload] = useState(false);
  let pageNumber = url.searchParams.get('page');
  let sort = url.searchParams.get('sort');
  let pageSize = url.searchParams.get('per_page');
  const [accountPromise, setAccountPromise] = useState<Promise<Page<Account>>>();
  let search = url.searchParams.get('search'); // const accountPromise = fetchAccountsService({ page: Number.parseInt(pageNumber), size: Number.parseInt(pageSize), sort: sort, role: ""});

  // const fetchAccounts = async (pageNumber: number, role?: Roles) => {
  //   try {
  //     setIsLoading(true);
  //     console.log(role);
  //     let res;
  //     if (search && search?.length > 0) {
  //       res = await fetchAccountsByName(pageNumber, 5, search);
  //     }
  //     else if (role != undefined) {
  //       res = await fetchAccountsService(pageNumber, 5, role);
  //     }
  //     else {
  //       res = await fetchAccountsService(pageNumber, 5);
  //     }
  //     if (res) {
  //       console.log(res);
  //       dispatch(setCurrentPageList(res.data.content)); // Update currentPageList here
  //       let paging: any = {
  //         pageNumber: res.data.number,
  //         totalPages: res.data.totalPages
  //       }
  //       dispatch(setCurrentPageNumber(paging));
  //       setIsLoading(false);
  //     }
  //   } catch (error) {
  //     setIsLoading(false);
  //     console.log(error);
  //   }
  // };

  const handleEditClick = (accountId: number) => {
    let account = accountsList.currentPageList.find((account) => account.accountId == accountId);
    // return (<EditAcc account={account!} key={account!.accountId} hidden={false} />);
    dispatch(setCurrentAccount(account));
    navigate(`/admin/accounts/${accountId}`);
  };

  const handleCreateClick = () => {
    // let account = accountsList.value.find(account => account.accountId == accountId);
    // // return (<EditAcc account={account!} key={account!.accountId} hidden={false} />);
    // dispatch(setCurrentAccount(account));
    navigate('/admin/accounts/create');
  };

  const handleSuspendClick = (accountId: number) => {
    // return (<EditAcc account={account!} key={account!.accountId} hidden={false} />);
    // dispatch(setCurrentAccount(account));
    // navigate("/admin/accounts/edit");
    deleteAccountService(accountId.toString()).then((res) => {
      console.log(res);
      setReload(!reload);
    });
  };

  const handleActiveClick = (accountId: number) => {
    // return (<EditAcc account={account!} key={account!.accountId} hidden={false} />);
    // dispatch(setCurrentAccount(account));
    // navigate("/admin/accounts/edit");
    activateAccountService(accountId.toString()).then((res) => {
      console.log(res);
    });
    setReload(!reload);
  };

  // const handleFilterClick = (roles: Roles[], filter: string) => {
  //   // let filteredList = accountsList.value.filter(x => status.includes(x.status));
  //   // dispatch(setCurrentPageList(filteredList));
  //   // if (filter != roleFilter) {
  //   url.searchParams.delete("search");
  //   window.history.replaceState(null, "", url.toString());
  //   search = null;
  //   if (filter == "all") {
  //     fetchAccounts(0);
  //     setRoleFilter(filter);
  //     accountsList.filter = undefined;
  //   }
  //   else {
  //     console.log(roles);
  //     fetchAccounts(0, roles[0]);
  //     setRoleFilter(filter);
  //     accountsList.filter = roles[0];
  //   }

  //   // }
  // }

  const handleFilterClick = (role: string) => {
    if (role !== seletedRole) {
      if (role === 'All') {
        setSelectedRole('');
        setAccountPromise(
          fetchAccountsService({
            page: Number.parseInt(pageNumber),
            size: Number.parseInt(pageSize),
            sort: sort,
            role: '',
          })
        );
      } else {
        setSelectedRole(role);
        setAccountPromise(
          fetchAccountsService({
            page: Number.parseInt(pageNumber),
            size: Number.parseInt(pageSize),
            sort: sort,
            role: role,
          })
        );
      }
    }
  };

  // const handleRoleFilterSelect = (...event: any) => {
  //   if (event[0] === "All") {
  //     setSelectedRole("");
  //   } else {
  //     setSelectedRole(event[0]);
  //   }
  // }

  // const handlePageSelect = (pageNumber: number) => {
  //   fetchAccounts(pageNumber, accountsList.filter);
  // }

  useEffect(() => {}, [seletedRole]);

  useEffect(() => {
    // fetchAccounts(accountsList.currentPageNumber);
    // data.then((data) => {
    //   dispatch(setCurrentPageList(data.content));
    // })
    setRoleFilter('all');
    // setAccountPromise(fetchAccountsService({ page: Number.parseInt(pageNumber), size: Number.parseInt(pageSize), sort: sort, role: ""}));
    console.log(url);
  }, []);

  useEffect(() => {
    console.log(pageNumber);
    // if (!loc?.state) {
    if (Number.parseInt(pageNumber) >= 1)
      setAccountPromise(
        fetchAccountsService({
          page: Number.parseInt(pageNumber),
          size: Number.parseInt(pageSize),
          sort: sort,
          role: seletedRole,
          search: search,
        })
      );
    // }
    console.log(search);
  }, [pageNumber, pageSize, sort, search]);

  useEffect(() => {
    // fetchAccounts(accountsList.currentPageNumber);
    setRoleFilter('all');
  }, [reload]);

  // useEffect(() => {
  //   console.log(url);
  // }, [url]);

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Tabs defaultValue="all">
        <div className="flex items-center">
          {/* <TabsList>
            <TabsTrigger onClick={() => handleFilterClick([Roles.ADMIN, Roles.MANAGER, Roles.STAFF, Roles.MEMBER], "all")} value="all">All</TabsTrigger>
            <TabsTrigger onClick={() => handleFilterClick([Roles.ADMIN], "admin")} value="admin">Admin</TabsTrigger>
            <TabsTrigger onClick={() => handleFilterClick([Roles.MANAGER], "manager")} value="manager">Manager</TabsTrigger>
            <TabsTrigger onClick={() => handleFilterClick([Roles.STAFF], "staff")} value="staff">Staff</TabsTrigger>
            <TabsTrigger onClick={() => handleFilterClick([Roles.MEMBER], "member")} value="member">Member</TabsTrigger>
          </TabsList> */}
          {/* <div className="ml-auto flex items-center gap-2"> */}
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
          {/* <Button size="sm" className="h-8 gap-1" onClick={() => { handleCreateClick() }}>
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Account
              </span>
            </Button>
          </div> */}
        </div>
        <TabsContent value={roleFilter}>
          {/* {isLoading ?
            <LoadingAnimation />
            :  */}
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Accounts
                {/* <div className="w-full basis-1/2">
                    <PagingIndexes className="basis-1/2" pageNumber={accountsList.currentPageNumber ? accountsList.currentPageNumber : 0} size={10} totalPages={accountsList.totalPages} pageSelectCallback={handlePageSelect}></PagingIndexes>
                  </div> */}
              </CardTitle>
              <CardDescription>
                Manage accounts and view their details.
                {/* <ConfirmationButton
                  label="Add Account"
                  title="Are you sure to create an Account?"
                  message=""
                  className="h-8 gap-1"
                  onSuccess={() => { handleCreateClick() }}
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Account
                  </span>
                </ConfirmationButton> */}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* <Table>
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
                      <TableHead className="hidden md:table-cell">
                                                    Created at
                                                </TableHead>
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
                        <TableCell>
                                                    <Badge variant="outline">Draft</Badge>
                                                </TableCell>
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
                                  <DropdownMenuItem onClick={() => { handleSuspendClick(account.accountId) }}>Suspend</DropdownMenuItem> :
                                  <DropdownMenuItem onClick={() => { handleActiveClick(account.accountId) }}>Activate</DropdownMenuItem>
                              }

                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>

                    ))}
                  </TableBody>
                </Table> */}
              <Suspense
                fallback={
                  <DataTableSkeleton
                    columnCount={5}
                    searchableColumnCount={1}
                    filterableColumnCount={2}
                    cellWidths={['10rem', '40rem', '12rem', '12rem', '8rem']}
                    shrinkZero
                  />
                }
              >
                {/* <Select onValueChange={handleRoleFilterSelect} >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Role</SelectLabel>
                        <SelectItem value="All" key={0}>All</SelectItem>
                        {Object.values(RoleName).map((role) => (
                          <SelectItem value={role}>{role}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select> */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <ListFilter className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Role</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuLabel>Role</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      className="w-9/12"
                      checked={seletedRole == ''}
                      onClick={() => handleFilterClick('All')}
                    >
                      All
                    </DropdownMenuCheckboxItem>

                    {Object.values(RoleName).map((role) => (
                      <div className="flex m-1 items-center justify-between" key={role}>
                        <DropdownMenuCheckboxItem
                          className="w-9/12"
                          checked={seletedRole == role}
                          onClick={() => handleFilterClick(role)}
                        >
                          {role}
                        </DropdownMenuCheckboxItem>
                      </div>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <AccountsTable accountPromise={accountPromise} />
              </Suspense>
            </CardContent>
            <CardFooter>
              {/* <div className="text-xs text-muted-foreground">
                                        Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                                        products
                                    </div> */}
            </CardFooter>
          </Card>
          {/* } */}
        </TabsContent>
      </Tabs>
      {/* {accountsList.value.map((account) => (
        <EditAcc account={account} key={account.accountId} hidden={true} />
      ))} */}
    </main>
  );
}
