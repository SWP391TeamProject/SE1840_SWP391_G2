/**
 * v0 by Vercel.
 * @see https://v0.dev/t/TMzlSp5CzlB
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useParams } from "react-router-dom"
import { getItemsByStatus } from "@/services/ItemService"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { setCurrentAuctionSession } from "@/redux/reducers/AuctionSession"
import { fetchAuctionSessionById } from "@/services/AuctionSessionService"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"

export default function AssignAuctionItem() {
 
  const auction = useAppSelector((state) => state.auctionSessions.currentAuctionSession)
  const [availableItems, setAvailableItems] = useState([])
  const param = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const [selectedItems, setSelectedItems] = useState([])
  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  useEffect(() => {
    console.log('hello')
    getItemsByStatus("QUEUE", 0, 10).then((res) => {
      setAvailableItems(res?.data?.content);
      console.log(res?.data?.content);
    }).catch((err) => {
      console.error(err)
    })

    if (!auction) {
      fetchAuctionSessionById(param.id).then((res) => {
        console.log(res)
        dispatch(setCurrentAuctionSession(res?.data))
      })
    }
  }, [])
  const handleAssign = (item: any) => {
    if (!selectedItems.find(i => i.itemId === item.itemId)) {
      setSelectedItems([...selectedItems, item]);
      setAvailableItems(availableItems.filter(i => i.itemId !== item.itemId));
    }
  }

  // useEffect(() => {
  //   console.log("here");
  // }, [selectedItems, availableItems])

  const handleUnassign = (item: any) => {
    setSelectedItems(selectedItems.filter(i => i.itemId !== item.itemId));
    let tempList = [...availableItems, item];
    tempList.sort((a, b) => (a.itemId < b.itemId ? -1 : 1));
    setAvailableItems(tempList);
  }

  const handleSave = () => {
    console.log(selectedItems)
  }
  const handleClear = () => {
    let tempList = selectedItems.concat(availableItems).sort((a, b) => (a.itemId < b.itemId ? -1 : 1));
    setAvailableItems(tempList);
    setSelectedItems([])
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 md:p-6">
        <div className="flex justify-between items-center md:col-span-2">
          <h2 className="text-2xl font-bold">Assign Items</h2>
          <div className="flex space-x-2">
            <Button variant="outline" disabled={selectedItems.length == 0} onClick={handleClear}>
              Clear Selected
            </Button>
            <Button disabled={selectedItems.length == 0} onClick={handleSave}>Save Selected</Button>
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
                  {/* <TableHead>Description</TableHead> */}
                  <TableHead className="w-[100px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {availableItems && availableItems.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.itemId}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="font-medium">{currencyFormatter.format(item.reservePrice)}</TableCell>
                    {/* <TableCell>{item.description}</TableCell> */}
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
                {selectedItems && selectedItems.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.itemId}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="font-medium">{currencyFormatter.format(item.reservePrice)}</TableCell>
                    {/* <TableCell>{item.description}</TableCell> */}
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => handleUnassign(item)}>
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  )
}