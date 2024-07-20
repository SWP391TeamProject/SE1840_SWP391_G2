import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import PagingIndexes from '@/components/pagination/PagingIndexes.tsx';
import { useAppDispatch, useAppSelector } from '@/redux/hooks.tsx';
import { getOwnedItems } from '@/services/ItemService.ts';
import { setCurrentPageList, setItems } from '@/redux/reducers/Inventory.ts';
import { Item } from '@/models/Item.ts';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const Inventory = () => {
  const inventoryList = useAppSelector((state) => state.inventory);
  const dispatch = useAppDispatch();

  const fetchInventory = async (page = 0, size = 9) => {
    try {
      const list = await getOwnedItems(page, size);
      if (list) {
        dispatch(setItems(list.data));
        dispatch(setCurrentPageList(list.data.content));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageSelect = (pageNumber: number) => {
    const inventoryPromise = fetchInventory(pageNumber);

    toast.promise(inventoryPromise, {
      loading: 'Loading...',
      success: <b>Inventory loaded!</b>,
      error: <b>Could not load inventory!</b>,
    });
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return (
    <>
      <Card className="w-full lg:w-3/4">
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
          <CardDescription>View all items you have owned</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-2 xl:grid-cols-3">
            {inventoryList.currentPageList.map((item: Item) => (
              <Card>
                <CardHeader>
                  <img
                    src={item.attachments[0]?.link ?? 'https://placehold.co/600x400'}
                    width={300}
                    height={200}
                    alt="Auction Item"
                    className="rounded-t-lg object-cover w-full "
                  />
                </CardHeader>
                <CardContent>
                  <Link to={`/item/${item.itemId}`} className="text-lg font-semibold">
                    {item.name}
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex justify-center w-full">
            <PagingIndexes
              pageNumber={inventoryList.currentPageNumber ? inventoryList.currentPageNumber : 0}
              totalPages={inventoryList.totalPages}
              pageSelectCallback={handlePageSelect}
            ></PagingIndexes>
          </div>
        </CardFooter>
      </Card>
    </>
  );
};
export default Inventory;
