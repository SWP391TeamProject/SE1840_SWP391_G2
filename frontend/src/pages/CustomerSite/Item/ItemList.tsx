import { useEffect, useState } from "react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { getItems, getItemsByCategoryId, getItemsByName } from "@/services/ItemService"
import PagingIndexes from "@/components/pagination/PagingIndexes"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { useLocation, useNavigate } from "react-router-dom"
import { ItemCategory } from "@/models/newModel/itemCategory"
import { setCurrentPageList, setCurrentPageNumber } from "@/redux/reducers/Items"
import { getAllItemCategories } from "@/services/ItemCategoryService"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AuctionSession } from "@/models/newModel/auctionSession"
import { fetchActiveAuctionSessions } from "@/services/AuctionSessionService"
import LoadingAnimation from "@/components/loadingAnimation/LoadingAnimation"
import { Search } from "lucide-react"
import { Item, ItemStatus } from "@/models/Item"
import { Card } from "@/components/ui/card"

export function ItemList() {
  const itemsList: any = useAppSelector((state) => state.items);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [itemCategoryFilter, setItemCategoryFilter] = useState<ItemCategory>(null);
  const url = new URL(window.location.href);
  let search = url.searchParams.get("search");
  const [sortBy, setSortBy] = useState("reservePrice");
  const [sortOrder, setSortOrder] = useState("asc");
  const [itemCategories, setItemCategories] = useState<ItemCategory[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000000);
  const [auctions, setAuctions] = useState<AuctionSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();


  const fetchItems = async (pageNumber: number, itemCategory?: ItemCategory, minPrice?: number, maxPrice?: number, sortBy?: string, sortOrder?: string) => {
    try {
      console.log(itemCategory);
      let res;
      if (search && search?.length > 0) {
        console.log(itemCategory);
        res = await getItemsByName(pageNumber, 12, search, sortBy, sortOrder, ItemStatus.IN_AUCTION);
      } else if (itemCategory != undefined && itemCategory != null && itemCategory.itemCategoryId != null) {
        console.log(itemCategory);
        res = await getItemsByCategoryId(pageNumber, 12, itemCategory.itemCategoryId, minPrice, maxPrice, sortBy, sortOrder, ItemStatus.IN_AUCTION);
      } else {
        console.log(itemCategory);
        res = await getItems(pageNumber, 12, minPrice, maxPrice, sortBy, sortOrder, ItemStatus.IN_AUCTION);
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

  const handleSortChange = (key, order) => {
    setSortBy(key);
    setSortOrder(order);
    fetchItems(0, itemCategoryFilter, minPrice, maxPrice, key, order);
  }

  const handleFilterClick = (name: string) => {
    console.log(maxPrice);
    url.searchParams.delete("search");
    window.history.replaceState(null, "", url.toString());
    search = null;
    console.log(name);
    if (name == "all"||name==null) {
      fetchItems(0, null, minPrice, maxPrice);
      setItemCategoryFilter(null);
      setSortBy(null);
      setSortOrder(null);
    }
    else {
      let itemCategorys = itemCategories.filter((category) => category.name == name);
      console.log(itemCategorys);
      fetchItems(0, itemCategorys[0], minPrice, maxPrice);
      setItemCategoryFilter(itemCategorys[0]);
      setSortBy(null);
      setSortOrder(null);
    }

    // }
  }

  const handlePageSelect = (pageNumber: number) => {
    fetchItems(pageNumber, itemsList.filter, minPrice, maxPrice, sortBy, sortOrder);
  }

  const handleViewItemDetailsClick = async (item: Item, auctionId: number) => {
    console.log(item, auctionId);
    navigate(`/auctions/${auctionId}/${item.name}`, {
      state: {
        id: {
          auctionSessionId: auctionId,
          itemId: item.itemId
        },
        itemDTO: item,
      }
    });

  }

  useEffect(() => {
    setIsLoading(true);
    fetchActiveAuctionSessions().then((res) => {
      setAuctions(res?.data.content);
      setIsLoading(false);


    });
    getAllItemCategories(0, 50).then((res) => {
      setItemCategories(res.data.content);
    });
    if (location.state?.category) {
      console.log(location.state.category);
      fetchItems(0, location.state.category, minPrice, maxPrice).then(() => {
        setIsLoading(false);
      });
      setItemCategoryFilter(location.state.category);
    } else {
      console.log(itemsList.currentPageList.length);
      if (itemsList.currentPageList.length == 0) {
        fetchItems(itemsList.currentPageNumber);
      }
    }

  }, []);
  return (
    <>
      {isLoading === true ?
        <LoadingAnimation />
        :
        <div className="container mx-auto py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Jewelry Auction</h1>
            <div className="flex items-center gap-4">
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
              <Select onValueChange={(value) => handleSortChange(value.split(":")[0], value.split(":")[1])}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" defaultValue={sortBy} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reservePrice:asc">Price: Low to High</SelectItem>
                  <SelectItem value="reservePrice:desc">Price: High to Low</SelectItem>
                  <SelectItem value="name:asc">Name: Ascending</SelectItem>
                  <SelectItem value="name:desc">Name: Descending</SelectItem>
                  <SelectItem value="createDate:asc">Newest Items</SelectItem>

                </SelectContent>
              </Select>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="px-4 py-2 rounded-md">
                    Filters
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-4 w-[300px]">
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="minBid">From:</Label>
                      <Input
                        id="minBid"
                        type="number"
                        value={minPrice}
                        onChange={(event) => {
                          try {
                            setMinPrice(parseInt(event.target.value))
                          } catch (e) {
                            setMinPrice(0);
                          }
                        }}
                        onKeyUp={(event) => {
                          if (event.key == "Enter") { handleFilterClick(itemCategoryFilter?.name || null) }
                        }}
                        className="bg-background px-4 py-2 rounded-md"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxBid">To:</Label>
                      <Input
                        id="maxBid"
                        type="number"
                        value={maxPrice}
                        onChange={(event) => {
                          setMaxPrice(parseInt(event.target.value));
                          if (parseInt(event.target.value) < minPrice) {
                            setMinPrice(parseInt(event.target.value));
                          }
                          if (parseInt(event.target.value) <= 0) {
                            setMaxPrice(1000000000);
                          }

                        }}
                        onKeyUp={(event) => {
                          if (event.key == "Enter") { handleFilterClick(itemCategoryFilter?.name || null) }
                        }}
                        className="bg-background px-4 py-2 rounded-md"
                      />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <RadioGroup defaultValue={itemCategoryFilter?.name || "all"} onValueChange={(value) => { handleFilterClick(value) }}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="all" id="r1" />
                            <Label htmlFor="r1">All</Label>
                          </div>
                          {itemCategories.map((category) => (
                            <div className="flex items-center space-x-2" key={category.itemCategoryId}>
                              <RadioGroupItem value={category.name} id="r1" />
                              <Label htmlFor="r1">{category.name}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
            {itemsList.currentPageList.map((item) => (
              auctions.map((auction) => {
                if (auction.auctionItems.filter((auctionItem) => auctionItem.id.itemId == item.itemId).length > 0) {
                  return (
                    <Card key={item.itemId} className="bg-background rounded-lg overflow-hidden shadow-lg hover:cursor-pointer" >

                      <div className='group relative'>
                        <img
                          src={item.attachments[0].link}
                          width={300}
                          height={200}
                          alt="Auction Item"
                          className="rounded-t-lg object-cover w-full "
                        />
                        <div className="rounded-t-lg  absolute h-full w-full -bottom-0 bg-black/20 flex items-center justify-center group-hover:bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-500"
                          onClick={() => handleViewItemDetailsClick(item, auction.auctionSessionId)}
                        >
                          <Button >Detail</Button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-bold mb-2">{item.name}</h3>
                        <div className="text-muted-foreground mb-4 line-clamp-2" dangerouslySetInnerHTML={{ __html: item.description }}></div>
                        <div className="flex justify-between items-center ">

                          <div className="text-primary font-bold text-lg">${item.reservePrice.toLocaleString()}</div>
                          <div className="text-muted-foreground text-sm">{item.category.name}</div>
                        </div>
                      </div>
                    </Card>
                  )
                }
              }

              )
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <PagingIndexes className="basis-1/2" pageNumber={itemsList.currentPageNumber || 0} size={10} totalPages={itemsList.totalPages} pageSelectCallback={handlePageSelect}></PagingIndexes>
          </div>
        </div>}
    </>

  )
}
