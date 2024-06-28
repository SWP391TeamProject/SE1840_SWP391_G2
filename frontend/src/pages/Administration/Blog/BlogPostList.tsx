import PagingIndexes from '@/components/pagination/PagingIndexes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BlogCategory } from '@/models/newModel/blogCategory';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCurrentBlogPost, setCurrentPageList, setCurrentPageNumber } from '@/redux/reducers/Blogs';
import BlogCategoryService from '@/services/BlogCategoryService';
import BlogService from '@/services/BlogService';
import { ListFilter, MinusCircle, MoreHorizontal, PlusCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const BlogPostList = () => {
  const blogsList = useAppSelector((state) => state.blogs);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [filtered, setFiltered] = useState("all");
  const fetchBlogs = async (pageNumber: number) => {
    try {
      const res = await BlogService.getAllBlogs(pageNumber, 5);
      if (res) {
        console.log(res);

        dispatch(setCurrentPageList(res.data.content)); // Update currentPageList here
        let paging: any = {
          pageNumber: res.data.number,
          totalPages: res.data.totalPages
        }
        dispatch(setCurrentPageNumber(paging));
      }

    } catch (error) {
      console.log(error);
    }
  };

  const handlePageSelect = (pageNumber: number) => {
    fetchBlogs(pageNumber);
  }

  const handleEditClick = (blogId: number) => {
    let blog = blogsList.value.find(blog => blog.postId == blogId);
    console.log(blog);
    // return (<EditAcc blog={blog!} key={blog!.blogId} hidden={false} />);
    dispatch(setCurrentBlogPost(blog));
    navigate("/admin/blogs/edit");
  }

  const handleCreateClick = () => {
    // let blog = blogsList.value.find(blog => blog.blogId == blogId);
    // console.log(blog);
    // // return (<EditAcc blog={blog!} key={blog!.blogId} hidden={false} />);
    // dispatch(setCurrentBlog(blog));
    navigate("/admin/blogs/create");
  }

  const handleDetailClick = (blogId: number) => {
    // console.log(blog);
    // return (<EditAcc blog={blog!} key={blog!.blogId} hidden={false} />);
    // dispatch(setCurrentBlog(blog));
    // navigate("/admin/blogs/edit");
    let blog = blogsList.currentPageList.find(blog => blog.postId == blogId);
    dispatch(setCurrentBlogPost(blog));
    navigate(`/admin/blogs/${blogId}`);
  }

  const handleFilterClick = (category: BlogCategory[], filter: string) => {
    let filteredList = blogsList.currentPageList.filter(x => category.includes(x.category));
    console.log(filteredList);
    dispatch(setCurrentPageList(filteredList));
    setStatusFilter(filter);
    setFiltered(filter);
  }


  useEffect(() => { }, [blogsList]);

  useEffect(() => {
    fetchBlogs(blogsList.currentPageNumber);
    dispatch(setCurrentPageList(blogsList.value));
    setStatusFilter("all");
    BlogCategoryService.getAllBlogCategories(0, 50).then((res) => {
      setCategories(res.data.content)
      console.log(res.data.content);
    }).catch(error => {
      console.log(error);
    });
  }, []);

  const createCategory = () => {
    let newCategoy = (document.getElementById("newCategory") as HTMLInputElement).value;
    console.log(newCategoy);
    BlogCategoryService.createBlogCategory(newCategoy).then((res) => {
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
    BlogCategoryService.deleteBlogCategory(id).then((res) => {
      console.log(res);
      if (res.status == 204) {
        let newCategories = categories.filter(x => x.blogCategoryId != id);
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
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 ">
      <Tabs defaultValue="all">
        <div className="flex items-center ">

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem className='w-9/12' checked={filtered == 'all'} onClick={() => handleFilterClick(categories, 'all')}>
                All
              </DropdownMenuCheckboxItem>


              {categories.map((category) => (
                <div className="flex m-1 items-center justify-between" key={category.blogCategoryId} >
                  <DropdownMenuCheckboxItem className='w-9/12' checked={filtered == category.name} onClick={() => handleFilterClick([category], category.name)} >{category.name}</DropdownMenuCheckboxItem>
                  <Button size="sm" variant="ghost" className="gap-1 w-2/12" onClick={() => deleteCategory(category.blogCategoryId)}>
                    <MinusCircle className="h-full w-full" />
                  </Button>
                </div>
              ))}


            </DropdownMenuContent>
            <div className="flex m-1 items-center justify-start ">
              <Input placeholder="new category" className='w-9/12 h-8 mx-2' id='newCategory' />
              <Button size="sm" variant="ghost" className="gap-1 w-2/12 h-8" onClick={createCategory}>
                <PlusCircle className="h-full w-full" />
              </Button>
            </div>
          </DropdownMenu>
          <div className="ml-auto flex items-center gap-2">
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filter
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>
                  Active
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
            {/* <Button size="sm" variant="outline" className="h-8 gap-1">
                                    <File className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                        Export
                                    </span>
                                </Button> */}
            <Button size="sm" className="h-8 gap-1" onClick={() => { handleCreateClick() }}>
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Blog
              </span>
            </Button>
          </div>
        </div>
        <TabsContent value={statusFilter}>
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Blogs
                <div className="w-full basis-1/2">
                  <PagingIndexes pageNumber={blogsList.currentPageNumber ? blogsList.currentPageNumber : 0} totalPages={blogsList.totalPages} pageSelectCallback={handlePageSelect}></PagingIndexes>
                </div>
              </CardTitle>
              <CardDescription>
                Manage blogs and view their details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Id</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="md:table-cell">
                      create Date
                    </TableHead>
                    <TableHead className="md:table-cell">
                      Author
                    </TableHead>
                    <TableHead className="md:table-cell">
                      Category
                    </TableHead>
                    {/* <TableHead className="md:table-cell">
                                                    Created at
                                                </TableHead> */}
                    <TableHead className="md:table-cell">
                      Action
                    </TableHead>
                    <TableHead>
                      <span className="sr-only">More Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogsList.currentPageList.map((blog) => (
                    <TableRow key={blog.postId}>
                      <TableCell className="font-medium">
                        {blog.postId}
                      </TableCell>
                      {/* <TableCell>
                                                    <Badge variant="outline">Draft</Badge>
                                                </TableCell> */}
                      <TableCell className="md:table-cell">
                        {blog.title}
                      </TableCell>
                      <TableCell className="md:table-cell">
                        {new Date(blog.createDate).toLocaleDateString('en-US')}
                      </TableCell>
                      <TableCell className="md:table-cell">
                        {blog.author ? blog.author.nickname : "Unknown"}
                      </TableCell>
                      <TableCell className="md:table-cell">
                        {blog.category ? blog.category.name : "Unknown"}
                      </TableCell>


                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => { handleEditClick(blog.postId) }}>Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { handleDetailClick(blog.postId) }}>Detail</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>

                  ))}
                </TableBody>
              </Table>

            </CardContent>
            <CardFooter>
              {/* <div className="text-xs text-muted-foreground">
                                        Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                                        products
                                    </div> */}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      {/* {blogsList.value.map((blog) => (
        <EditAcc blog={blog} key={blog.blogId} hidden={true} />
      ))} */}
    </main>
  );
}
