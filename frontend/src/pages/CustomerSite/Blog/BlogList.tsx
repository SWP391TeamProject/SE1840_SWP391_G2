
import Footer from '@/components/footer/Footer';
import LoadingAnimation from '@/components/loadingAnimation/LoadingAnimation';
import { BlogCategory } from '@/models/newModel/blogCategory';
import { BlogPost } from '@/models/newModel/blogPost';
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setCurrentBlogPost, setCurrentPageList, setCurrentPageNumber } from '@/redux/reducers/Blogs';
import BlogCategoryService from '@/services/BlogCategoryService';
import BlogService from '@/services/BlogService';
import { useQuery } from '@tanstack/react-query';
import { set } from 'date-fns';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';

export const BlogList = () => {
    const blogPosts = useAppSelector((state) => state.blogs);
    const dispatch = useAppDispatch();
    const [blogCategories, setBlogCategories] = useState([] as any);

    const { isPending, isError, data, error, isLoading } = useQuery({
        queryKey: ['blogs'],
        queryFn: () => BlogService.getAllBlogs(0, 200),
    });


    const handleViewDetailsClick = (id: any) => {
        let blog = blogPosts.currentPageList.find(b => b.postId == id);
        if (blog) {
            dispatch(setCurrentBlogPost(blog));
        }
    }

    useEffect(() => {
        BlogCategoryService.getAllBlogCategories(0, 200)
            .then(
                (response) => {
                    setBlogCategories(response.data.content);
                    console.log(response.data.content);

                }

            ).catch((error) => {
                toast.error(error.message, {
                    position: "bottom-right",
                })
            });
        dispatch(setCurrentPageNumber({ currentPageNumber: 0, totalPages: 0 }));
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {

        if (data) {
            console.log('data', data);
            dispatch(setCurrentPageList(data?.data.content));
            dispatch(setCurrentPageNumber({ pageNumber: data?.data.number, totalPages: data?.data.totalPages }));
        }
    }, [data]);
    if (isLoading) {
        return <LoadingAnimation />
    }

    if (isPending) {
        return <LoadingAnimation />
    }

    if (isError) {
        return <span>Error: {error.message}</span>
    }

    const utc_date = new Date(blogPosts?.currentPageList[0]?.updateDate);
    // Get current UTC date and time

    const blogDate = (`${utc_date.getDate()}/${utc_date.getMonth() < 9 ? '0' : ''}${utc_date.getMonth() + 1}/${utc_date.getFullYear()}`);

    return (
        <>
            <section className="w-full py-12 md:py-2 lg:py-2">
                <div className="container px-4 md:px-6 ">
                    <div className="grid gap-2 ">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">All Blogs</h1>
                        <p className="text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Explore our auction sessions and find your next treasure.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full  mx-auto pt-12 pb-4">
                        <h2 className="text-2xl font-bold mb-4 col-span-full">
                            <div className='my-2'>New Blogs</div>
                            <hr />
                            <hr />

                        </h2>
                        <div className="rounded-lg overflow-hidden shadow-lg border">
                            <img
                                src={blogPosts?.currentPageList[0]?.attachments[0]?.link || "/placeholder.svg"}
                                width={800}
                                height={450}
                                alt="Featured Blog Post"
                                className="w-full h-64 md:h-96 object-cover"
                            />
                            <div className="p-6 bg-white dark:bg-gray-950">
                                <div className="flex items-center gap-2 mb-2">
                                    <img src={blogPosts?.currentPageList[0]?.author?.avatar?.link || "/placeholder.svg"} width={32} height={32} alt="Author Avatar" className="rounded-full" />
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{blogPosts?.currentPageList[0]?.author?.nickname} -</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Published on {blogDate}</div>
                                </div>
                                <h2 className="text-2xl font-bold mb-4">
                                    {blogPosts?.currentPageList[0]?.title}
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 mb-4">
                                    <div className='line-clamp-6' dangerouslySetInnerHTML={{ __html: `${blogPosts?.currentPageList[0]?.content.split('&lt;img/&gt;').join(' ')}` }} />
                                </p>
                                <Link
                                    onClick={() => handleViewDetailsClick(blogPosts?.currentPageList[0]?.postId)}
                                    to={`/blogs/${blogPosts?.currentPageList[0]?.postId}`}
                                    className="inline-flex items-center gap-2 font-medium text-primary hover:underline"
                                >
                                    Read More
                                    <ArrowRightIcon className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {blogPosts?.currentPageList.map((blog, index) => (
                                index === 0 || index > 4 ? null :
                                    <div className="rounded-lg overflow-hidden shadow-lg border" key={blog.postId}>
                                        <img
                                            src={blog?.attachments[0]?.link || "/placeholder.svg"}
                                            width={400}
                                            height={225}
                                            alt="Recent Blog Post"
                                            className="w-full h-40 object-cover"
                                        />
                                        <div className="p-4 bg-white dark:bg-gray-950">
                                            <h3 className="text-lg font-bold mb-2">
                                                {blog?.title}
                                            </h3>
                                            <p className="text-gray-500 dark:text-gray-400 line-clamp-2">
                                                <div dangerouslySetInnerHTML={{ __html: `${blog?.content.split('&lt;img/&gt;').join(' ')}` }} />
                                            </p>
                                            <Link
                                                onClick={() => handleViewDetailsClick(blog.postId)}
                                                to={`/blogs/${blog?.postId}`}
                                                className="inline-flex items-center gap-2 font-medium text-primary hover:underline"
                                            >
                                                Read More
                                                <ArrowRightIcon className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                            ))}
                        </div>
                    </div>
                    {blogCategories?.map((category: BlogCategory) => (
                        blogPosts?.currentPageList?.filter(
                            (blog: BlogPost) => blog.category.blogCategoryId == category.blogCategoryId
                        ).length == 0 ? null :
                            <div key={category.blogCategoryId} className="grid grid-cols-1  gap-6 w-full mx-auto pt-12 pb-4  text-foreground">
                                <h2 className="text-2xl font-bold mb-4 col-span-full m-2">
                                    <div className='my-2'>{category.name} Blogs</div>
                                    <hr />
                                    <hr />
                                </h2>
                                {blogPosts?.currentPageList.map((blog) => (
                                    blog.category.blogCategoryId != category.blogCategoryId ? null :
                                        <div className="rounded-lg overflow-hidden shadow-lg my-5 border" key={blog.postId}>

                                            <div className="flex gap-5 max-md:flex-col max-md:gap-0">
                                                <div className="flex flex-col w-[33%] max-md:ml-0 max-md:w-full">
                                                    <img
                                                        loading="lazy"
                                                        alt=''
                                                        src={blog?.attachments[0]?.link || "/placeholder.svg"}
                                                        className="grow w-full aspect-[1.75] max-md:mt-1.5"
                                                    />
                                                </div>
                                                <div className="flex flex-col ml-5 w-[67%] max-md:ml-0 max-md:w-full">
                                                    <div className="flex flex-col self-stretch px-5 my-auto max-md:mt-3.5 max-md:max-w-full">
                                                        <h3 className="text-lg font-bold mb-2">
                                                            {blog?.title}
                                                        </h3>
                                                        <p className="text-gray-500 dark:text-gray-400 line-clamp-2">
                                                            <div dangerouslySetInnerHTML={{ __html: `${blog?.content.split('&lt;img/&gt;').join(' ')}` }} />
                                                        </p>
                                                        <Link
                                                            onClick={() => handleViewDetailsClick(blog.postId)}
                                                            to={`/blogs/${blog?.postId}`}
                                                            className="inline-flex items-center gap-2 font-medium text-primary hover:underline"
                                                        >
                                                            Read More
                                                            <ArrowRightIcon className="w-4 h-4" />
                                                        </Link>
                                                        <div className="flex gap-5 mt-10 w-full max-md:flex-wrap max-md:max-w-full">
                                                            <div className="flex flex-auto gap-0 text-sm leading-5">
                                                                <img
                                                                    loading="lazy"
                                                                    src={blog?.author?.avatar?.link || "/placeholder.svg"}
                                                                    alt=''
                                                                    className="shrink-0 self-start aspect-square w-6 rounded-full mr-2"
                                                                />
                                                                <div className="flex-auto">
                                                                    {blog?.author?.nickname} - Published on {new Date(blog?.updateDate).getDate()}/{new Date(blog?.updateDate).getMonth() < 9 ? '0' : ''}{new Date(blog?.updateDate).getMonth() + 1}/{new Date(blog?.updateDate).getFullYear()}
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                ))}
                            </div>
                    ))}


                </div>
            </section>
            <div className="sticky z-10 w-full">
                <Footer />
            </div>
        </>
    )
}

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
    )
}