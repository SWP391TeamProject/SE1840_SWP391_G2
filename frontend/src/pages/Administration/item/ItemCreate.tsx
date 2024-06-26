import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { create } from "domain"
import { ItemStatus } from "@/models/Item"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import DropzoneComponent from "@/components/drop-zone/DropZoneComponent"
import { useEffect, useState } from "react"
import { ItemCategoryRequestDTO, createItemCategory, deleteItemCategory, getAllItemCategories } from "@/services/ItemCategoryService"
import { toast } from "react-toastify"
import { ItemCategory } from "@/models/newModel/itemCategory"
import { SelectGroup } from "@radix-ui/react-select"
import axios from "axios"
import { createItem } from "@/services/ItemService"
import { getCookie } from "@/utils/cookies"
import TextEditor from "@/components/component/TextEditor"
import { MinusCircle, PlusCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
const statusValues = Object.values(ItemStatus);

const FormSchema = z.object({
    categoryId: z.string({
        required_error: "Please select category to display.",
    }),
    name: z.string().min(3, {
        message: "Name must be at least 3 characters long.",
    }).max(50, {
        message: "Name must not exceed 50 characters.",
    }),
    description: z.string().min(3, {
        message: "Description must be at least 3 characters long.",
    }).max(50000, {
        message: "Description must not exceed 50000 characters.",
    }),
    reservePrice: z.string(),
    buyInPrice: z.string(),
    status: z.enum(statusValues),
    ownerId: z.number(),
    files: z.any(),
});
export default function ItemCreate() {
    const nav = useNavigate();
    const [categories, setCategories] = useState<ItemCategory[]>([]);
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            description: "",
            status: ItemStatus.QUEUE,
            categoryId: "",
            reservePrice: "0",
            buyInPrice: "0",
            ownerId: JSON.parse(getCookie("user"))?.id || -1,

            files: [],
        },
    })

    useEffect(() => {
        getAllItemCategories(0, 50).then((res) => {
            setCategories(res.data.content)
            console.log(res.data.content);
            // toast.success('Category fetched successfully!');
        }
        ).catch(error => {
            toast.error(error, {
                position: "bottom-right",
            });
        });
    }, [])


    function onSubmit(data: z.infer<typeof FormSchema>) {
        data.categoryId = categories.find((item) => item.name === data.categoryId)?.itemCategoryId;
        console.log(data);
        createItem(data).then((res) => {
            console.log(res);
            toast.success('Item created successfully!', {
                position: "bottom-right",
            });
            nav("/admin/items");
        }
        ).catch(error => {
            console.log(error);
            toast.error(error.response.data.message, {
                position: "bottom-right",
            });
        });



    }
    const createCategory = () => {
        let newCategoy = (document.getElementById("newCategory") as HTMLInputElement).value;
        console.log(newCategoy);
        let category:ItemCategoryRequestDTO = {itemCategoryId:-1,name:newCategoy};
        createItemCategory(category).then((res) => {
            setCategories([...categories, res.data]);
            toast.success("Create success", {
                position: "bottom-right"
            });
            (document.getElementById("newCategory") as HTMLInputElement).value = "";
        }).catch(error => {
            toast.error("Create failed", {
                position: "bottom-right"
            });
        });
    }
    const deleteCategory = (id: number) => {
        deleteItemCategory(id).then((res) => {
            console.log(res);
            if (res.status == 200) {
                let newCategories = categories.filter(x => x.itemCategoryId != id);
                setCategories(newCategories);
                toast.success("Delete success", {
                    position: "bottom-right"
                });
            } else {
                toast.error("Delete failed", {
                    position: "bottom-right"
                });
            }
        }).catch(error => {
            toast.error("Delete failed", {
                position: "bottom-right"
            });
        });
    }
    return (
        <div className="p-10">

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">

                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Item name</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your public display name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={ItemStatus.QUEUE}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a a category to display" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {Object.keys(ItemStatus).map((item: any) => {
                                            return <SelectItem value={item}>{item}</SelectItem>
                                        })}
                                    </SelectContent>
                                </Select>
                                <FormDescription>

                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories?.map((item) => (
                                            <div className="flex  items-center justify-evenly " key={item.itemCategoryId}>
                                                <SelectItem className="w-9/12" value={item.name} >
                                                    {item.name}
                                                </SelectItem>
                                                <Button size="sm" variant="ghost" className="gap-1 w-2/12" onClick={()=>deleteCategory(item.itemCategoryId)}>
                                                    <MinusCircle className="h-full w-6" />
                                                </Button>
                                            </div>

                                        ))}
                                        <div className="flex items-center justify-evenly ">
                                            <Input placeholder="create new category" className='w-9/12' id='newCategory' />
                                            <Button size="sm" variant="ghost" className="gap-1 w-2/12" onClick={createCategory}>
                                                <PlusCircle className="h-full w-6" />
                                            </Button>
                                        </div>
                                    </SelectContent>
                                </Select>
                                <FormDescription>Select the category.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />




                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <TextEditor {...field} placeholder="description..." />
                                    {/* // <Textarea placeholder="shadcn" {...field} /> */}
                                </FormControl>
                                <FormDescription>
                                    This is your public display name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="reservePrice"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Reserve Price</FormLabel>
                                <FormControl>
                                    <Input placeholder="enter reserve price" {...field} />
                                </FormControl>
                                <FormDescription>

                                    this is the reserve price of the item.

                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="buyInPrice"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Buy In Price</FormLabel>
                                <FormControl>
                                    <Input placeholder="enter buy in price" {...field} />
                                </FormControl>
                                <FormDescription>

                                    this is the buy in price of the item.

                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <ScrollArea className="h-[200px]">
                        <FormField
                            control={form.control}
                            name="files"
                            render={({ field }) => (
                                <DropzoneComponent {...field} />
                            )}
                        />

                    </ScrollArea>
                    <Separator />
                    <input type="hidden" {...form.register(`ownerId`)} />

                    <Button className="sticky bottom-1" type="submit">Submit</Button>

                </form>

            </Form>
        </div>

    )
}
