import {useEffect, useState} from 'react';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {getItems} from '@/services/ItemService';
import PagingIndexes from '@/components/pagination/PagingIndexes';
import {useAppDispatch, useAppSelector} from '@/redux/hooks';
import {Link, useSearchParams} from 'react-router-dom';
import {ItemCategory} from '@/models/newModel/itemCategory';
import {setCurrentPageList, setCurrentPageNumber} from '@/redux/reducers/Items';
import {getAllItemCategories} from '@/services/ItemCategoryService';
import {
  ArrowDownUp,
  CircleDollarSign,
  ListFilter,
  SearchIcon
} from 'lucide-react';
import {ItemStatus} from '@/models/Item';
import {toast} from 'sonner';
import {useCurrency} from '@/CurrencyProvider';
import {Card, CardContent, CardHeader} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';
import {showErrorToast} from "@/lib/handle-error.ts";
import {getEnumValue, parseIntOrUndefined} from "@/lib/utils.ts";
import {useForm} from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from "@/components/ui/form.tsx";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {useDebouncedCallback} from "use-debounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger
} from "@/components/ui/select.tsx";

type FormData = {
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: string;
};

export function ItemList() {
  const [categories, setCategories] = useState<ItemCategory[]>([]);
  useEffect(() => {
    getAllItemCategories(0, 50)
      .then((res) => {
        setCategories(res.data.content);
      })
      .catch((e) => {
        console.error(e);
        showErrorToast(e);
      });
  }, []);

  //////////////////////////////////////////////////////////

  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const itemsList: any = useAppSelector((state) => state.items);
  const dispatch = useAppDispatch();
  const currency = useCurrency();

  const fetchItems = useDebouncedCallback(
    () => {
      setIsLoading(true);
      const query = {
        status: getEnumValue(ItemStatus, searchParams.get('status')) as ItemStatus,
        categoryId: parseIntOrUndefined(searchParams.get('categoryId')),
        search: searchParams.get('search'),
        minPrice: parseIntOrUndefined(searchParams.get('minPrice')),
        maxPrice: parseIntOrUndefined(searchParams.get('maxPrice')),
        page: parseIntOrUndefined(searchParams.get('page')),
        size: 16,
        sort: searchParams.get('sort') || 'itemId,desc',
      };
      toast.promise(getItems(query), {
        loading: 'Loading items...',
        success: (res) => {
          dispatch(setCurrentPageList(res.data.content));
          let paging: any = {
            pageNumber: res.data.number,
            totalPages: res.data.totalPages,
          };
          dispatch(setCurrentPageNumber(paging));
          setIsLoading(false);
          return 'Items loaded successfully!';
        },
        error: (err) => {
          console.error(err);
          setIsLoading(false);
          return 'Failed to load items';
        },
      });
    }, 1000
  );

  useEffect(() => {
    fetchItems();
  }, [searchParams]);

  //////////////////////////////////////////////////////////

  const status = getEnumValue(ItemStatus, searchParams.get('status')) as ItemStatus;
  const categoryId = searchParams.get('categoryId');
  const form = useForm<FormData>({
    defaultValues: {
      minPrice: parseIntOrUndefined(searchParams.get('minPrice')),
      maxPrice: parseIntOrUndefined(searchParams.get('maxPrice')),
      search: searchParams.get('search'),
      sort: searchParams.get('sort'),
    },
  });
  const formValues = form.watch();

  function setParam(key: string, value: any | undefined | null) {
    if (String(value).length === 0) value = undefined;
    if ((!searchParams.has(key) && (value === undefined || value === null)) ||
      (searchParams.has(key) && value === searchParams.get(key))) {
      return;
    }
    if (value) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
    setSearchParams(searchParams, {replace: true});
  }

  useEffect(() => {
    const handleFieldChange = () => {
      setParam('minPrice', formValues.minPrice > 0 ? formValues.minPrice.toString() : undefined);
      setParam('maxPrice', formValues.maxPrice > 0 ? formValues.maxPrice.toString() : undefined);
      setParam('search', formValues.search);
      setParam('sort', formValues.sort);
    };
    handleFieldChange();
  }, [formValues]);

  const handlePageSelect = (page: number) => {
    setParam('page', page + 1);
  };

  return (
    <>
      <div className="container mx-auto py-8">
        <div
          className="flex flex-col xl:flex-row xl:justify-between xl:items-center gap-6 mb-6">
          <h1 className="text-4xl font-bold">Jewelry</h1>
          <div className="flex items-center gap-4">
            <div className="flex gap-2 flex-wrap xl:flex-nowrap">
              <Form {...form}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <ListFilter className="mr-2 size-4"/>
                      <span
                        className="sr-only sm:not-sr-only sm:whitespace-nowrap">Status</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuLabel>Status</DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuCheckboxItem
                      checked={status === undefined}
                      onClick={() => setParam('status', undefined)}
                    >All</DropdownMenuCheckboxItem>
                    {Object.keys(ItemStatus)
                      .filter(s => s !== ItemStatus.REMOVED)
                      .map((s) => (
                        <DropdownMenuCheckboxItem
                          checked={status === s}
                          onClick={() => setParam('status', s)}
                        >{s}</DropdownMenuCheckboxItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <ListFilter className="mr-2 size-4"/>
                      <span
                        className="sr-only sm:not-sr-only sm:whitespace-nowrap">Category</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuLabel>Category</DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuCheckboxItem
                      checked={categoryId === undefined}
                      onClick={() => setParam('categoryId', undefined)}
                    >All</DropdownMenuCheckboxItem>
                    {categories.map((ctg) => (
                      <DropdownMenuCheckboxItem
                        checked={categoryId === ctg.itemCategoryId.toString()}
                        onClick={() => setParam('categoryId', ctg.itemCategoryId)}
                      >{ctg.name}</DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <CircleDollarSign className="mr-2 size-4"/>
                      <span
                        className="sr-only sm:not-sr-only sm:whitespace-nowrap">Reserve Price</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Price Range</h4>
                    </div>
                    <div className="flex flex-col gap-2 mt-3">
                      <FormField
                        control={form.control}
                        name="minPrice"
                        render={({field}) => (
                          <FormItem
                            className="flex justify-center items-center gap-2">
                            <FormLabel>Min</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} className="h-9 focus-visible:[box-shadow:none]" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="maxPrice"
                        render={({field}) => (
                          <FormItem
                            className="flex justify-center items-center gap-2">
                            <FormLabel>Max</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} className="h-9 focus-visible:[box-shadow:none]" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                <FormField
                  control={form.control}
                  name="search"
                  render={({field}) => (
                    <div className="w-full relative">
                      <Input {...field}
                             className="px-8 h-9 focus-visible:[box-shadow:none]"/>
                      <SearchIcon
                        className="absolute left-1.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 peer-focus:text-gray-900"/>
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sort"
                  render={({field}) => (
                    <Select onValueChange={field.onChange}
                            defaultValue={field.value}>
                      <SelectTrigger className="w-[100px] h-9">
                        <ArrowDownUp className="text-gray-500 h-4 w-4"/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reservePrice,asc">Price: Low to
                          High</SelectItem>
                        <SelectItem value="reservePrice,desc">Price: High to
                          Low</SelectItem>
                        <SelectItem value="name,asc">Name:
                          Ascending</SelectItem>
                        <SelectItem value="name,desc">Name:
                          Descending</SelectItem>
                        <SelectItem value="createDate,desc">Newest
                          Items</SelectItem>
                        <SelectItem value="createDate,asc">Oldest
                          Items</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </Form>
            </div>
          </div>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
          {isLoading ? (
            Array.from({length: 8}).map((_, index) => (
              <Card key={index}
                    className="bg-background rounded-lg overflow-hidden shadow-lg hover:cursor-pointer">
                <CardHeader>
                  <Skeleton className="rounded-t-lg object-cover w-full h-56"/>
                </CardHeader>
                <CardContent className="p-4 flex flex-col gap-2">
                  <h3 className="text-sm font-bold h-6 mb-6">Loading...</h3>
                  <div className="flex justify-between items-center h-6">
                    <div className="text-primary font-bold text-lg">Loading...
                    </div>
                    <div className="text-muted-foreground text-sm">Loading...
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : itemsList.currentPageList.length > 0 ? (
            itemsList.currentPageList.map((item) => {
              return (
                <Card
                  key={item.itemId}
                  className="bg-background rounded-lg overflow-hidden shadow-lg hover:cursor-pointer"
                >
                  <div className="group relative">
                    <CardHeader>
                      <img
                        src={item.attachments && item.attachments.length > 0 ? item.attachments[0].link : 'https://placehold.co/400'}
                        width={300}
                        height={200}
                        alt="Auction Item"
                        loading="lazy"
                        className="rounded-t-lg object-cover w-full "
                      />
                    </CardHeader>
                    <div
                      className="rounded-t-lg  absolute h-full w-full -bottom-0 bg-black/20 flex items-center justify-center group-hover:bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-500"
                    >
                      <Button size="sm" asChild>
                        <Link to={`/item/${item.itemId}`}
                              target="_blank">View item</Link>
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4 flex flex-col gap-2 ">
                    <h3 className="text-sm font-bold h-6 mb-6">{item.name}</h3>
                    <div className="flex justify-between items-center h-6">
                      <div
                        className="text-primary font-bold text-lg">{currency.format(item.reservePrice)}</div>
                      <div
                        className="text-muted-foreground text-sm">{item.category.name}</div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="grid-cols-4 ">
              <h1 className="text-2xl font-bold">No items found</h1>
            </div>
          )}
        </div>

        <div className="flex justify-center mt-8">
          <PagingIndexes
            className="basis-1/2"
            pageNumber={itemsList.currentPageNumber || 0}
            totalPages={itemsList.totalPages}
            pageSelectCallback={handlePageSelect}
          ></PagingIndexes>
        </div>
      </div>
    </>
  );
}
