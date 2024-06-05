import LoadingAnimation from "@/components/loadingAnimation/LoadingAnimation"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { IItemCategory } from "@/constants/interfaces"
import { getCookie } from "@/utils/cookies"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

type ProductCategory = {
    categoryP: any;
}

export default function ProductCategory({ categoryP }: ProductCategory) {

    const [category, setCategory] = useState([])

    useEffect(() => {

        fetch('http://localhost:8080/api/item-categories/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + JSON.parse(getCookie('user')).accessToken
            }
        }).then(response => response.json()).then(data => {
            setCategory(data.content)
            toast.success('Category fetched successfully!');
        }).catch(error => {
            toast.error('There was an error!', error);
        });

        console.log(category)
    }, [])
    useEffect(() => {
        console.log(category)
    }, [category])

    return (
        <>
            {category === undefined
                ?
                <LoadingAnimation />
                :
                <Card>
                    <CardHeader>
                        <CardTitle>Product Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 sm:grid-cols-3 w-full">
                            <div className="grid gap-3 w-full">
                                <Label htmlFor="category">Category</Label>
                                <Select >
                                    <SelectTrigger id="category" aria-label="Select category">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {category?.map((item: any) => {
                                            return <SelectItem value={parseInt(item?.itemCategoryId)}>{item.name}</SelectItem>
                                        }
                                        )}
                                        <SelectItem value="accessories">Accessories</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                        </div>
                    </CardContent>
                </Card>
            }

        </>

    )
}
