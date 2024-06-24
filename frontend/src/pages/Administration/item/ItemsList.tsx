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
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EditAcc } from "../popup/EditAcc";
import { useLocation, useNavigate } from "react-router-dom";
import { setCurrentItem, setCurrentPageList, setCurrentPageNumber, setItems } from "@/redux/reducers/Items";
import { getItems, getItemsByName } from "@/services/ItemService";
import { ItemStatus } from "@/constants/enums";
import PagingIndexes from "@/components/pagination/PagingIndexes";
import {useCurrency} from "@/CurrencyProvider.tsx";

export default function ItemsList() {
  const itemsList = useAppSelector((state) => state.items);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");
  const url = new URL(window.location.href);
  let search = url.searchParams.get("search");
  const currency = useCurrency();

  const fetchItems = async (pageNumber: number) => {
    try {
      let res = await getItems(pageNumber, 5);
      if(search != null) {
        res = await getItemsByName(search, pageNumber, 5);
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
      }
    } catch (error) {
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

  const handlePageSelect = (pageNumber: number) => {
    fetchItems(pageNumber);
  }

  const handleCreateClick = () => {
    // let item = itemsList.value.find(item => item.itemId == itemId);
    // console.log(item);
    // // return (<EditAcc item={item!} key={item!.itemId} hidden={false} />);
    // dispatch(setCurrentItem(item));
    navigate("/admin/items/create");
  }

  const handleSuspendClick = (itemId: number) => {
    // console.log(item);
    // return (<EditAcc item={item!} key={item!.itemId} hidden={false} />);
    // dispatch(setCurrentItem(item));
    // navigate("/admin/items/edit");
    // deleteItemsetCurrentItemService(itemId.toString()).then((res) => {
    //   console.log(res);
    // })
  }

  const handleFilterClick = (status: ItemStatus[], filter: string) => {

    url.searchParams.delete("search");
    window.history.replaceState(null, "", url.toString());
    search = null;

    // let filteredList = itemsList.value.filter(x => status.includes(x.status));
    // console.log(filteredList);
    // dispatch(setCurrentPageList(filteredList));
    setStatusFilter(filter);
  }

  useEffect(() => { }, [itemsList]);

  useEffect(() => {
    fetchItems(itemsList.currentPageNumber);
    setStatusFilter("all");
  }, []);

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger onClick={() => handleFilterClick([ItemStatus.IN_AUCTION, ItemStatus.QUEUE, ItemStatus.UNSOLD, ItemStatus.SOLD, ItemStatus.VALUATING], "all")} value="all">All</TabsTrigger>
            <TabsTrigger onClick={() => handleFilterClick([ItemStatus.IN_AUCTION], "in_auction")} value="in_auction">IN_AUCTION</TabsTrigger>
            <TabsTrigger onClick={() => handleFilterClick([ItemStatus.QUEUE], "queue")} value="queue">QUEUE</TabsTrigger>
            <TabsTrigger onClick={() => handleFilterClick([ItemStatus.UNSOLD], "unsold")} value="unsold">UNSOLD</TabsTrigger>
            <TabsTrigger onClick={() => handleFilterClick([ItemStatus.SOLD], "sold")} value="sold">SOLD</TabsTrigger>
            <TabsTrigger onClick={() => handleFilterClick([ItemStatus.VALUATING], "valuating")} value="valuating">VALUATING</TabsTrigger>
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
                Add ItemsetCurrentItem
              </span>
            </Button>
          </div>
        </div>
        <TabsContent value={statusFilter}>
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Items
                <div className="w-full basis-1/2">
                  <PagingIndexes pageNumber={itemsList.currentPageNumber ? itemsList.currentPageNumber : 0} totalPages={itemsList.totalPages} pageSelectCallback={handlePageSelect}></PagingIndexes>
                </div>
              </CardTitle>
              <CardDescription>
                Manage items and view their details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Id</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="md:table-cell">
                      Price
                    </TableHead>
                    <TableHead className="md:table-cell">
                      Status
                    </TableHead>
                    <TableHead className="md:table-cell">
                      Description
                    </TableHead>
                    {/* <TableHead className="md:table-cell">
                      Status
                    </TableHead> */}
                    {/* <TableHead className="md:table-cell">
                                                    Created at
                                                </TableHead> */}
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itemsList.currentPageList.map((item) => (
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
                        {currency.format({amount: item.reservePrice})}
                      </TableCell>
                      <TableCell className="md:table-cell">
                        {item.status}
                      </TableCell>
                      <TableCell className="md:table-cell">
                          <div dangerouslySetInnerHTML={{__html: item.description}}></div>
                            
                       
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
      {/* {itemsList.value.map((item) => (
        <EditAcc item={item} key={item.itemId} hidden={true} />
      ))} */}
    </main >
  );
}
