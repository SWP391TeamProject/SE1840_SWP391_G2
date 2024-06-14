import LoadingAnimation from "@/components/loadingAnimation/LoadingAnimation"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { SERVER_DOMAIN_URL } from "@/constants/domain"
import { getCookie } from "@/utils/cookies"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

type ProductCategory = {
    categoryP: any;
}

export default function ProductCategory({ ...props }) {

    const [category, setCategory] = useState([])

    useEffect(() => {

        fetch(`${SERVER_DOMAIN_URL}/api/item-categories/`, {
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

                                <FormField
                                    control={props.form.control}
                                    name="category.itemCategoryId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} 
                                                defaultValue={field.value}
                                                >
                                                    <SelectTrigger id="category" aria-label="Select category">
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup label="Category">
                                                            <SelectLabel>North America</SelectLabel>
                                                            {category?.map((item: any,index) => {
                                                                return <SelectItem key={index} value={item.itemCategoryId.toString()}>{item.name}</SelectItem>
                                                            }
                                                            )}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                        </div>
                    </CardContent>
                </Card>
            }

        </>

    )
}
