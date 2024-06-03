import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, Drawer, DrawerClose } from "@/components/ui/drawer"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ConsignmentStatus } from "@/constants/enums"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { updateConsignmentService } from "@/services/ConsignmentService"
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import { BarChart, Minus, Plus } from "lucide-react"
import { useEffect, useState } from "react"

export default function UpdateConsignmentStatus({ id }: { id: number }) {
    const dispatch = useAppDispatch();
    const consignmentList = useAppSelector((state) => state.consignments.currentPageList);
    const [status, setStatus] = useState<ConsignmentStatus>();
    useEffect(() => {
        console.log(consignmentList);
        console.log("here is the id");
        const foundConsignment = consignmentList.find((consignment) => consignment.consignmentId === id);
        if (foundConsignment) {
            setStatus(foundConsignment.status);
        }
    }, [])

    const handleSelect = (newStatus: ConsignmentStatus) => {
        updateConsignmentService(id, { status: newStatus });

        setStatus(newStatus);
    };

    return (
        <Drawer >
            <DrawerTrigger asChild>
                <DropdownMenuItem className="hover:cursor-pointer hover:bg-gray-100 p-3" onSelect={(e) => {
                    // setStatus(consignmentList.status)
                    e.preventDefault()
                }}>Create Initial Evaluation</DropdownMenuItem>
            </DrawerTrigger>
            <DrawerContent className="h-96"> 
                <div className="w-full h-full gap-2 flex flex-row justify-center items-center ">
                    <Label>Status</Label>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">{status}</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onSelect={() => handleSelect(ConsignmentStatus.FINISHED)}>FINISHED</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleSelect(ConsignmentStatus.IN_FINAL_EVALUATION)}>IN_FINAL_EVALUATION</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleSelect(ConsignmentStatus.IN_INITIAL_EVALUATION)}>IN_INITIAL_EVALUATION</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleSelect(ConsignmentStatus.SENDING)}>SENDING</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleSelect(ConsignmentStatus.TERMINATED)}>TERMINATED</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleSelect(ConsignmentStatus.WAITING_STAFF)}>WAITING_STAFF</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <DrawerFooter>
                    <Button>Submit</Button>
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer >
    )
}
