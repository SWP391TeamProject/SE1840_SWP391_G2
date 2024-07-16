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
import { Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EditAcc } from "../popup/EditAcc";
import { useLocation, useNavigate } from "react-router-dom";
import { setCurrentItem, setCurrentPageList, setCurrentPageNumber, setItems } from "@/redux/reducers/Items";
import { getItemsByName, getItemsByStatus } from "@/services/ItemService";
import { ItemStatus } from "@/constants/enums";
import PagingIndexes from "@/components/pagination/PagingIndexes";
import { useCurrency } from "@/CurrencyProvider.tsx";
import LoadingAnimation from "@/components/loadingAnimation/LoadingAnimation";
import { ItemsTable } from "./testserversideTable/item-table";
import { DataTableSkeleton } from "@/components/data-tables/data-tables-skeleton";
import { getItems } from "./testserversideTable/item-apis";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ItemsList() {
  const itemsList = useAppSelector((state) => state.items);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("");
  const [seletedStatus, setSelectedStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const url = new URL(window.location.href);
  let search = url.searchParams.get("search");
  let pageNumber = url.searchParams.get("page");
  let sort = url.searchParams.get("sort");
  let pageSize = url.searchParams.get("per_page");
  const [itemPromise, setItemPromise] = useState<Promise<any>>();

  const currency = useCurrency();
  // const itemPromise = getItems({ page: Number.parseInt(pageNumber), size: Number.parseInt(pageSize), sort: sort , status: seletedStatus});

  const fetchItems = async (pageNumber: number, status?: ItemStatus) => {
    try {
      let res;
      setIsLoading(true);
      if (search != null) {
        res = await getItemsByName(pageNumber, 5, search);
      } else if (status) {
        res = await getItemsByStatus(status, pageNumber, 5);
      } else {
        res = await getItems(pageNumber, 5);
      }
      console.log(res);
      if (res) {
        // dispatch(setItems(list.data.content));
        dispatch(setCurrentPageList(res.data.content)); // Update currentPageList here
        let paging: any = {
          pageNumber: res.data.number,
          totalPages: res.data.totalPages
        }
        dispatch(setCurrentPageNumber(paging));
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const handleEditClick = (itemId: number) => {
    let item = itemsList.value.find(item => item.itemId == itemId);
    console.log(item);
    // return (<EditAcc item={item!} key={item!.itemId} hidden={false} />);
    dispatch(setCurrentItem(item));
    navigate(`/admin/items/${itemId}`);
  }

  // const handlePageSelect = (pageNumber: number) => {
  //   if (statusFilter === "all") {
  //     fetchItems(pageNumber);
  //   } else {
  //     fetchItems(pageNumber, statusFilter as ItemStatus);
  //   }
  // }

  // const handleCreateClick = () => {
    // let item = itemsList.value.find(item => item.itemId == itemId);
    // console.log(item);
    // // return (<EditAcc item={item!} key={item!.itemId} hidden={false} />);
    // dispatch(setCurrentItem(item));
  //   navigate("/admin/items/create");
  // }

  // const handleSuspendClick = (itemId: number) => {
    // console.log(item);
    // return (<EditAcc item={item!} key={item!.itemId} hidden={false} />);
    // dispatch(setCurrentItem(item));
    // navigate("/admin/items/edit");
    // deleteItemsetCurrentItemService(itemId.toString()).then((res) => {
    //   console.log(res);
    // })
  // }

  // const handleFilterClick = (status: ItemStatus[], filter: any) => {
  //   console.log(filter);
  //   console.log(statusFilter);

  //   if (filter.toString() != statusFilter) {
  //     url.searchParams.delete("search");
  //     window.history.replaceState(null, "", url.toString());
  //     search = null;

  //     if (filter == "all") {
  //       fetchItems(0);
  //     } else {
  //       fetchItems(0, status[0]);
  //     }
  //   }

  //   // let filteredList = itemsList.value.filter(x => status.includes(x.status));
  //   // console.log(filteredList);
  //   // dispatch(setCurrentPageList(filteredList));
  //   setStatusFilter(filter);
  // }

  // const handleStatusFilterSelect = (...event: any) => {
  //   console.log(event);
  //   if (event[0] === "All") {
  //     setSelectedStatus("");
  //   } else {
  //     setSelectedStatus(event[0]);
  //   }
  // }
  
  const handleFilterClick = (status: string) => {
    console.log(status);
    if (status === "") {
      setItemPromise(getItems({ page: Number.parseInt(pageNumber), size: Number.parseInt(pageSize), sort: sort , status: status}));
      setSelectedStatus("");
    } else {
      setItemPromise(getItems({ page: Number.parseInt(pageNumber), size: Number.parseInt(pageSize), sort: sort , status: status}));
      setSelectedStatus(status);
    }
  }

  useEffect(() => { }, [itemsList]);

  useEffect(() => {
    if(Number.parseInt(pageNumber) >= 1)
    setItemPromise(getItems({ page: Number.parseInt(pageNumber), size: Number.parseInt(pageSize), sort: sort , status: seletedStatus}));
  }, [pageSize, pageNumber, sort])

  useEffect(() => {
    // fetchItems(itemsList.currentPageNumber);
    setStatusFilter("all");
  }, []);

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Tabs defaultValue="all" >
        <div className="flex items-center justify-center">
          {/* <TabsList>
            <TabsTrigger onClick={() => handleFilterClick([ItemStatus.IN_AUCTION, ItemStatus.QUEUE, ItemStatus.UNSOLD, ItemStatus.SOLD, ItemStatus.VALUATING], "all")} value="all">All</TabsTrigger>
            <TabsTrigger onClick={() => handleFilterClick([ItemStatus.IN_AUCTION], ItemStatus.IN_AUCTION)} value={ItemStatus.IN_AUCTION}>IN_AUCTION</TabsTrigger>
            <TabsTrigger onClick={() => handleFilterClick([ItemStatus.QUEUE], ItemStatus.QUEUE)} value={ItemStatus.QUEUE}>QUEUE</TabsTrigger>
            <TabsTrigger onClick={() => handleFilterClick([ItemStatus.UNSOLD], ItemStatus.UNSOLD)} value={ItemStatus.UNSOLD}>UNSOLD</TabsTrigger>
            <TabsTrigger onClick={() => handleFilterClick([ItemStatus.SOLD], ItemStatus.SOLD)} value={ItemStatus.SOLD}>SOLD</TabsTrigger>
            <TabsTrigger onClick={() => handleFilterClick([ItemStatus.VALUATING], ItemStatus.VALUATING)} value={ItemStatus.VALUATING}>VALUATING</TabsTrigger>
          </TabsList> */}
          {/* <div className="ml-auto flex items-center gap-2">
            <Button size="sm" className="h-8 gap-1" onClick={() => { handleCreateClick() }}>
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Item
              </span>
            </Button>
          </div> */}
        </div>
        <TabsContent value="all" className="max-w-screen">
          {/* {isLoading ? <LoadingAnimation />
            :  */}
            <Card  className="max-w-screen-2xl">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  Items
                  {/* <div className="w-full basis-1/2">
                    <PagingIndexes pageNumber={itemsList.currentPageNumber ? itemsList.currentPageNumber : 0} totalPages={itemsList.totalPages} pageSelectCallback={handlePageSelect}></PagingIndexes>
                  </div> */}
                </CardTitle>
                <CardDescription>
                  Manage items and view their details.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* <Table>
                  <TableHeader>
                    <TableRow> */}
                      {/* <TableHead>Id</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="md:table-cell">
                        Price
                      </TableHead>
                      <TableHead className="md:table-cell">
                        Status
                      </TableHead>
                      <TableHead className="md:table-cell">
                        Description
                      </TableHead> */}
                      {/* <TableHead className="md:table-cell">
                      Status
                    </TableHead> */}
                      {/* <TableHead className="md:table-cell">
                                                    Created at
                                                </TableHead> */}
                      {/* <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody> */}
                    {!itemsList
                      ? <LoadingAnimation />
                      : itemsList.currentPageList.map((item) => (
                        <TableRow key={item.itemId}>
                          <TableCell className="font-medium">
                            {item.itemId}
                          </TableCell>
                          {/* <TableCell>
                                                    <Badge variant="outline">Draft</Badge>
                                                </TableCell> */}
                          <TableCell className="md:table-cell">
                            {item.name}
                          </TableCell>
                          <TableCell className="md:table-cell">
                            {currency.format({ amount: item.reservePrice })}
                          </TableCell>
                          <TableCell className="md:table-cell">
                            {item.status}
                          </TableCell>
                          <TableCell className="md:table-cell">
                            <div dangerouslySetInnerHTML={{ __html: item.description }}></div>


                          </TableCell>
                          <TableCell className="md:table-cell">
                            {/* {item.status == ItemsetCurrentItemStatus.ACTIVE ? 
                        <Badge variant="default" className="bg-green-500">{ItemsetCurrentItemStatus[item.status]}</Badge> : 
                        <Badge variant="destructive">{ItemsetCurrentItemStatus[item.status]}</Badge>} */}
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
                                <DropdownMenuItem onClick={() => { handleEditClick(item.itemId) }}>Edit</DropdownMenuItem>

                                {/* <DropdownMenuItem onClick={() => { handleSuspendClick(item.itemId) }}>Suspend</DropdownMenuItem> */}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>

                      ))}
                  {/* </TableBody>
                </Table> */}
                <Suspense
                  fallback={
                    <DataTableSkeleton
                      columnCount={5}
                      searchableColumnCount={1}
                      filterableColumnCount={2}
                      cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
                      shrinkZero
                    />
                  }
                >
                  {/**
           * Passing promises and consuming them using React.use for triggering the suspense fallback.
           * @see https://react.dev/reference/react/use
           */}
                  {/* <Select onValueChange={handleStatusFilterSelect} >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Status</SelectLabel>
                        <SelectItem value="All" key={0}>All</SelectItem>
                        {Object.values(ItemStatus).map((status) => (
                          <SelectItem value={status}>{status}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select> */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 gap-1">
                        <ListFilter className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                          Status
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuLabel>Status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem className='w-9/12' checked={seletedStatus == ''} onClick={() => handleFilterClick('')}>
                        All
                      </DropdownMenuCheckboxItem>


                      {Object.values(ItemStatus).map((state) => (
                        <div className="flex m-1 items-center justify-between" key={state} >
                          <DropdownMenuCheckboxItem className='w-9/12' checked={seletedStatus == state} onClick={() => handleFilterClick(state)} >{state}</DropdownMenuCheckboxItem>
                        </div>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <ItemsTable itemPromise={itemPromise} />
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
      {/* {itemsList.value.map((item) => (
        <EditAcc item={item} key={item.itemId} hidden={true} />
      ))} */}
    </main >
  );
}
