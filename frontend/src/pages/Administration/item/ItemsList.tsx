import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  PaginationPrevious,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
  PaginationContent,
  Pagination,
} from '@/components/ui/pagination';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
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
} from 'lucide-react';
import { Suspense, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EditAcc } from '../popup/EditAcc';
import { useLocation, useNavigate } from 'react-router-dom';
import { setCurrentItem, setCurrentPageList, setCurrentPageNumber, setItems } from '@/redux/reducers/Items';
import { getItemsByName, getItemsByStatus } from '@/services/ItemService';
import { ItemStatus } from '@/constants/enums';
import PagingIndexes from '@/components/pagination/PagingIndexes';
import { useCurrency } from '@/CurrencyProvider.tsx';
import LoadingAnimation from '@/components/loadingAnimation/LoadingAnimation';
import ItemsTable from './testserversideTable/item-table';
import { DataTableSkeleton } from '@/components/data-tables/data-tables-skeleton';
import { getItems } from './testserversideTable/item-apis';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ItemsList() {
  const itemsList = useAppSelector((state) => state.items);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('');
  const [seletedStatus, setSelectedStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const url = new URL(window.location.href);
  let search = url.searchParams.get('search');
  let pageNumber = url.searchParams.get('page');
  let sort = url.searchParams.get('sort');
  let pageSize = url.searchParams.get('per_page');
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
          totalPages: res.data.totalPages,
        };
        dispatch(setCurrentPageNumber(paging));
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const handleEditClick = (itemId: number) => {
    let item = itemsList.value.find((item) => item.itemId == itemId);
    console.log(item);
    // return (<EditAcc item={item!} key={item!.itemId} hidden={false} />);
    dispatch(setCurrentItem(item));
    navigate(`/admin/items/${itemId}`);
  };

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
    if (status === '') {
      setItemPromise(
        getItems({ page: Number.parseInt(pageNumber), size: Number.parseInt(pageSize), sort: sort, status: status })
      );
      setSelectedStatus('');
    } else {
      setItemPromise(
        getItems({ page: Number.parseInt(pageNumber), size: Number.parseInt(pageSize), sort: sort, status: status })
      );
      setSelectedStatus(status);
    }
  };

  useEffect(() => {}, [itemsList]);

  useEffect(() => {
    if (Number.parseInt(pageNumber) >= 1)
      setItemPromise(
        getItems({
          page: Number.parseInt(pageNumber),
          size: Number.parseInt(pageSize),
          sort: sort,
          status: seletedStatus,
        })
      );
  }, [pageSize, pageNumber, sort]);

  useEffect(() => {
    // fetchItems(itemsList.currentPageNumber);
    setStatusFilter('all');
  }, []);

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Tabs defaultValue="all">
        <div className="flex items-center justify-center"></div>
        <TabsContent value="all" className="max-w-screen">
          <Card className="max-w-screen-2xl">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">Items</CardTitle>
              <CardDescription>Manage items and view their details.</CardDescription>
            </CardHeader>
            <CardContent>
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
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Status</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuLabel>Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      className="w-9/12"
                      checked={seletedStatus == ''}
                      onClick={() => handleFilterClick('')}
                    >
                      All
                    </DropdownMenuCheckboxItem>
                    {Object.values(ItemStatus).map((state) => (
                      <div className="flex m-1 items-center justify-between" key={state}>
                        <DropdownMenuCheckboxItem
                          className="w-9/12"
                          checked={seletedStatus == state}
                          onClick={() => handleFilterClick(state)}
                        >
                          {state}
                        </DropdownMenuCheckboxItem>
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
    </main>
  );
}
