import TextEditor from '@/components/component/TextEditor'
import DropzoneComponent from '@/components/drop-zone/DropZoneComponent'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { BlogCategory } from '@/models/newModel/blogCategory'
import BlogCategoryService from '@/services/BlogCategoryService'
import BlogService from '@/services/BlogService'
import { getCookie } from '@/utils/cookies'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'

const formSchema = z.object({
    categoryId: z.any({
        required_error: "Please select category to display.",
    }),
    userId: z.number(),
    title: z.string().min(5, {
        message: "Title must be at least 5 characters long.",
    }).max(200, {
        message: "Tile must not exceed 200 characters.",
    }),
    content: z.string().min(10, {
        message: "Description must be at least 10 characters long.",
    }).max(100000, {
        message: "Description must not exceed 100000 characters.",
    }),
    files: z.any(),
}).required(
    {
        categoryId: true,
        userId: true,
        title: true,
        content: true,
        files: true
    }
);
export const CreateBlog = () => {
    const [category, setCategory] = useState<BlogCategory[]>([]);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            categoryId: "",
            title: "",
            content: "",
            userId: -1,
            files: [],
        },
    });

    useEffect(() => {
        BlogCategoryService.getAllBlogCategories(0, 50).then((res) => {
            setCategory(res.data.content)
            console.log(res.data.content);
            // toast.success('Category fetched successfully!');
        }
        ).catch(error => {
            toast.error('There was an error!', error);
        });
    }, [])
    function onSubmit(data: z.infer<typeof formSchema>) {
        data.categoryId = category.find((blog) => blog.name === data.categoryId)?.blogCategoryId;
        data.userId = JSON.parse(getCookie('user') || '{}').id;
        console.log(data);
        BlogService.createBlog(data).then((res) => {
            console.log(res);
            toast.success('Blog created successfully!');
            form.reset();
        }
        ).catch(error => {
            console.log(error);
            toast.error('There was an error!', error);
        });

    }
    return (
        <main className="flex-1 py-8 px-6">
            <div className="container mx-auto max-w-6xl">
                <h1 className="text-3xl font-bold mb-4 ">Create New Blog Post</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">

                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Blog's title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="shadcn" {...field} />
                                    </FormControl>
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
                                            {category?.map((blog) => (
                                                <SelectItem key={blog.blogCategoryId} value={blog.name} >
                                                    {blog.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>Select the category.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <TextEditor {...field} placeholder="description..." />
                                        {/* // <Textarea placeholder="shadcn" {...field} /> */}
                                    </FormControl>
                                    <FormDescription>
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
                        <input type="hidden" {...form.register(`userId`)} />

                        <Button className="sticky bottom-1" type="submit">Submit</Button>
                    </form>
                </Form>
            </div>
        </main>
    )
}
