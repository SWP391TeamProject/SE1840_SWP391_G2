import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ItemStatus } from "@/constants/enums";
import { Item } from "@/models/Item";
import { useAppDispatch } from "@/redux/hooks";
import { setCurrentItem } from "@/redux/reducers/Items";
import { getItemsByStatus } from "@/services/ItemService";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";


const ItemCard = ({ item }: { item: Item }) => {
  return (
    <Card className="w-[300px] h-fit aspect-square">
      <CardHeader>
        <img
          alt="Auction Item"
          className="rounded-t-lg object-cover"
          height="225"
          src="/placeholder.svg"
          style={{
            aspectRatio: "400/225",
            objectFit: "cover",
          }}
        />
      </CardHeader>
      <CardTitle>{item.title}</CardTitle>
      <CardContent>
        <p>{item.description}</p>
      </CardContent>
    </Card>
  );
};

export default function AddAuctionItems() {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const [items, setItems] = useState<Item[]>();
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);

  useEffect(() => {
    if (id) {
      getItemsByStatus(ItemStatus.QUEUE, 0, 10).then((res) => {
        console.log(res);
        dispatch(setCurrentItem(res.data.content));
        setItems(res.data.content);
      });
    }
  }, [id]);

  useEffect(() => {
    console.log(items);
  }, [items]);

  return (
    <div className="">
      <div className="flex w-full flex-col justify-between gap-y-2 p-3">
        <section className="w-full border h-40 flex justify-start items-center p-3 mb-3 gap-2">
          <Card className="aspect-square h-fit w-40 p-3">
            <CardTitle>Total Valuation</CardTitle>
            <CardDescription>
              <p>total items valuation</p>
            </CardDescription>
            <CardContent>
              <p className="font-bold">8000</p>
            </CardContent>
          </Card>

          <Card className="aspect-square h-fit w-40 p-3">
            <CardTitle>Number Of Items</CardTitle>
            <CardDescription>
              <p>total number of items in this auctions</p>
            </CardDescription>
            <CardContent>
              <p className="font-bold">69</p>
            </CardContent>
          </Card>
        </section>
        <ScrollArea className="w-1/2 h-96 border rounded-xl">
          <Table className="border rounded-xl">
            <TableCaption>A list of items.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Buy in price</TableHead>
                <TableHead>Reserved Price</TableHead>

                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items?.map((item) => (
                <TableRow key={item.itemId}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.buyInPrice}</TableCell>
                  <TableCell>{item.reservePrice}</TableCell>

                  <TableCell className="flex justify-center">
                    <Button
                      variant={"outline"}
                      size={"sm"}
                      onClick={() => {
                        setSelectedItems([...selectedItems, item]);
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
}
