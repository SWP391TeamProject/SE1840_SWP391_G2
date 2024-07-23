import Footer from '@/components/footer/Footer';
import LoadingAnimation from '@/components/loadingAnimation/LoadingAnimation';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { BlogCategory } from '@/models/newModel/blogCategory';
import { BlogPost } from '@/models/newModel/blogPost';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCurrentBlogPost, setCurrentPageList, setCurrentPageNumber } from '@/redux/reducers/Blogs';
import BlogCategoryService from '@/services/BlogCategoryService';
import BlogService from '@/services/BlogService';
import { useQuery } from '@tanstack/react-query';
import { set } from 'date-fns';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import BlogCard from './BlogCard';
import { useDebouncedCallback } from 'use-debounce';
import { parseIntOrUndefined } from '@/lib/utils';
import { error } from 'console';
import { getErrorMessage } from '@/lib/handle-error';

export const BlogList = () => {
  const blogPosts = useAppSelector((state) => state.blogs);
  const dispatch = useAppDispatch();
  const [blogCategories, setBlogCategories] = useState([] as any);
  const [searchParams] = useSearchParams();
  const [blogPromise, setBlogPromise] = useState<any>();

  const handleViewDetailsClick = (id: any) => {
    let blog = blogPosts.currentPageList.find((b) => b.postId == id);
    if (blog) {
      dispatch(setCurrentBlogPost(blog));
    }
  };
  const fetchBlogs = useDebouncedCallback(() => {
    const query = {
      categoryId: parseIntOrUndefined(searchParams.get('categoryId')),
      search: searchParams.get('search'),
      page: parseIntOrUndefined(searchParams.get('page')),
      size: parseIntOrUndefined(searchParams.get('per_page')),
      sort: searchParams.get('sort') || 'postId,desc',
    };

    toast.promise(BlogService.getBlogs(query), {
      loading: 'loading blogs....',
      success: (res) => {
        dispatch(setCurrentPageList(res.data.content));
        dispatch(setCurrentPageNumber({ currentPageNumber: res.data.number, totalPages: res.data.totalPages }));
        return 'blog loaded';
      },
      error: (err) => getErrorMessage(err),
    });

    BlogService.getBlogs(query).then((res) => {});
    // setBlogPromise(BlogService.getBlogs(query));
  }, 500);

  useEffect(() => {
    fetchBlogs();
  }, [searchParams]);

  useEffect(() => {
    BlogCategoryService.getAllBlogCategories(0, 200)
      .then((response) => {
        setBlogCategories(response.data.content as BlogCategory);
        // console.log(response.data.content);
      })
      .catch((error) => {
        toast.error(error.message, {});
      });
    dispatch(setCurrentPageNumber({ currentPageNumber: 0, totalPages: 0 }));
    window.scrollTo(0, 0);
  }, []);

  // useEffect(() => {
  //   if (data) {
  //     console.log('data', data);
  //     dispatch(setCurrentPageList(data?.data.content));
  //     dispatch(setCurrentPageNumber({ pageNumber: data?.data.number, totalPages: data?.data.totalPages }));
  //   }
  // }, [data]);
  // const utc_date = new Date(blogPosts?.currentPageList[0]?.updateDate);
  // Get current UTC date and time

  return (
    <>
      <div className="grid min-h-svh container">
        <div className="grid-cols-12 p-1">
          <div id="category-section" className="col-span-12 m-3">
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">Recent Blogs</h2>
            <NavigationMenu>
              <NavigationMenuList className="flex flex-wrap gap-2 mt-4">
                <NavigationMenuItem className="hover:cursor-pointer">
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle() + 'border rounded-lg'}>
                    <Link to={`/blogs`}>All Blogs</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                {blogCategories?.map((category) => (
                  <NavigationMenuItem key={category.id} className="hover:cursor-pointer">
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle() + 'border rounded-lg'}>
                      <Link to={`/blogs?categoryId=${category.blogCategoryId}`}>{category.name}</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div id="blog-section" className="col-span-12 w-full p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2  mx-auto place-items-center">
              {blogPosts ? (
                blogPosts?.currentPageList.map((post, index) => (
                  <BlogCard className={'mt-5'} key={post.postId || index} blog={post} />
                ))
              ) : (
                <LoadingAnimation />
              )}
              {/* <BlogCard  />
                <BlogCard  />
                <BlogCard  />
                <BlogCard  />
                <BlogCard  /> */}
            </div>
          </div>
          <div></div>
        </div>
      </div>

      {/* <div className="sticky z-10 w-full">
                <Footer />
            </div> */}
    </>
  );
};

function ArrowRightIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
