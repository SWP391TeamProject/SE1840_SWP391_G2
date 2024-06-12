/**
 * v0 by Vercel.
 * @see https://v0.dev/t/TMzlSp5CzlB
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Link, useParams } from "react-router-dom"
import { getItemsByStatus } from "@/services/ItemService"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { setCurrentAuctionSession } from "@/redux/reducers/AuctionSession"
import { set } from "date-fns"
import { fetchAllAuctionSessions, fetchAuctionSessionById } from "@/services/AuctionSessionService"
import ItemCard from "./AssignAuctionItems/ItemCard"

export default function Component() {
  const [session, setSession] = useState({
    id: "AUC-001",
    name: "Summer Auction 2023",
    date: "2023-06-30",
    time: "7:00 PM",
  })
  const auction = useAppSelector((state) => state.auctionSessions.currentAuctionSession)
  const [availableItems, setAvailableItems] = useState()
  const param = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const [selectedItems, setSelectedItems] = useState([])

  useEffect(() => {
    console.log('hello')
    getItemsByStatus("QUEUE", 0, 10).then((res) => {
      setAvailableItems(res?.data?.content)
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
  const handleAssign = (item) => {
    return () => {
      if (!selectedItems.find(i => i.itemId === item.itemId)) {
        setSelectedItems([...selectedItems, item]);
        setAvailableItems(availableItems.filter(i => i.itemId !== item.itemId));
      }
    };
  }

  const handleUnassign = (item) => {
    return () => {
      setSelectedItems(selectedItems.filter(i => i.itemId !== item.itemId));
      setAvailableItems([...availableItems, item]);
    };
  }

  const handleSave = () => {
    console.log(selectedItems)
  }
  const handleClear = () => {
    setSelectedItems([])
    setAvailableItems(availableItems)
  }

  return (
    <>
      <div className="container bg-background text-foreground flex flex-row flex-wrap">
        <div className="w-full basis-1/2">
          control bar
          <Button onClick={handleClear} > clear</Button>
          <Button variant={"default"} onClick={handleSave}> save</Button>
        </div>
        <div className="w-full flex flex-row justify-center gap-3 items-center">
          <div className="h-full  basis-1/2  ">
            <h2 className="w-full">Available items</h2>
            {availableItems && availableItems?.map((item: any) => {
              return (
                <ItemCard key={item.id} item={item} handleAssign={handleAssign} />
              )
            })}

          </div>

          <div className="h-full  basis-1/2  ">
            {/* <h2 className="w-full h-fit w-fit">Available items</h2> */}
            <h2 className="w-full">Assigned items</h2>
            {selectedItems && selectedItems?.map((item: any) => {
              return (
                <ItemCard key={item.id} item={item} handleUnassign={handleUnassign} />
              )
            }
            )
            }
          </div>
        </div>
      </div>





    </>
  )
}