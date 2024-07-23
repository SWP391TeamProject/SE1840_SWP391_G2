/**
 * v0 by Vercel.
 * @see https://v0.dev/t/TMzlSp5CzlB
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {Link, useParams} from 'react-router-dom';
import { getItemsByStatus } from '@/services/ItemService';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCurrentAuctionSession } from '@/redux/reducers/AuctionSession';
import { assignItem, fetchAuctionSessionById, removeAuctionItem } from '@/services/AuctionSessionService';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Item, ItemStatus } from '@/models/Item';
import { toast } from 'sonner';
import { getErrorMessage, showErrorToast } from '@/lib/handle-error';
import { ConfirmationButton } from '@/components/confirmation/confirmation-button';
import { useCurrency } from '@/CurrencyProvider.tsx';
import { Page } from '@/models/Page';

export default function AssignAuctionItem() {
  const auction = useAppSelector((state) => state.auctionSessions.currentAuctionSession);
  const [availableItems, setAvailableItems] = useState<Page<Item>>();
  const param = useParams<{ id: string }>();
  const auctionId = parseInt(param.id);
  const dispatch = useAppDispatch();
  const [selectedItems, setSelectedItems] = useState([]);
  const [existingItems, setExistingItems] = useState([]);
  const currency = useCurrency();

  const isRemovable = useCallback((itemId: number) => {
    return (
      auction?.participantCount === 0
      //  &&
      // !existingItems.includes((e) => {
      //   return e.itemId;
      // })
    );
  }, []);

  useEffect(() => {
    getItemsByStatus(ItemStatus.QUEUE, 0, 100)
      .then((res) => {
        setAvailableItems(res?.data.content);
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });

    if (!auction) {
      fetchAuctionSessionById(auctionId).then((res) => {
        console.log(res);
        dispatch(setCurrentAuctionSession(res));
        let tempArr = res.auctionItems.map((item) => {
          return item.itemDTO;
        });
        console.log(tempArr);
        setSelectedItems(tempArr);
        setExistingItems(tempArr);
      });
    } else {
      setSelectedItems(
        auction.auctionItems.map((item) => {
          return item?.itemDTO;
        })
      );
      setExistingItems(
        auction.auctionItems.map((item) => {
          return item?.itemDTO;
        })
      );
    }
  }, []);

  const handleAssign = (item: any) => {
    if (!selectedItems.find((i) => i.itemId === item.itemId)) {
      setSelectedItems([...selectedItems, item]);
      setAvailableItems(availableItems.filter((i) => i.itemId !== item.itemId));
    }
  };

  const handleUnassign = (item: any) => {
    let existingItem = existingItems.find((i) => i.itemId == item.itemId);
    if (existingItem) {
      let auctionItem = auction.auctionItems.find((i) => i.itemDTO.itemId == existingItem.itemId);
      console.log(auctionItem);
      removeAuctionItem(auctionItem?.id)
        .then((res) => {
          setExistingItems(existingItems.filter((i) => i.itemId !== item.itemId));
        })
        .catch((err) => {
          showErrorToast(err);
        });
    }
    // else {
    setSelectedItems(selectedItems.filter((i) => i.itemId !== item.itemId));
    let tempList = [...availableItems, item];
    tempList.sort((a, b) => (a.itemId < b.itemId ? -1 : 1));
    setAvailableItems(tempList);
    toast.success('Item Unassigned', {});
    // }
  };

  const handleSave = () => {
    var tempList: any[] = [];
    // selectedItems.forEach((item) => {
    //   tempList.push(item.itemId);
    // });
    tempList = selectedItems.concat(
      existingItems.filter((item2) => !selectedItems.some((item1) => item1.itemId == item2.itemId))
    );

    toast.promise(assignItem(auction?.auctionSessionId, tempList), {
      loading: 'Saving items...',
      success: (res) => {
        console.log(res);
        // toast.success('Items assigned successfully.');
        return 'Items assigned successfully.';
      },
      error: (err) => {
        console.error(err);
     
        return getErrorMessage(err);
      },
    });

    // assignItem(auction?.auctionSessionId, tempList)
    //   .then((res) => {
    //     console.log(res);
    //     toast.success('Items assigned successfully.');
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //     showErrorToast(err);
    //   });
  };
  const handleClear = () => {
    let tempList = selectedItems.concat(availableItems).sort((a, b) => (a.itemId < b.itemId ? -1 : 1));
    setAvailableItems(tempList);
    setSelectedItems([]);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 md:p-6">
        <div className="flex justify-between items-center md:col-span-2">
          <h2 className="text-2xl font-bold">Assign Items</h2>
          <div className="flex space-x-2">
            <ConfirmationButton
              message={`New selected items will be assigned to this auction session.`}
              title={'Are you sure to save selected items?'}
              label={'Save Selected'}
              description={''}
              onSuccess={() => handleSave()}
              variant="outline"
              disabled={selectedItems.length == 0}
            >
              Save Selected
            </ConfirmationButton>
          </div>
        </div>
        <div className="border rounded-lg shadow-sm">
          <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 border-b rounded-t-lg">
            <h2 className="text-lg font-medium">Available Items</h2>
          </div>
          <div className="overflow-auto max-h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Id</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="w-[100px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {availableItems &&
                  availableItems?.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.itemId}</TableCell>
                      <TableCell className="font-medium">
                        <Link to={`/admin/items/${item.itemId}`} target="_blank">
                          {item.name}
                        </Link>
                      </TableCell>
                      <TableCell className="font-medium">{currency.format(item.reservePrice)}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => handleAssign(item)}>
                          Select
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="border rounded-lg shadow-sm">
          <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 border-b rounded-t-lg">
            <h2 className="text-lg font-medium">Selected Items</h2>
          </div>
          <div className="overflow-auto max-h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Id</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  {/* <TableHead>Description</TableHead> */}
                  <TableHead className="w-[100px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedItems &&
                  selectedItems.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item?.itemId}</TableCell>
                      <TableCell className="font-medium">
                        <Link to={`/admin/items/${item.itemId}`} target="_blank">
                          {item.name}
                        </Link>
                      </TableCell>
                      <TableCell className="font-medium">{currency.format(item.reservePrice)}</TableCell>
                      <TableCell>
                        {auction.participantCount === 0 && (
                          <ConfirmationButton
                            message={`Item ${item.itemId} will be removed from this auction session.`}
                            title={'Are you sure to unassign this item?'}
                            label={'Remove'}
                            description={''}
                            onSuccess={() => handleUnassign(item)}
                            variant="outline"
                          >
                            Remove
                          </ConfirmationButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
