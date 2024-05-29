import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Account } from '@/models/AccountModel'


export const EditAcc = ({account,hidden}:{account:Account,hidden:boolean}) => {
    const [isHidden, setIsHidden] = React.useState(hidden)

    

    return (
        <Card className="w-[350px]" hidden={isHidden}>
            <CardHeader>
                <CardTitle>Edit account </CardTitle>
                <CardDescription>Edit account with id #{account.accountId}</CardDescription>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">User Name</Label>
                            <Input id="name" placeholder={account.nickname} />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" placeholder={account.email}/>
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" placeholder={account.phone} />
                        </div>
            
                    </div>
                </form>
            </CardContent>

            <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={()=>setIsHidden(true)}>Cancel</Button>
                <Button>Update</Button>
            </CardFooter>
        </Card>
    )
}
