import LoadingAnimation from '@/components/loadingAnimation/LoadingAnimation';
import PagingIndexes from '@/components/pagination/PagingIndexes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BlogCategory } from '@/models/newModel/blogCategory';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCurrentBlogPost, setCurrentPageList, setCurrentPageNumber } from '@/redux/reducers/Blogs';
import BlogCategoryService from '@/services/BlogCategoryService';
import BlogService from '@/services/BlogService';
import { ListFilter, MinusCircle, MoreHorizontal, PlusCircle } from 'lucide-react';
import React, { Suspense, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { BlogsTable } from './blog-data-table/blog-table';
import { DataTableSkeleton } from '@/components/data-tables/data-tables-skeleton';
import { showErrorToast } from '@/lib/handle-error';

export const BlogPostList = () => {
  const blogsList = useAppSelector((state) => state.blogs);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState(-1);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [filtered, setFiltered] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const url = new URL(window.location.href);
  let pageNumber = url.searchParams.get('page');
  let sort = url.searchParams.get('sort');
  let pageSize = url.searchParams.get('per_page');
  const [blogPromise, setBlogPromise] = useState<Promise<any>>();
  let search = url.searchParams.get('search');
  const handleFilterClick = (category: BlogCategory[], filter: string) => {
    if (filter == 'all') {
      // fetchBlogs(0);
      // setStatusFilter(filter);
      setFiltered(filter);
      setSelectedCategory(-1);
    } else {
      // fetchBlogs(0, category[0].blogCategoryId);
      // setStatusFilter(filter);
      setFiltered(filter);
      setSelectedCategory(category[0].blogCategoryId);
    }
  };

  useEffect(() => {}, [blogsList]);

  useEffect(() => {
    // fetchBlogs(blogsList.currentPageNumber);
    // dispatch(setCurrentPageList(blogsList.value));
    setStatusFilter('all');
    BlogCategoryService.getAllBlogCategories(0, 50)
      .then((res) => {
        setCategories(res.data.content);
        console.log(res.data.content);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const createCategory = () => {
    let newCategoy = (document.getElementById('newCategory') as HTMLInputElement).value;
    console.log(newCategoy);
    BlogCategoryService.createBlogCategory(newCategoy)
      .then((res) => {
        setCategories([...categories, res.data]);
        toast.success('Create success', {
          position: 'bottom-right',
        });
        (document.getElementById('newCategory') as HTMLInputElement).value = '';
      })
      .catch((err) => {
        showErrorToast(err);
      });
  };
  const deleteCategory = (id: number) => {
    BlogCategoryService.deleteBlogCategory(id)
      .then((res) => {
        console.log(res);
        let newCategories = categories.filter((x) => x.blogCategoryId != id);
        setCategories(newCategories);
        toast.success('Delete success', {
          position: 'bottom-right',
        });
      })
      .catch((error) => {
        showErrorToast(error);
      });
  };

  useEffect(() => {
    console.log(pageNumber, pageSize, sort, selectedCategory);
    if (Number.parseInt(pageNumber) >= 1)
      setBlogPromise(
        BlogService.getBlogs({
          page: Number.parseInt(pageNumber),
          size: Number.parseInt(pageSize),
          sort: sort,
          categoryId: selectedCategory,
          search: search,
        })
      );
  }, [pageSize, pageNumber, sort, selectedCategory, search]);

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 ">
      <Tabs defaultValue="all">
        {/* <div className="flex items-center "> */}

        {/* <DropdownMenu>
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
          <div className="ml-auto flex items-center gap-2"> */}
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
        {/* <Button size="sm" className="h-8 gap-1" onClick={() => { handleCreateClick() }}>
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Blog
              </span>
            </Button>
          </div> */}
        {/* </div> */}
        <TabsContent value="all">
          {/* {isLoading ? <LoadingAnimation />
            :  */}
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Blogs
                <div className="w-full basis-1/2">
                  {/* <PagingIndexes pageNumber={blogsList.currentPageNumber ? blogsList.currentPageNumber : 0} totalPages={blogsList.totalPages} pageSelectCallback={handlePageSelect}></PagingIndexes> */}
                </div>
              </CardTitle>
              <CardDescription>Manage blogs and view their details.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* <Table>
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
                      </TableHead> */}
              {/* <TableHead className="md:table-cell">
                                                    Created at
                                                </TableHead> */}
              {/* <TableHead className="md:table-cell">
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
                        </TableCell> */}
              {/* <TableCell>
                                                    <Badge variant="outline">Draft</Badge>
                                                </TableCell> */}
              {/* <TableCell className="md:table-cell">
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
                </Table> */}
              <Suspense
                fallback={
                  <DataTableSkeleton
                    columnCount={5}
                    searchableColumnCount={1}
                    filterableColumnCount={2}
                    cellWidths={['10rem', '40rem', '12rem', '12rem', '8rem']}
                    shrinkZero
                  />
                }
              >
                <div className="flex items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 gap-1">
                        <ListFilter className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuLabel>Category</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem
                        className="w-9/12"
                        checked={filtered == 'all'}
                        onClick={() => handleFilterClick(categories, 'all')}
                      >
                        All
                      </DropdownMenuCheckboxItem>

                      {categories.map((category) => (
                        <div className="flex m-1 items-center justify-between" key={category.blogCategoryId}>
                          <DropdownMenuCheckboxItem
                            className="w-9/12"
                            checked={filtered == category.name}
                            onClick={() => handleFilterClick([category], category.name)}
                          >
                            {category.name}
                          </DropdownMenuCheckboxItem>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="gap-1 w-2/12"
                            onClick={() => deleteCategory(category.blogCategoryId)}
                          >
                            <MinusCircle className="h-full w-full" />
                          </Button>
                        </div>
                      ))}
                    </DropdownMenuContent>
                    <div className="flex m-1 items-center justify-start ">
                      <Input placeholder="new category" className="w-9/12 h-8 mx-2" id="newCategory" />
                      <Button size="sm" variant="ghost" className="gap-1 w-2/12 h-8" onClick={createCategory}>
                        <PlusCircle className="h-full w-full" />
                      </Button>
                    </div>
                  </DropdownMenu>
                </div>

                {/* <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 gap-1">
                        <ListFilter className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Role
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuLabel>Role</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem className='w-9/12' checked={seletedRole == ''} onClick={() => handleFilterClick('All')}>
                        All
                      </DropdownMenuCheckboxItem>


                      {Object.values(RoleName).map((role) => (
                        <div className="flex m-1 items-center justify-between" key={role} >
                          <DropdownMenuCheckboxItem className='w-9/12' checked={seletedRole == role} onClick={() => handleFilterClick(role)} >{role}</DropdownMenuCheckboxItem>
                        </div>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu> */}
                <BlogsTable blogPromise={blogPromise} />
              </Suspense>
            </CardContent>
            <CardFooter>
              {/* <div className="text-xs text-muted-foreground">
                                        Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                                        products
                                    </div> */}
            </CardFooter>
          </Card>
          {/* } */}
        </TabsContent>
      </Tabs>
      {/* {blogsList.value.map((blog) => (
        <EditAcc blog={blog} key={blog.blogId} hidden={true} />
      ))} */}
    </main>
  );
};
