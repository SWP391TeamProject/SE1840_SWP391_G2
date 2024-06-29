import LoadingAnimation from "@/components/loadingAnimation/LoadingAnimation"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
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
import BlogCategoryService from "@/services/BlogCategoryService"
import { getCookie } from "@/utils/cookies"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

type BlogCategory = {
    categoryP: any;
}

export default function BlogCategory({ ...props }) {

    const [categories, setCategories] = useState([])

    useEffect(() => {
        BlogCategoryService.getAllBlogCategories().then((res) => {
            setCategories(res.data.content);
        }).catch((error) => {
            toast.error(error, {
                position: "bottom-right",
            });
        });
        console.log(categories)
    }, [])

    return (
        <>
            {categories === undefined
                ?
                <LoadingAnimation />
                :
                <Card>
                    <CardHeader>
                        <CardTitle>Blog Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className=" w-full">
                            <div className=" w-full">

                                <FormField
                                    control={props.form.control}
                                    name="categoryId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange}
                                                    defaultValue={field.value.toString()}
                                                >
                                                    <SelectTrigger id="category" aria-label="Select category" className="w-full">
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {categories?.map((blog: any, index) => {
                                                                return <SelectItem key={index} value={blog.blogCategoryId.toString()}>{blog.name}</SelectItem>
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
